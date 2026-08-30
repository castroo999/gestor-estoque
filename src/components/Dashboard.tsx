import "./Dashboard.css";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Produto = {
  id: string;
  nome: string;
  preco: number;
  qnt: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const COLORS = ["#ef5350", "#f4b860", "#4fb286"];

const formatarDinheiro = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  function voltar() {
    navigate("/home");
  }

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarProdutos() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/produtos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dados = await resposta.json();

        if (resposta.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
          return;
        }

        if (!resposta.ok) {
          setErro(dados.mensagem ?? "Erro ao carregar o dashboard");
          return;
        }

        if (!Array.isArray(dados)) {
          setErro("A resposta do servidor não é uma lista de produtos");
          return;
        }

        setProdutos(dados);
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, [navigate]);

  const totalProdutos = produtos.length;

  const totalUnidades = produtos.reduce(
    (total, produto) => total + produto.qnt,
    0,
  );

  const valorTotalEstoque = produtos.reduce(
    (total, produto) => total + produto.preco * produto.qnt,
    0,
  );

  const produtosEsgotados = produtos.filter(
    (produto) => produto.qnt === 0,
  ).length;

  const produtosBaixoEstoque = produtos.filter(
    (produto) => produto.qnt > 0 && produto.qnt <= 5,
  ).length;

  const produtosEstoqueNormal = produtos.filter(
    (produto) => produto.qnt > 5,
  ).length;

  const dadosGraficoEstoque = [
    {
      name: "Esgotados",
      value: produtosEsgotados,
    },
    {
      name: "Estoque baixo",
      value: produtosBaixoEstoque,
    },
    {
      name: "Estoque normal",
      value: produtosEstoqueNormal,
    },
  ];

  const produtosComMaiorEstoque = [...produtos]
    .sort((produtoA, produtoB) => produtoB.qnt - produtoA.qnt)
    .slice(0, 8);

  function verificarStatus(qnt: number) {
    if (qnt === 0) {
      return {
        texto: "Esgotado",
        classe: "status-esgotado",
      };
    }

    if (qnt <= 5) {
      return {
        texto: "Estoque baixo",
        classe: "status-baixo",
      };
    }

    return {
      texto: "Estoque normal",
      classe: "status-normal",
    };
  }

  if (carregando) {
    return <p className="mensagem-dashboard">Carregando dashboard...</p>;
  }

  if (erro) {
    return <p className="mensagem-dashboard erro-dashboard">{erro}</p>;
  }

  return (
    <main className="dashboard">
      <header className="dashboard-cabecalho">
        <button className="voltar" type="button" onClick={voltar}>
          <ChevronLeft size={18} />
          Voltar
        </button>
        <span className="dashboard-etiqueta">Gestão de estoque</span>
        <h1>Visão geral do seu estoque</h1>
        <p>Acompanhe produtos, quantidades e o valor armazenado.</p>
      </header>

      <section className="cards-dashboard">
        <article className="card-dashboard">
          <span>Produtos cadastrados</span>
          <strong>{totalProdutos}</strong>
        </article>

        <article className="card-dashboard">
          <span>Unidades em estoque</span>
          <strong>{totalUnidades}</strong>
        </article>

        <article className="card-dashboard">
          <span>Valor total em estoque</span>
          <strong>{formatarDinheiro(valorTotalEstoque)}</strong>
        </article>

        <article className="card-dashboard card-atencao">
          <span>Produtos com estoque baixo</span>
          <strong>{produtosBaixoEstoque}</strong>
        </article>

        <article className="card-dashboard card-perigo">
          <span>Produtos esgotados</span>
          <strong>{produtosEsgotados}</strong>
        </article>
      </section>

      {produtos.length === 0 ? (
        <section className="estoque-vazio">
          <h2>Nenhum produto cadastrado</h2>
          <p>Cadastre produtos para visualizar as estatísticas.</p>

          <button type="button" onClick={() => navigate("/adicionar-produto")}>
            Cadastrar produto
          </button>
        </section>
      ) : (
        <>
          <section className="graficos-dashboard">
            <article className="grafico-dashboard">
              <h2>Situação do estoque</h2>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={dadosGraficoEstoque}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    dataKey="value"
                    nameKey="name"
                  >
                    {dadosGraficoEstoque.map((item, index) => (
                      <Cell key={item.name} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </article>

            <article className="grafico-dashboard">
              <h2>Produtos com maior quantidade</h2>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={produtosComMaiorEstoque}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="qnt"
                    name="Quantidade"
                    fill="#f4b860"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </article>
          </section>

          <section className="tabela-dashboard">
            <table>
              <caption>Produtos cadastrados</caption>

              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Valor armazenado</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {produtos.map((produto) => {
                  const status = verificarStatus(produto.qnt);

                  return (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>
                      <td>{formatarDinheiro(produto.preco)}</td>
                      <td>{produto.qnt}</td>
                      <td>{formatarDinheiro(produto.preco * produto.qnt)}</td>
                      <td>
                        <span className={`status ${status.classe}`}>
                          {status.texto}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  );
}

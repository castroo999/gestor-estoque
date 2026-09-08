import { ChevronLeft } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type Funcionario = {
  id: string;
  nome: string;
  matricula: string;
  ativo: boolean;
};

type Produto = {
  id: string;
  nome: string;
  qnt: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function AddInventario() {
  const [funcionarioId, setFuncionarioId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  function voltar() {
    navigate("/funcionarios");
  }

  useEffect(() => {
    async function carregarDados() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [respostaFuncionarios, respostaProdutos] = await Promise.all([
          fetch(`${API_URL}/funcionarios`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/produtos`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (
          respostaFuncionarios.status === 401 ||
          respostaProdutos.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
          return;
        }

        const dadosFuncionarios = await respostaFuncionarios.json();

        const dadosProdutos = await respostaProdutos.json();

        if (!respostaFuncionarios.ok) {
          setErro(
            dadosFuncionarios.mensagem ?? "Erro ao carregar os funcionários",
          );
          return;
        }

        if (!respostaProdutos.ok) {
          setErro(dadosProdutos.mensagem ?? "Erro ao carregar os produtos");
          return;
        }

        if (
          !Array.isArray(dadosFuncionarios) ||
          !Array.isArray(dadosProdutos)
        ) {
          setErro("Resposta inválida recebida do servidor");
          return;
        }

        setFuncionarios(
          dadosFuncionarios.filter(
            (funcionario: Funcionario) => funcionario.ativo,
          ),
        );

        setProdutos(
          dadosProdutos.filter((produto: Produto) => produto.qnt > 0),
        );
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [navigate]);

  async function adicionarAoInventario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const token = localStorage.getItem("token");
    const quantidadeNumero = Number(quantidade);

    if (!token) {
      navigate("/login");
      return;
    }

    if (!funcionarioId || !produtoId) {
      setErro("Selecione o funcionário e o produto");
      return;
    }

    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero <= 0) {
      setErro("Informe uma quantidade válida");
      return;
    }

    try {
      setEnviando(true);

      const resposta = await fetch(`${API_URL}/entregas/registrar-entrega`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          funcionarioId,
          produtoId,
          quantidade: quantidadeNumero,
          observacao: observacao.trim() || undefined,
        }),
      });

      const dados = await resposta.json();

      if (resposta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
        return;
      }

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Erro ao registrar a entrega");
        return;
      }

      alert("Produto adicionado ao inventário!");

      setProdutoId("");
      setQuantidade("");
      setObservacao("");

      navigate('/funcionarios');
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <p>Carregando dados...</p>;
  }

  return (
    <main>
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>

      <form onSubmit={adicionarAoInventario}>
        <h1>Adicionar ao inventário</h1>

        <label htmlFor="funcionario">Funcionário</label>

        <select
          id="funcionario"
          value={funcionarioId}
          onChange={(e) => setFuncionarioId(e.target.value)}
          required
        >
          <option value="">Selecione um funcionário</option>

          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.nome} — {funcionario.matricula}
            </option>
          ))}
        </select>

        <label htmlFor="produto">Produto</label>

        <select
          id="produto"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          required
        >
          <option value="">Selecione um produto</option>

          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome} — {produto.qnt} disponíveis
            </option>
          ))}
        </select>

        <label htmlFor="quantidade">Quantidade entregue</label>

        <input
          id="quantidade"
          type="number"
          min="1"
          step="1"
          placeholder="Digite a quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />

        <label htmlFor="observacao">Observação</label>

        <textarea
          id="observacao"
          placeholder="Observação opcional"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        {erro && <p className="mensagem-erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Registrando..." : "Registrar entrega"}
        </button>
      </form>
    </main>
  );
}

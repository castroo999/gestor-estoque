import "./VerInventario.css";
import { ChevronLeft, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



type Funcionario = {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  setor: string;
  ativo: boolean;
};

type Produto = {
  id: string;
  nome: string;
  tipo: "COMUM" | "EPI";
  ca: string | null;
  validadeCA: string | null;
  lote: string | null;
  tamanho: string | null;
  fabricante: string | null;
};

type Responsavel = {
  id: string;
  nome: string;
  email: string;
};

type Entrega = {
  id: string;
  quantidade: number;
  entregueEm: string;
  devolvidoEm: string | null;
  observacao: string | null;
  produto: Produto;
  responsavel: Responsavel;
};

type InventarioResponse = {
  funcionario: Funcionario;
  entregas: Entrega[];
};

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function formatarData(data: string | null) {
  if (!data) {
    return "Não informada";
  }

  return new Date(data).toLocaleString("pt-BR");
}

export default function VerInventario() {
  const { funcionarioId } = useParams<{
    funcionarioId: string;
  }>();

  const [funcionario, setFuncionario] =
    useState<Funcionario | null>(null);

  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarInventario() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!funcionarioId) {
        setErro("ID do funcionário não encontrado");
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          `${API_URL}/funcionarios/${funcionarioId}/inventario`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const dados = await resposta.json();

        if (resposta.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
          return;
        }

        if (!resposta.ok) {
          setErro(
            dados.mensagem ??
              "Não foi possível carregar o inventário",
          );
          return;
        }

        const inventario = dados as InventarioResponse;

        setFuncionario(inventario.funcionario);
        setEntregas(inventario.entregas);
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregarInventario();
  }, [funcionarioId, navigate]);

  if (carregando) {
    return (
      <p className="mensagem-inventario">
        Carregando inventário...
      </p>
    );
  }

  if (erro) {
    return (
      <main className="pagina-inventario">
        <button
          className="voltar"
          type="button"
          onClick={() => navigate("/funcionarios")}
        >
          <ChevronLeft size={18} />
          Voltar
        </button>

        <p className="mensagem-erro">{erro}</p>
      </main>
    );
  }

  if (!funcionario) {
    return null;
  }

  return (
    <main className="pagina-inventario">
      <button
        className="voltar"
        type="button"
        onClick={() => navigate("/funcionarios")}
      >
        <ChevronLeft size={18} />
        Voltar
      </button>

      <header className="cabecalho-inventario">
        <div>
          <span>Inventário do funcionário</span>
          <h1>{funcionario.nome}</h1>

          <p>
            Matrícula: {funcionario.matricula} ·{" "}
            {funcionario.cargo} · {funcionario.setor}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/add-inventario")}
        >
          <PackagePlus size={18} />
          Registrar entrega
        </button>
      </header>

      {entregas.length === 0 ? (
        <section className="inventario-vazio">
          <h2>Nenhum EPI entregue</h2>
          <p>
            Esse funcionário ainda não recebeu nenhum EPI.
          </p>
        </section>
      ) : (
        <section className="lista-inventario">
          {entregas.map((entrega) => (
            <article
              key={entrega.id}
              className="card-inventario"
            >
              <div className="topo-card-inventario">
                <div>
                  <span className="etiqueta-epi">EPI</span>
                  <h2>{entrega.produto.nome}</h2>
                </div>

                <span
                  className={
                    entrega.devolvidoEm
                      ? "status-entrega devolvido"
                      : "status-entrega entregue"
                  }
                >
                  {entrega.devolvidoEm
                    ? "Devolvido"
                    : "Com o funcionário"}
                </span>
              </div>

              <div className="dados-inventario">
                <p>
                  <strong>Quantidade:</strong>{" "}
                  {entrega.quantidade}
                </p>

                <p>
                  <strong>Entregue em:</strong>{" "}
                  {formatarData(entrega.entregueEm)}
                </p>

                <p>
                  <strong>CA:</strong>{" "}
                  {entrega.produto.ca ?? "Não informado"}
                </p>

                <p>
                  <strong>Validade do CA:</strong>{" "}
                  {formatarData(
                    entrega.produto.validadeCA,
                  )}
                </p>

                {entrega.produto.fabricante && (
                  <p>
                    <strong>Fabricante:</strong>{" "}
                    {entrega.produto.fabricante}
                  </p>
                )}

                {entrega.produto.lote && (
                  <p>
                    <strong>Lote:</strong>{" "}
                    {entrega.produto.lote}
                  </p>
                )}

                {entrega.produto.tamanho && (
                  <p>
                    <strong>Tamanho:</strong>{" "}
                    {entrega.produto.tamanho}
                  </p>
                )}

                <p>
                  <strong>Responsável:</strong>{" "}
                  {entrega.responsavel.nome}
                </p>

                {entrega.devolvidoEm && (
                  <p>
                    <strong>Devolvido em:</strong>{" "}
                    {formatarData(entrega.devolvidoEm)}
                  </p>
                )}
              </div>

              {entrega.observacao && (
                <p className="observacao-inventario">
                  <strong>Observação:</strong>{" "}
                  {entrega.observacao}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { deletarFuncionario } from "../scripts/deletarFuncionarios";
import "./ListarFuncionario.css";

type Funcionario = {
  id: string;
  nome: string;
  cpf: string | null;
  matricula: string;
  cargo: string;
  setor: string;
  ativo: boolean;
  criadoEm: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function ListarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  function voltar() {
    navigate("/home");
  }

  async function handleDeletarFuncionario(id: string) {
    const confirmou = window.confirm(
      "Tem certeza que deseja deletar este produto?",
    );

    if (!confirmou) {
      return;
    }
    
    try {
      await deletarFuncionario(id);

      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setErro("Erro ao deletar o funcionário");
    }
  }

  useEffect(() => {
    async function carregarFuncionarios() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/funcionarios`, {
          method: "GET",
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
          setErro(
            dados.mensagem ?? "Não foi possível carregar os funcionários",
          );
          return;
        }

        if (!Array.isArray(dados)) {
          setErro("A resposta do servidor não é uma lista");
          return;
        }

        setFuncionarios(dados);
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregarFuncionarios();
  }, [navigate]);

  const buscaPadrao = busca.toLowerCase().trim();

  const funcionariosFiltrados = funcionarios.filter((funcionario) => {
    return (
      funcionario.nome.toLowerCase().includes(buscaPadrao) ||
      funcionario.matricula.toLowerCase().includes(buscaPadrao) ||
      funcionario.cargo.toLowerCase().includes(buscaPadrao) ||
      funcionario.setor.toLowerCase().includes(buscaPadrao)
    );
  });

  if (carregando) {
    return <p>Carregando funcionários...</p>;
  }

  return (
    <main className="pagina-funcionarios">
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>
      <header className="cabecalho-funcionarios">
        <div>
          <h1>Funcionários</h1>
          <p>Gerencie os funcionários registrados na sua conta.</p>
        </div>

        <button type="button" onClick={() => navigate("/add-funcionario")}>
          Cadastrar funcionário
        </button>
      </header>

      <input
        type="search"
        placeholder="Buscar por nome, matrícula, cargo ou setor"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {erro && <p className="mensagem-erro">{erro}</p>}

      {!erro && funcionarios.length === 0 && (
        <section className="funcionarios-vazio">
          <h2>Nenhum funcionário cadastrado</h2>
          <p>Cadastre o primeiro funcionário da sua empresa.</p>
        </section>
      )}

      {funcionarios.length > 0 && funcionariosFiltrados.length === 0 && (
        <p>Nenhum funcionário encontrado para essa busca.</p>
      )}

      <section className="lista-funcionarios">
        {funcionariosFiltrados.map((funcionario) => (
          <article key={funcionario.id} className="card-funcionario">
            <div>
              <h2>{funcionario.nome}</h2>

              <span
                className={
                  funcionario.ativo
                    ? "funcionario-ativo"
                    : "funcionario-inativo"
                }
              >
                {funcionario.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>

            <p>
              <strong>Matrícula:</strong> {funcionario.matricula}
            </p>

            <p>
              <strong>Cargo:</strong> {funcionario.cargo}
            </p>

            <p>
              <strong>Setor:</strong> {funcionario.setor}
            </p>

            {funcionario.cpf && (
              <p>
                <strong>CPF:</strong> {funcionario.cpf}
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate(`/editar-funcionario/${funcionario.id}`)}
            >
              Editar dados
            </button>

            <button
              type="button"
              onClick={() => handleDeletarFuncionario(funcionario.id)}
            >
              Deletar
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

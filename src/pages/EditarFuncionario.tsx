import { ChevronLeft } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarFuncionario() {
  const [nomeEditado, setNomeEditado] = useState("");
  const [cpfEditado, setCpfEditado] = useState("");
  const [matriculaEditado, setMatriculaEditado] = useState("");
  const [setorEditado, setSetorEditado] = useState("");
  const [cargoEditado, setCargoEditado] = useState("");
  const { id } = useParams<{ id: string }>();
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function Voltar() {
    navigate("/home");
  }

  useEffect(() => {
    async function carregarFuncionario() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("login");
        return;
      }

      if (!id) {
        setErro("ID do funcionario não encontrado");
        return;
      }

      try {
        const resposta = await fetch(
          `http://localhost:3000/funcionarios/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setErro(dados.mensagem ?? "Erro ao carregar o funcionário");
          return;
        }

        const funcionario = dados.funcionario;

        setNomeEditado(funcionario.nome);
        setCpfEditado(funcionario.cpf ?? "");
        setMatriculaEditado(funcionario.matricula);
        setCargoEditado(funcionario.cargo);
        setSetorEditado(funcionario.setor);
        setErro("");
      } catch {
        setErro("Erro ao carregar funcionarios");
      }
    }

    carregarFuncionario();
  }, [id, navigate]);

  async function editarFuncionario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Erro token invalido");
      return;
    }

    if (!id) {
      setErro("Erro id invalido");
      return;
    }

    if (
      !nomeEditado.trim() ||
      !cpfEditado ||
      !matriculaEditado ||
      !cargoEditado ||
      !setCargoEditado
    ) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const resposta = await fetch(
        `http//localhost3000/funcionarios/buscar-funcionario${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nomeEditado.trim(),
            cpfEditado: String(cpfEditado),
            matriculaEditado: String(matriculaEditado),
            setorEditado: String(setorEditado),
          }),
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Erro ao editar funcionario");
        return;
      }

      alert("Funcionario editado com sucesso");
      navigate("/home");
    } catch {
      setErro("Erro ao editar funcionario");
    }
  }

  return (
    <main>
      <button className="voltar" type="button" onClick={Voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>
      <form onSubmit={editarFuncionario}>
        <h1>Editar funcionario</h1>

        <label htmlFor="nome">Nome do funcionario</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome do funcionario"
          value={nomeEditado}
          onChange={(e) => setNomeEditado(e.target.value)}
        />

        <label htmlFor="cpf">CPF do funcionario</label>
        <input
          id="cpf"
          type="text"
          placeholder="Digite o CPF do funcionario"
          value={cpfEditado}
          onChange={(e) => setCpfEditado(e.target.value)}
        />

        <label htmlFor="matricula">Matricula do funcionario</label>
        <input
          id="matricula"
          type="text"
          placeholder="Digite a matricula do funcionario"
          value={matriculaEditado}
          onChange={(e) => setMatriculaEditado(e.target.value)}
        />

        <label htmlFor="cargo">Cargo do funcionario</label>
        <input
          id="cargo"
          type="text"
          placeholder="Digite o cargo do funcionario"
          value={cargoEditado}
          onChange={(e) => setCargoEditado(e.target.value)}
        />

        <label htmlFor="setor">Setor do funcionario</label>
        <input
          id="setor"
          type="text"
          placeholder="Digite o setor do funcionario"
          value={setorEditado}
          onChange={(e) => setSetorEditado(e.target.value)}
        />

        {erro && <p>{erro}</p>}

        <button type="submit">Salvar Edição</button>
      </form>
    </main>
  );
}

import { ChevronLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function AddFuncionario() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  function voltar() {
    navigate("/home");
  }

  async function cadastrarFuncionario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("token invalido ou não registrado");
      navigate("/login");
      return;
    }

    if (!nome.trim() || !cpf || !matricula || !cargo || !setor) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3000/funcionarios/add-funcionario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nome.trim(),
            cpf: cpf.trim(),
            matricula: matricula.trim(),
            setor: setor.trim(),
            cargo: cargo.trim(),
          }),
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Erro ao cadastrar o produto");
        return;
      }

      setNome("");
      setCpf("");
      setSetor("");
      setMatricula("");
      setCargo("");

      alert("Funcionario cadastrado com sucesso!");
      navigate("/home");
    } catch {
      setErro("Não foi possível conectar ao servidor");
    }
  }

  return (
    <main>
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>
      <form onSubmit={cadastrarFuncionario}>
        <h1>Cadastrar um funcionario</h1>

        <label htmlFor="nome">Nome do funcionario</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label htmlFor="cpf">Cpf do funcionario</label>
        <input
          id="cpf"
          type="text"
          placeholder="Cpf do funcionario"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <label htmlFor="matricula">Matricula do Funcionario</label>
        <input
          id="matricula"
          type="text"
          placeholder="Matricula do Funcionario"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />

        <label htmlFor="setor">Setor do Funcionario</label>
        <input
          id="setor"
          type="text"
          placeholder="Setor do Funcionario"
          value={setor}
          onChange={(e) => setSetor(e.target.value)}
        />

        <label htmlFor="cargo">Cargo do Funcionario</label>
        <input
          id="cargo"
          type="text"
          placeholder="Cargo do Funcionario"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />

        {erro && <p>{erro}</p>}

        <button type="submit">Cadastrar funcionario</button>
      </form>
    </main>
  );
}

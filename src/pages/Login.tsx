import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function fazerLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("")

    try {
      const resposta = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Não foi possível fazer login");
        return;
      }

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));

      alert("Login efetuado com sucesso")
      navigate("/home");
    } catch {
      setErro("não foi possivel efetuar login");
    }
  }

  return (
    <main>
      <form onSubmit={fazerLogin}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p>{erro}</p>}

        <button type="submit">Entrar</button>
        <p>
          Não tem uma conta? <Link to={"/cadastrar"}>CADASTRAR</Link>
        </p>
      </form>
    </main>
  );
}

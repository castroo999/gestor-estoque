import './Login.css'
import { useState } from "react";
import {useNavigate} from 'react-router-dom'

type Usuario = {
  email: string;
  senha: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate()

  const usuarioFake: Usuario = {
    email: "castro@email.com",
    senha: "123456",
  };

  function fazerLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email === usuarioFake.email && senha === usuarioFake.senha) {
      setErro("");
      alert("Login realizado com sucesso!");
    } else {
      setErro("Email ou senha inválidos.");
    }

     if (email === "castro@email.com" && senha === "123456") {
    navigate("/home");
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
      </form>
    </main>
  );
}
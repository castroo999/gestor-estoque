import { ChevronLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduto.css";

export default function Add() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [qnt, setQnt] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  function voltar() {
    navigate("/home");
  }

  async function addProduto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você precisa fazer login");
      navigate("/login");
      return;
    }

    if (!nome.trim() || preco === "" || qnt === "") {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3000/produtos/add-produto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nome.trim(),
            preco: Number(preco),
            qnt: Number(qnt),
          }),
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Erro ao cadastrar o produto");
        return;
      }

      setNome("");
      setPreco("");
      setQnt("");

      alert("Produto cadastrado com sucesso!");
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
      <form onSubmit={addProduto}>
        <h1>Cadastrar um produto</h1>

        <label htmlFor="nome">Nome do produto</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label htmlFor="preco">Preço do produto</label>
        <input
          id="preco"
          type="number"
          placeholder="Preço do produto"
          min="0.01"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <label htmlFor="qnt">Quantidade do produto</label>
        <input
          id="qnt"
          type="number"
          placeholder="Quantidade do produto"
          min="0"
          step="1"
          value={qnt}
          onChange={(e) => setQnt(e.target.value)}
        />

        {erro && <p>{erro}</p>}

        <button type="submit">Cadastrar produto</button>
      </form>
    </main>
  );
}

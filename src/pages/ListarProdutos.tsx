import { useState, useEffect } from "react";
import "./ListarProdutos.css";

export default function Add() {
  type Produto = {
    id: string;
    nome: string;
    preco: number;
    qnt: number;
  };

  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    async function carregarProdutos() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado no localStorage");
        setProdutos([]);
        return;
      }

      const resposta = await fetch("http://localhost:3000/produtos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error(dados.mensagem);
        setProdutos([]);
        return;
      }

      if (!Array.isArray(dados)) {
        console.error("A resposta não é uma lista:", dados);
        setProdutos([]);
        return;
      }

      setProdutos(dados);
    }

    carregarProdutos();
  }, []);

  return (
    <section className="produtos">
      <div className="produtos-text">
        <h2>Acompanhe seus produtos registrados aqui!</h2>
      </div>
      {produtos.map((produtos) => (
        <div key={produtos.id} className="item-produto">
          <h2>{produtos.nome}</h2>
          <p>R$ {produtos.preco}</p>
          <span>{produtos.qnt}</span>
        </div>
      ))}
    </section>
  );
}

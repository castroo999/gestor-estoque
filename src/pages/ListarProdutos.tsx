import { useState, useEffect } from "react";
import "./ListarProdutos.css";

export default function Add() {
  type Produto = {
    id: number;
    nome: string;
    preco: number;
    qnt: number;
  };

  const [produtos, setProdutos] = useState <Produto[]>([])

  useEffect(() => {
    async function carregarProdutos() {
      const resposta = await fetch("http://localhost:3000/produtos");
      const dados: Produto[] = await resposta.json()
      setProdutos(dados)
    }

    carregarProdutos()
  },[])

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

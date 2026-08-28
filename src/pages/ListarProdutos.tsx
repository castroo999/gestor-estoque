import { useEffect, useState } from "react";
import "./ListarProdutos.css";

type ListarProdutosProps = {
  busca: string;
};

export default function Listar({ busca }: ListarProdutosProps) {
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

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase().trim()),
  );

  return (
    <section className="produtos">
      <div className="produtos-text">
        <h2>Acompanhe seus produtos registrados aqui!</h2>
      </div>
      {produtosFiltrados.map((produto) => (
        <div key={produto.id} className="item-produto">
          <h2>{produto.nome}</h2>
          <p>R$ {produto.preco}</p>
          <span>{produto.qnt}</span>
        </div>
      ))}
    </section>
  );
}

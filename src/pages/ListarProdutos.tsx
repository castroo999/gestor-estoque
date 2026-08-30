import { useEffect, useState } from "react";
import "./ListarProdutos.css";
import { useNavigate } from "react-router-dom";
import { deletarProduto } from "../scripts/DeletarProduto";

type ListarProdutosProps = {
  busca: string;
};

export default function Listar({ busca }: ListarProdutosProps) {
  async function handleDeletarProduto(id: string) {
    const confirmou = window.confirm(
      "Tem certeza que deseja deletar este produto?",
    );

    if (!confirmou) {
      return;
    }

    try {
      await deletarProduto(id);

      setProdutos((produtosAtuais) =>
        produtosAtuais.filter((produto) => produto.id !== id),
      );

      alert("Produto deletado com sucesso!");
    } catch (erro) {
      if (erro instanceof Error && erro.message === "TOKEN_INVALIDO") {
        navigate("/login");
        return;
      }
    }
  }
  type Produto = {
    id: string;
    nome: string;
    preco: number;
    qnt: number;
  };

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const navigate = useNavigate();

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
          <p>R$ {produto.preco.toFixed(2)}</p>
          <span>Quantidade: {produto.qnt}</span>

          <button
            type="button"
            onClick={() => navigate(`/editar-produto/${produto.id}`)}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => handleDeletarProduto(produto.id)}
          >
            Deletar
          </button>
        </div>
      ))}
    </section>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletarProduto } from "../scripts/DeletarProduto";
import "./ListarProdutos.css";

type ListarProdutosProps = {
  busca: string;
};

type Produto = {
  id: string;
  nome: string;
  preco: number | string;
  qnt: number;
  tipo: "COMUM" | "EPI";
  estoqueMinimo: number;
  ca: string | null;
  validadeCA: string | null;
  lote: string | null;
  tamanho: string | null;
  fabricante: string | null;
};

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function formatarDinheiro(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string | null) {
  if (!data) {
    return "Não informada";
  }

  return new Date(data).toLocaleDateString("pt-BR");
}

export default function ListarProdutos({
  busca,
}: ListarProdutosProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarProdutos() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const resposta = await fetch(
          `${API_URL}/produtos`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const dados = await resposta.json();

        if (resposta.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
          return;
        }

        if (!resposta.ok) {
          setErro(
            dados.mensagem ??
              "Erro ao carregar os produtos",
          );
          return;
        }

        if (!Array.isArray(dados)) {
          setErro(
            "A resposta do servidor não é uma lista",
          );
          return;
        }

        setProdutos(dados);
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, [navigate]);

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
        produtosAtuais.filter(
          (produto) => produto.id !== id,
        ),
      );

      alert("Produto deletado com sucesso!");
    } catch (erro) {
      if (
        erro instanceof Error &&
        erro.message === "TOKEN_INVALIDO"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
        return;
      }

      if (erro instanceof Error) {
        alert(erro.message);
        return;
      }

      alert("Não foi possível deletar o produto");
    }
  }

  const buscaPadrao = busca.toLowerCase().trim();

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome
        .toLowerCase()
        .includes(buscaPadrao) ||
      produto.tipo
        .toLowerCase()
        .includes(buscaPadrao) ||
      produto.ca
        ?.toLowerCase()
        .includes(buscaPadrao) ||
      produto.fabricante
        ?.toLowerCase()
        .includes(buscaPadrao),
  );

  if (carregando) {
    return (
      <p className="mensagem-produtos">
        Carregando produtos...
      </p>
    );
  }

  if (erro) {
    return (
      <p className="mensagem-produtos mensagem-erro">
        {erro}
      </p>
    );
  }

  return (
    <section className="produtos">
      <div className="produtos-text">
        <h2>
          Acompanhe seus produtos registrados aqui!
        </h2>

        <p>
          Produtos comuns e EPIs cadastrados no estoque.
        </p>
      </div>

      {produtosFiltrados.length === 0 && (
        <p className="mensagem-produtos">
          Nenhum produto encontrado.
        </p>
      )}

      {produtosFiltrados.map((produto) => (
        <article
          key={produto.id}
          className="item-produto"
        >
          <span
            className={
              produto.tipo === "EPI"
                ? "tipo-produto tipo-epi"
                : "tipo-produto tipo-comum"
            }
          >
            {produto.tipo === "EPI"
              ? "EPI"
              : "Produto comum"}
          </span>

          <h2>{produto.nome}</h2>

          <p className="preco-produto">
            {formatarDinheiro(produto.preco)}
          </p>

          <span className="quantidade-produto">
            Quantidade: {produto.qnt}
          </span>

          {produto.tipo === "EPI" && (
            <div className="informacoes-epi">
              <p>
                <strong>CA:</strong>{" "}
                {produto.ca ?? "Não informado"}
              </p>

              <p>
                <strong>Validade:</strong>{" "}
                {formatarData(produto.validadeCA)}
              </p>

              <p>
                <strong>Estoque mínimo:</strong>{" "}
                {produto.estoqueMinimo}
              </p>

              {produto.fabricante && (
                <p>
                  <strong>Fabricante:</strong>{" "}
                  {produto.fabricante}
                </p>
              )}

              {produto.lote && (
                <p>
                  <strong>Lote:</strong>{" "}
                  {produto.lote}
                </p>
              )}

              {produto.tamanho && (
                <p>
                  <strong>Tamanho:</strong>{" "}
                  {produto.tamanho}
                </p>
              )}
            </div>
          )}

          <div className="acoes-produto">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/editar-produto/${produto.id}`,
                )
              }
            >
              Editar
            </button>

            <button
              type="button"
              className="botao-deletar"
              onClick={() =>
                handleDeletarProduto(produto.id)
              }
            >
              Deletar
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
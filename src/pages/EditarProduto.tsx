import { ChevronLeft } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarProduto() {
  const [nomeEditado, setNomeEditado] = useState("");
  const [precoEditado, setPrecoEditado] = useState("");
  const [qntEditado, setQntEditado] = useState("");
  const { id } = useParams<{ id: string }>();
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function voltar() {
    navigate("/home");
  }

  useEffect(() => {
  async function carregarProduto() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      setErro("ID do produto não encontrado");
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/produtos/buscar-produto/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Erro ao carregar o produto");
        return;
      }

      setNomeEditado(dados.produto.nome);
      setPrecoEditado(String(dados.produto.preco));
      setQntEditado(String(dados.produto.qnt));
    } catch {
      setErro("Não foi possível carregar o produto");
    }
  }

  carregarProduto();
}, [id, navigate]);

  async function editarProduto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Erro ao editar token invalido faça login novamente");
      navigate("/login");
    }

    if (!id) {
      setErro("Erro ao editar produto pelo id");
      return;
    }

    if (!nomeEditado.trim() || precoEditado === "" || qntEditado === "") {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/produtos/editar-produto/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nomeEditado.trim(),
            preco: Number(precoEditado),
            qnt: Number(qntEditado),
          }),
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Erro ao editar o produto");
        return;
      }

      alert("Produto editado com sucesso!");
      navigate("/home");
    } catch {
      setErro("erro");
    }
  }

  return (
    <main>
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>
      <form onSubmit={editarProduto}>
        <h1>Editar produto</h1>

        <label htmlFor="nome">Nome do produto</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome do produto"
          value={nomeEditado}
          onChange={(e) => setNomeEditado(e.target.value)}
        />

        <label htmlFor="preco">Preço do produto</label>
        <input
          id="preco"
          type="number"
          placeholder="Preço do produto"
          min="0.01"
          step="0.01"
          value={precoEditado}
          onChange={(e) => setPrecoEditado(e.target.value)}
        />

        <label htmlFor="qnt">Quantidade do produto</label>
        <input
          id="qnt"
          type="number"
          placeholder="Quantidade do produto"
          min="0"
          step="1"
          value={qntEditado}
          onChange={(e) => setQntEditado(e.target.value)}
        />

        {erro && <p>{erro}</p>}

        <button type="submit">Salvar Edição</button>
      </form>
    </main>
  );
}

import { ChevronLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduto.css";

type TipoProduto = "COMUM" | "EPI";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function AddProduto() {
  const [tipo, setTipo] = useState<TipoProduto>("COMUM");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [qnt, setQnt] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [ca, setCa] = useState("");
  const [validadeCA, setValidadeCA] = useState("");
  const [lote, setLote] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [fabricante, setFabricante] = useState("");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  function voltar() {
    navigate("/home");
  }

  function limparFormulario() {
    setTipo("COMUM");
    setNome("");
    setPreco("");
    setQnt("");
    setEstoqueMinimo("");
    setCa("");
    setValidadeCA("");
    setLote("");
    setTamanho("");
    setFabricante("");
  }

  async function cadastrarProduto(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setErro("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!nome.trim() || preco === "" || qnt === "") {
      setErro("Preencha nome, preço e quantidade");
      return;
    }

    const precoNumero = Number(preco);
    const quantidadeNumero = Number(qnt);
    const estoqueMinimoNumero = Number(estoqueMinimo);

    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      setErro("Informe um preço válido");
      return;
    }

    if (
      !Number.isInteger(quantidadeNumero) ||
      quantidadeNumero < 0
    ) {
      setErro("Informe uma quantidade inteira válida");
      return;
    }

    if (tipo === "EPI") {
      if (!ca.trim() || !validadeCA || estoqueMinimo === "") {
        setErro(
          "Informe o CA, a validade e o estoque mínimo do EPI",
        );
        return;
      }

      if (
        !Number.isInteger(estoqueMinimoNumero) ||
        estoqueMinimoNumero < 0
      ) {
        setErro("Informe um estoque mínimo válido");
        return;
      }

      const dataValidade = new Date(validadeCA);

      if (Number.isNaN(dataValidade.getTime())) {
        setErro("Informe uma validade válida");
        return;
      }
    }

    const url =
      tipo === "EPI"
        ? `${API_URL}/produtos/epis`
        : `${API_URL}/produtos/add-produto`;

    const body =
      tipo === "EPI"
        ? {
            nome: nome.trim(),
            preco: precoNumero,
            qnt: quantidadeNumero,
            estoqueMinimo: estoqueMinimoNumero,
            ca: ca.trim(),
            validadeCA,
            lote: lote.trim() || undefined,
            tamanho: tamanho.trim() || undefined,
            fabricante: fabricante.trim() || undefined,
          }
        : {
            nome: nome.trim(),
            preco: precoNumero,
            qnt: quantidadeNumero,
          };

    try {
      setEnviando(true);

      const resposta = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

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
            dados.error ??
            "Erro ao cadastrar o item",
        );
        return;
      }

      alert(
        tipo === "EPI"
          ? "EPI cadastrado com sucesso!"
          : "Produto cadastrado com sucesso!",
      );

      limparFormulario();
      navigate("/home");
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <button
        className="voltar"
        type="button"
        onClick={voltar}
      >
        <ChevronLeft size={18} />
        Voltar
      </button>

      <form onSubmit={cadastrarProduto}>
        <h1>Cadastrar item</h1>

        <label htmlFor="tipo">Tipo do item</label>

        <select
          id="tipo"
          value={tipo}
          onChange={(e) =>
            setTipo(e.target.value as TipoProduto)
          }
        >
          <option value="COMUM">Produto comum</option>
          <option value="EPI">EPI</option>
        </select>

        <label htmlFor="nome">Nome</label>

        <input
          id="nome"
          type="text"
          placeholder="Digite o nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label htmlFor="preco">Preço</label>

        <input
          id="preco"
          type="number"
          placeholder="Digite o preço"
          min="0.01"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />

        <label htmlFor="qnt">Quantidade</label>

        <input
          id="qnt"
          type="number"
          placeholder="Digite a quantidade"
          min="0"
          step="1"
          value={qnt}
          onChange={(e) => setQnt(e.target.value)}
          required
        />

        {tipo === "EPI" && (
          <>
            <label htmlFor="estoqueMinimo">
              Estoque mínimo
            </label>

            <input
              id="estoqueMinimo"
              type="number"
              placeholder="Digite o estoque mínimo"
              min="0"
              step="1"
              value={estoqueMinimo}
              onChange={(e) =>
                setEstoqueMinimo(e.target.value)
              }
              required
            />

            <label htmlFor="ca">Número do CA</label>

            <input
              id="ca"
              type="text"
              placeholder="Digite o CA do EPI"
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              required
            />

            <label htmlFor="validadeCA">
              Validade do CA
            </label>

            <input
              id="validadeCA"
              type="date"
              value={validadeCA}
              onChange={(e) =>
                setValidadeCA(e.target.value)
              }
              required
            />

            <label htmlFor="fabricante">
              Fabricante
            </label>

            <input
              id="fabricante"
              type="text"
              placeholder="Fabricante do EPI"
              value={fabricante}
              onChange={(e) =>
                setFabricante(e.target.value)
              }
            />

            <label htmlFor="lote">Lote</label>

            <input
              id="lote"
              type="text"
              placeholder="Lote do EPI"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
            />

            <label htmlFor="tamanho">Tamanho</label>

            <input
              id="tamanho"
              type="text"
              placeholder="Tamanho do EPI"
              value={tamanho}
              onChange={(e) =>
                setTamanho(e.target.value)
              }
            />
          </>
        )}

        {erro && <p className="mensagem-erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando
            ? "Cadastrando..."
            : tipo === "EPI"
              ? "Cadastrar EPI"
              : "Cadastrar produto"}
        </button>
      </form>
    </main>
  );
}
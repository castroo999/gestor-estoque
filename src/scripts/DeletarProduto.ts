const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function deletarProduto(id: string) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("TOKEN_INVALIDO");
  }

  const resposta = await fetch(
    `${API_URL}/produtos/deletar-produto/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const dados = await resposta.json();

  if (resposta.status === 401) {
    throw new Error("TOKEN_INVALIDO");
  }

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ?? "Não foi possível deletar o produto",
    );
  }

  return dados;
}
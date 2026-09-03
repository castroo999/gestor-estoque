export async function deletarFuncionario(id: string) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("TOKEN_INVALIDO");
  }

  const resposta = await fetch(
    `http://localhost:3000/funcionarios/deletar-funcionario/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem ?? "Erro ao deletar o funcionário");
  }

  return dados;
}

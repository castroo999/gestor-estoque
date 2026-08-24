import "./ListarProdutos.css";

export default function Add() {
  type produto = {
    id: number;
    nome: string;
    preco: number;
    qnt: number;
  };

  const Produtos: produto[] = [
    {
      id: 1,
      nome: "teclado",
      preco: 300,
      qnt: 5,
    },
    {
      id: 2,
      nome: "mouse",
      preco: 50,
      qnt: 15,
    },
    {
      id: 3,
      nome: "monitor",
      preco: 700,
      qnt: 4,
    },
    {
      id: 4,
      nome: "fone de ouvido",
      preco: 150,
      qnt: 10,
    },
  ];

  return (
    <section className="produtos">
      <div className="produtos-text">
        <h2>Acompanhe seus produtos registrados aqui!</h2>
      </div>
      {Produtos.map((produto) => (
        <div key={produto.id} className="item-produto">
          <h2>{produto.nome}</h2>
          <p>R$ {produto.preco}</p>
          <span>{produto.qnt}</span>
        </div>
      ))}
    </section>
  );
}

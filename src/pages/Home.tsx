import { useState } from "react";
import Header from "../components/Header";
import ListarProdutos from "./ListarProdutos";

export default function Home() {
  const [busca, setBusca] = useState("");

  return (
    <>
      <Header onSearch={setBusca} />
      <ListarProdutos busca={busca} />
    </>
  );
}

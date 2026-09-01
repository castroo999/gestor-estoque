import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

type HeaderProps = {
  onSearch: (texto: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  const navigate = useNavigate();

  function Sair() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    alert("Voce saiu da sua conta com sucesso");
    navigate("/");
  }
  return (
    <section className="header">
      <div className="header-text">
        <h2>Bem vindo(a) ao gerenciador de estoque</h2>
        <p>gerencie tudo o que entra e sai de sua empresa aqui!</p>
      </div>
      <nav>
        <Search />
        <input
          className="buscar"
          type="text"
          placeholder="Buscar..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <Link to="/add-produtos">Registrar produto</Link>
        <Link to="/add-funcionario">Registrar funcionario</Link>
        <Link to="/funcionarios">Ver funcionarios</Link>
        <Link to="/Dashboard">Dashboard</Link>
        <button className="sair" onClick={Sair}>
          Sair
        </button>
      </nav>
    </section>
  );
}

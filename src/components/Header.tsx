import { Link, useNavigate } from 'react-router-dom';
import './Header.css'

export default function Header(){

    const navigate = useNavigate()

    function Sair() {
        localStorage.removeItem("usuario")
        localStorage.removeItem("token")
        
        alert("Voce saiu da sua conta com sucesso")
        navigate("/")
    }
    return(
        <section className='header'>
            <div className="header-text">
                <h2>Bem vindo(a) ao gerenciador de estoque</h2>
                <p>gerencie tudo o que entra e sai de sua empresa aqui!</p>
            </div>
            <nav>
                <Link to ='/Add-produtos'>Registrar produto</Link>
                <Link to ='/Ver-produtos'>Ver produtos</Link>
                <Link to ='/Dashboard'>Dashboard</Link>
                <button className='sair' onClick={Sair}>Sair</button>
            </nav>
        </section>
    )
}
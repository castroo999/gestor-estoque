import { Link } from 'react-router-dom';
import './Header.css'

export default function Header(){
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
            </nav>
        </section>
    )
}
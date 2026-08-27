import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Cadastrar(){

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");

     const navigate = useNavigate();

    async function fazerCadastro(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        setErro("")

        if(senha !== confirmarSenha){
            setErro('As senhas não batem')
            return;
        }

        try{
            const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                })
            })

            const dados = await resposta.json()

            if(!resposta.ok){
                setErro(dados.mensagem ?? "erro ao fazer o cadastro")
                return;
            }

            navigate("/")
        }catch{
            setErro("Erro ao cadastrar")
        }
    }

 return(
        <main>
        <form onSubmit={fazerCadastro}>
            <h1>Cadastrar</h1>


            <input
             type="text"
             placeholder='Seu nome'
             onChange={(e) => setNome(e.target.value)}
            />

            <input
             type="email"
             placeholder='Seu email'
             onChange={(e) => setEmail(e.target.value)}
            />

            <input 
             type="password" 
             placeholder='Sua senha'
             onChange={(e) => setSenha(e.target.value)}
            />

            <input 
             type="password"
             placeholder='Confirme sua senha'
             onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            {erro && <p>{erro}</p>}

            <button type='submit'>Cadastrar</button>
            <p>Já tem uma conta? <Link to={'/login'}>LOGIN</Link></p>
        </form>
    </main>
 )
}
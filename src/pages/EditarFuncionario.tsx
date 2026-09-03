// import { ChevronLeft } from "lucide-react";
// import { useState, type FormEvent, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditarFuncionario(){
//     const [nomeEditado, setNomeEditado] = useState("");
//     const [cpfEditado, setCpfEditado] = useState("");
//     const [matriculaEditado, setMatriculaEditado] = useState("");
//     const [setorEditado, setSetorEditado] = useState("");
//     const [cargoEditado, setCargoEditado] = useState("");
//     const { id } = useParams<{ id: string }>();
//     const [erro, setErro] = useState("");
//     const navigate = useNavigate();


//     function Voltar(){
//         navigate("/home")
//     }

//     useEffect(()=> {
//         async function carregarFuncionario() {
//             const token = localStorage.getItem("token")

//             if(!token){
//                 navigate("login")
//                 return
//             }
            
//             if (!id) {
//             setErro("ID do funcionario não encontrado");
//             return;
//             }

//             try {
//                 const resposta = await fetch(
//                     `htpp://localhost3000/funcionarios/${id}`,
//                     {
//                         headers:{
//                             Authorization: `Bearer ${token}`,
//                         }
//                     }
//                 );

//                 const dados = await resposta.json()

//                 if (!resposta.ok) {
//                 setErro(dados.mensagem ?? "Erro ao carregar o funcionario");
//                 return;
//             }

//                 setNomeEditado(dados.funcionario.nome);
//                 setCpfEditado(dados.funcionario.cpf);
//                 setMatriculaEditado(dados.funcionario.matricula);
//                 setCargoEditado(dados.funcionario.cargo);
//                 setSetorEditado(dados.funcionario.setor);
                
//             } catch {
//                 setErro("Erro ao carregar funcionarios")
//             }
//         }

//         carregarFuncionario();
//     }, [id, navigate]);

//     async function editarFuncionario(e: FormEvent<HTMLFormElement>) {
//         e.preventDefault()
//         setErro("")

//         const token = localStorage.getItem("token");

//         if(!token){
//             setErro("Erro token invalido")
//             return;
//         }

//         if(!id){
//             setErro("Erro id invalido")
//             return;
//         }

//         if(!nomeEditado.trim() || !cpfEditado || !matriculaEditado || !cargoEditado || !setCargoEditado){
//             setErro("Preencha todos os campos")
//             return;
//         }

//         const resposta = await fetch(
//             `http//localhost3000/funcionarios/buscar-funcionario${id}`,
//             {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     nome: nomeEditado.trim(),
//                     cpfEditado: String(cpfEditado),
//                     matriculaEditado: String(matriculaEditado),
//                     setorEditado: String(setorEditado),
//                 })

//             }
//         )
        
        
//     }


//     return(

//     )
// }
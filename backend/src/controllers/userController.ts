import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import type { User } from "../models/modeloUser.js";

const usuarios: User[] = [
    {
        id: randomUUID(),
        nome: 'gustavo',
        email: 'gustavo@email.com',
        senha: 'senhaSecreta'
    }
]

type LoginBody = {
  email: string;
  senha: string;
};

type CadastroBody = {
  nome:string
  email: string,
  senha: string,
}


export function loginUser(req: Request<{}, {}, LoginBody>, res: Response) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({
      mensagem: "Informe o e-mail e a senha",
    });
    return;
  }

  const emailPadrao = email.trim().toLowerCase();

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.email === emailPadrao,
  );

  if (!usuarioEncontrado) {
    res.status(401).json({
      mensagem: "E-mail ou senha incorretos",
    });
    return;
  }

  if (usuarioEncontrado.senha !== senha) {
    res.status(401).json({
      mensagem: "E-mail ou senha incorretos",
    });
    return;
  }

  res.status(200).json({
    mensagem: "Login realizado com sucesso",
    usuario: {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
    },
  });
}

export function cadastroUser(req: Request<{},{}, CadastroBody>, res: Response){
  const { nome, email, senha } = req.body

  if(!nome || !email || !senha){
    res.status(400).json({
      mensagem: ("Erro ao cadastrar preencha todos os campos!")
    })
    return
  }

  if(!email.includes('@')) {
    res.status(400).json({
      mensagem: "informe um email valido",
    })
    return
  }

  if (senha.length < 6){
    res.status(400).json({
      mensagem: "a senha deve conter no minimo 6 caracteres",
    })
    return
  }

  const emailPadrao = email.trim().toLowerCase();

  const emailJaExiste = usuarios.some(
    (usuario) => usuario.email === emailPadrao
  );

  if(emailJaExiste){
    res.status(409).json({
      error: ("Erro ao cadastrar o email digitado já existe!")
    })
    return
  }

  const usuarioCadastrado: User = {
    id: randomUUID(),
    nome: nome.trim(),
    email: emailPadrao,
    senha,
  }

  usuarios.push(usuarioCadastrado);

  res.status(201).json({
    menagem: "Usuario cadastrado com sucesso!",
    usuario: {
      id:usuarioCadastrado.id,
      nome: usuarioCadastrado.nome,
      email: usuarioCadastrado.email,
    }
  })
}

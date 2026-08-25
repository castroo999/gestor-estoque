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

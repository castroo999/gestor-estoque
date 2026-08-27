import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type LoginBody = {
  email: string;
  senha: string;
};

type CadastroBody = {
  nome: string;
  email: string;
  senha: string;
};

export async function loginUser(
  req: Request<{}, {}, LoginBody>,
  res: Response,
) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({
      mensagem: "Informe o e-mail e a senha",
    });
    return;
  }

  const emailPadrao = email.trim().toLowerCase();

  const usuarioEncontrado = await prisma.user.findUnique({
    where: {
      email: emailPadrao,
    },
  });

  if (!usuarioEncontrado) {
    res.status(401).json({
      mensagem: "E-mail ou senha incorretos",
    });
    return;
  }

  const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

  if (!senhaCorreta) {
    res.status(401).json({
      mensagem: "Senha incorreta",
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET não foi definida");
  }

  const token = jwt.sign(
    {
      userId: usuarioEncontrado.id,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    },
  );

  res.status(200).json({
    mensagem: "Login realizado com sucesso",
    token,
    usuario: {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
    },
  });
}

export async function cadastroUser(
  req: Request<{}, {}, CadastroBody>,
  res: Response,
) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({
      mensagem: "Erro ao cadastrar preencha todos os campos!",
    });
    return;
  }

  if (!email.includes("@")) {
    res.status(400).json({
      mensagem: "informe um email valido",
    });
    return;
  }

  if (senha.length < 6) {
    res.status(400).json({
      mensagem: "a senha deve conter no minimo 6 caracteres",
    });
    return;
  }

  const emailPadrao = email.trim().toLowerCase();

  const emailJaExiste = await prisma.user.findUnique({
    where: {
      email: emailPadrao,
    },
  });

  if (emailJaExiste) {
    res.status(409).json({
      error: "Erro ao cadastrar o email digitado já existe!",
    });
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuarioCadastrado = await prisma.user.create({
    data: {
      nome: nome.trim(),
      email: emailPadrao,
      senha: senhaHash,
    },
  });

  res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso!",
    usuario: {
      id: usuarioCadastrado.id,
      nome: usuarioCadastrado.nome,
      email: usuarioCadastrado.email,
    },
  });
}

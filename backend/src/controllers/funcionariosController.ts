import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type FuncionarioBody = {
  nome: string;
  cpf: string;
  matricula: string;
  cargo: string;
  setor: string;
};

export async function cadastrarFuncionario(
  req: Request<{}, {}, FuncionarioBody>,
  res: Response,
) {
  const { nome, cpf, matricula, cargo, setor } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      error: "Usuário não autenticado",
    });
    return;
  }

  if (!nome?.trim() || !matricula?.trim() || !cargo?.trim() || !setor?.trim()) {
    res.status(400).json({
      error: "Preencha todos os campos obrigatórios",
    });
    return;
  }

  const matriculaJaExiste = await prisma.funcionario.findFirst({
    where: {
      userId,
      matricula: matricula.trim(),
    },
  });

  if (matriculaJaExiste) {
    res.status(409).json({
      error: "A matrícula já está em uso",
    });
    return;
  }

  const funcionario = await prisma.funcionario.create({
    data: {
      nome: nome.trim(),
      cpf: cpf?.trim() || null,
      matricula: matricula.trim(),
      cargo: cargo.trim(),
      setor: setor.trim(),
      userId,
    },
  });

  res.status(201).json({
    mensagem: "Funcionário cadastrado com sucesso",
    funcionario,
  });
}

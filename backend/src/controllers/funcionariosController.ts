import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type FuncionarioBody = {
  nome: string;
  cpf?: string;
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
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  if (!nome?.trim() || !matricula?.trim() || !cargo?.trim() || !setor?.trim()) {
    res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios",
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
      mensagem: "A matrícula já está em uso",
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

export async function listarFuncionarios(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  const funcionarios = await prisma.funcionario.findMany({
    where: {
      userId,
    },
    orderBy: {
      criadoEm: "desc",
    },
  });

  res.status(200).json(funcionarios);
}

export async function buscarFuncionario(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  const funcionarioEncontrado = await prisma.funcionario.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!funcionarioEncontrado) {
    res.status(404).json({
      mensagem: "Funcionário não encontrado",
    });
    return;
  }

  res.status(200).json(funcionarioEncontrado);
}

export async function editarFuncionario(
  req: Request<{ id: string }, {}, FuncionarioBody>,
  res: Response,
) {
  const { id } = req.params;
  const userId = req.userId;
  const { nome, cpf, matricula, cargo, setor } = req.body;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  if (!nome?.trim() || !matricula?.trim() || !cargo?.trim() || !setor?.trim()) {
    res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios",
    });
    return;
  }

  const funcionarioParaEditar = await prisma.funcionario.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!funcionarioParaEditar) {
    res.status(404).json({
      mensagem: "Funcionário não encontrado",
    });
    return;
  }

  const funcionarioEditado = await prisma.funcionario.update({
    where: {
      id,
    },
    data: {
      nome: nome.trim(),
      cpf: cpf?.trim() || null,
      matricula: matricula.trim(),
      cargo: cargo.trim(),
      setor: setor.trim(),
    },
  });

  res.status(200).json({
    mensagem: "Funcionário editado com sucesso",
    funcionario: funcionarioEditado,
  });
}

export async function deletarFuncionario(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  const funcionarioParaDeletar = await prisma.funcionario.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!funcionarioParaDeletar) {
    res.status(404).json({
      mensagem: "Funcionário não encontrado",
    });
    return;
  }

  const funcionarioDeletado = await prisma.funcionario.delete({
    where: {
      id,
    },
  });

  res.status(200).json({
    mensagem: "Funcionário deletado com sucesso",
    funcionario: funcionarioDeletado,
  });
}

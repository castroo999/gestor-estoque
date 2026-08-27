import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type ProdutoBody = {
  nome: string;
  preco: number;
  qnt: number;
};

const produtoSelect = {
  id: true,
  nome: true,
  preco: true,
  qnt: true,
} as const;

function formatarProduto(produto: {
  id: string;
  nome: string;
  preco: unknown;
  qnt: number;
}) {
  return {
    ...produto,
    preco: Number(produto.preco),
  };
}

export async function listarProdutos(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  const produtos = await prisma.produto.findMany({
    where: {
      userId,
    },

    select: produtoSelect,
    orderBy: {
      criadoEm: "desc",
    },
  });

  res.status(200).json(produtos.map(formatarProduto));
}

export async function cadastrarProduto(
  req: Request<{}, {}, ProdutoBody>,
  res: Response,
) {
  const { nome, preco, qnt } = req.body;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof preco !== "number" ||
    preco <= 0 ||
    typeof qnt !== "number" ||
    !Number.isInteger(qnt) ||
    qnt < 0
  ) {
    res.status(400).json({
      mensagem: "Informe nome, preço e quantidade válidos",
    });
    return;
  }

  const novoProduto = await prisma.produto.create({
    data: {
      nome: nome.trim(),
      preco,
      qnt,
      userId,
    },
    select: produtoSelect,
  });

  res.status(201).json({
    mensagem: "Produto cadastrado com sucesso",
    produto: formatarProduto(novoProduto),
  });
}

export async function buscarProduto(
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

  const produtoProcurado = await prisma.produto.findFirst({
    where: {
      id,
      userId,
    },
    select: produtoSelect,
  });

  if (!produtoProcurado) {
    res.status(404).json({
      mensagem: "Produto não encontrado",
    });
    return;
  }

  res.status(200).json({
    mensagem: "Busca feita com sucesso",
    produto: formatarProduto(produtoProcurado),
  });
}

export async function editarProduto(
  req: Request<{ id: string }, {}, ProdutoBody>,
  res: Response,
) {
  const { id } = req.params;
  const { nome, preco, qnt } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof preco !== "number" ||
    preco <= 0 ||
    typeof qnt !== "number" ||
    !Number.isInteger(qnt) ||
    qnt < 0
  ) {
    res.status(400).json({
      mensagem: "Informe nome, preço e quantidade válidos",
    });
    return;
  }

  const produtoEncontrado = await prisma.produto.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!produtoEncontrado) {
    res.status(404).json({
      mensagem: "Produto não encontrado",
    });
    return;
  }

  const produtoEditado = await prisma.produto.update({
    where: {
      id,
    },
    data: {
      nome: nome.trim(),
      preco,
      qnt,
    },
    select: produtoSelect,
  });

  res.status(200).json({
    mensagem: "Produto editado com sucesso",
    produto: formatarProduto(produtoEditado),
  });
}

export async function deletarProduto(
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

  const produtoEncontrado = await prisma.produto.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!produtoEncontrado) {
    res.status(404).json({
      mensagem: "Produto não encontrado",
    });
    return;
  }

  const produtoRemovido = await prisma.produto.delete({
    where: {
      id,
    },
    select: produtoSelect,
  });

  res.status(200).json({
    mensagem: "Produto deletado com sucesso",
    produto: formatarProduto(produtoRemovido),
  });
}

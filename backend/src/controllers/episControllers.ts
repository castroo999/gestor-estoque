import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type EpiBody = {
  nome: string;
  preco: number;
  qnt: number;
  estoqueMinimo: number;
  ca: string;
  validadeCA: string;
  lote?: string;
  tamanho?: string;
  fabricante?: string;
};

export async function listarEpis(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  try {
    const epis = await prisma.produto.findMany({
      where: {
        userId,
        tipo: "EPI",
        qnt: {
          gt: 0,
        },
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        qnt: true,
        estoqueMinimo: true,
        ca: true,
        validadeCA: true,
        lote: true,
        tamanho: true,
        fabricante: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    res.status(200).json(epis);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro interno ao listar os EPIs",
    });
  }
}

export async function cadastrarEpi(
  req: Request<{}, {}, EpiBody>,
  res: Response,
) {
  const {
    nome,
    preco,
    qnt,
    estoqueMinimo,
    ca,
    validadeCA,
    lote,
    tamanho,
    fabricante,
  } = req.body;

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
    !Number.isFinite(preco) ||
    preco <= 0 ||
    typeof qnt !== "number" ||
    !Number.isInteger(qnt) ||
    qnt < 0 ||
    typeof estoqueMinimo !== "number" ||
    !Number.isInteger(estoqueMinimo) ||
    estoqueMinimo < 0 ||
    typeof ca !== "string" ||
    ca.trim() === "" ||
    typeof validadeCA !== "string" ||
    validadeCA.trim() === ""
  ) {
    res.status(400).json({
      mensagem: "Informe dados válidos para o EPI",
    });
    return;
  }

  const dataValidade = new Date(validadeCA);

  if (Number.isNaN(dataValidade.getTime())) {
    res.status(400).json({
      mensagem: "Informe uma data de validade válida",
    });
    return;
  }

  try {
    const epi = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        preco,
        qnt,
        tipo: "EPI",
        estoqueMinimo,
        ca: ca.trim(),
        validadeCA: dataValidade,
        lote: lote?.trim() || null,
        tamanho: tamanho?.trim() || null,
        fabricante: fabricante?.trim() || null,
        userId,
      },
    });

    res.status(201).json({
      mensagem: "EPI registrado com sucesso!",
      epi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro interno ao cadastrar o EPI",
    });
  }
}

export async function deletarEpi(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário nãoServices não autenticado",
    });
    return;
  }

  try {
    const produto = await prisma.produto.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!produto) {
      res.status(404).json({
        mensagem: "Produto não encontrado",
      });
      return;
    }

    const possuiEntregas =
      await prisma.entregaProduto.findFirst({
        where: {
          produtoId: id,
        },
        select: {
          id: true,
        },
      });

    if (possuiEntregas) {
      res.status(409).json({
        mensagem:
          "Este produto possui entregas registradas e não pode ser excluído",
      });
      return;
    }

    const produtoRemovido = await prisma.produto.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      mensagem: "Produto deletado com sucesso",
      produto: produtoRemovido,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro interno ao deletar o produto",
    });
  }
}

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type EntregaBody = {
  funcionarioId: string;
  produtoId: string;
  quantidade: number;
  observacao?: string;
};

export async function registrarEntrega(
  req: Request<{}, {}, EntregaBody>,
  res: Response,
) {
  const { funcionarioId, produtoId, quantidade, observacao } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  if (
    !funcionarioId ||
    !produtoId ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    res.status(400).json({
      mensagem: "Informe funcionário, produto e quantidade válidos",
    });
    return;
  }

  const funcionario = await prisma.funcionario.findFirst({
    where: {
      id: funcionarioId,
      userId,
    },
  });

  if (!funcionario) {
    res.status(404).json({
      mensagem: "Funcionário não encontrado",
    });
    return;
  }

  if (!funcionario.ativo) {
    res.status(400).json({
      mensagem: "Não é possível entregar produtos para um funcionário inativo",
    });
    return;
  }

  const produto = await prisma.produto.findFirst({
    where: {
      id: produtoId,
      userId,
    },
  });

  if (!produto) {
    res.status(404).json({
      mensagem: "Produto não encontrado",
    });
    return;
  }

  if (produto.tipo !== "EPI") {
    res.status(400).json({
      mensagem: "Somente EPIs podem ser entregues aos funcionários",
    });
    return;
  }

  if (produto.qnt < quantidade) {
    res.status(400).json({
      mensagem: "Quantidade insuficiente no estoque",
    });
    return;
  }

  const entrega = await prisma.$transaction(async (prisma) => {
    const estoqueAtualizado = await prisma.produto.updateMany({
      where: {
        id: produtoId,
        userId,
        qnt: {
          gte: quantidade,
        },
      },
      data: {
        qnt: {
          decrement: quantidade,
        },
      },
    });

    if (estoqueAtualizado.count === 0) {
      throw new Error("ESTOQUE_INSUFICIENTE");
    }

    return prisma.entregaProduto.create({
      data: {
        funcionarioId,
        produtoId,
        quantidade,
        responsavelId: userId,
        observacao: observacao?.trim() || null,
      },
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true,
            matricula: true,
          },
        },
        produto: {
          select: {
            id: true,
            nome: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  });

  res.status(201).json({
    mensagem: "Entrega registrada com sucesso",
    entrega,
  });

  res.status(500).json({
    mensagem: "Erro interno ao registrar a entrega",
  });
}

// listar entregas
export async function listarEntregas(
  req: Request<{ funcionarioId: string }>,
  res: Response,
) {
  const { funcionarioId } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  try {
    const funcionario = await prisma.funcionario.findFirst({
      where: {
        id: funcionarioId,
        userId,
      },
      select: {
        id: true,
        nome: true,
        matricula: true,
        cargo: true,
        setor: true,
        ativo: true,
      },
    });

    if (!funcionario) {
      res.status(404).json({
        mensagem: "Funcionário não encontrado",
      });
      return;
    }

    const entregas = await prisma.entregaProduto.findMany({
      where: {
        funcionarioId,
        responsavelId: userId,
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            ca: true,
            validadeCA: true,
            lote: true,
            tamanho: true,
            fabricante: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        entregueEm: "desc",
      },
    });

    res.status(200).json({
      funcionario,
      entregas,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro interno ao carregar o inventário",
    });
  }
}

// editar entrega
export async function editarEntrega(
  req: Request<{ id: string }, {}, EntregaBody>,
  res: Response,
) {
  const { id } = req.params;
  const { funcionarioId, produtoId, quantidade, observacao } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
    return;
  }

  if (
    !funcionarioId ||
    !produtoId ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    res.status(400).json({
      mensagem: "Informe funcionário, produto e quantidade válidos",
    });
    return;
  }

  try {
    const entregaAnterior = await prisma.entregaProduto.findFirst({
      where: {
        id,
        responsavelId: userId,
      },
    });

    if (!entregaAnterior) {
      res.status(404).json({
        mensagem: "Entrega não encontrada",
      });
      return;
    }

    if (entregaAnterior.devolvidoEm) {
      res.status(400).json({
        mensagem: "Não é possível editar uma entrega já devolvida",
      });
      return;
    }

    const funcionario = await prisma.funcionario.findFirst({
      where: {
        id: funcionarioId,
        userId,
      },
    });

    if (!funcionario) {
      res.status(404).json({
        mensagem: "Funcionário não encontrado",
      });
      return;
    }

    if (!funcionario.ativo) {
      res.status(400).json({
        mensagem: "O funcionário está inativo",
      });
      return;
    }

    const produto = await prisma.produto.findFirst({
      where: {
        id: produtoId,
        userId,
      },
    });

    if (!produto) {
      res.status(404).json({
        mensagem: "Produto não encontrado",
      });
      return;
    }

    const entregaAtualizada = await prisma.$transaction(async (prisma) => {
      // Devolve ao estoque a quantidade registrada anteriormente
      await prisma.produto.update({
        where: {
          id: entregaAnterior.produtoId,
        },
        data: {
          qnt: {
            increment: entregaAnterior.quantidade,
          },
        },
      });

      // Retira do estoque a nova quantidade
      const estoqueAtualizado = await prisma.produto.updateMany({
        where: {
          id: produtoId,
          userId,
          qnt: {
            gte: quantidade,
          },
        },
        data: {
          qnt: {
            decrement: quantidade,
          },
        },
      });

      if (estoqueAtualizado.count === 0) {
        throw new Error("ESTOQUE_INSUFICIENTE");
      }

      return prisma.entregaProduto.update({
        where: {
          id,
        },
        data: {
          funcionarioId,
          produtoId,
          quantidade,
          observacao: observacao?.trim() || null,
        },
      });
    });

    res.status(200).json({
      mensagem: "Entrega atualizada com sucesso",
      entrega: entregaAtualizada,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ESTOQUE_INSUFICIENTE") {
      res.status(400).json({
        mensagem: "Quantidade insuficiente no estoque",
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      mensagem: "Erro interno ao atualizar a entrega",
    });
  }
}

// deletar entrega
export async function deletarEntrega(
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

  try {
    const entrega = await prisma.entregaProduto.findFirst({
      where: {
        id,
        responsavelId: userId,
      },
    });

    if (!entrega) {
      res.status(404).json({
        mensagem: "Entrega não encontrada",
      });
      return;
    }

    const entregaDeletada = await prisma.$transaction(async (prisma) => {
      if (!entrega.devolvidoEm) {
        await prisma.produto.update({
          where: {
            id: entrega.produtoId,
          },
          data: {
            qnt: {
              increment: entrega.quantidade,
            },
          },
        });
      }

      return prisma.entregaProduto.delete({
        where: {
          id,
        },
      });
    });

    res.status(200).json({
      mensagem: "Entrega deletada e estoque atualizado com sucesso",
      entrega: entregaDeletada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro interno ao deletar a entrega",
    });
  }
}

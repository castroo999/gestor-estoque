import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { Produto } from "../models/modeloProduto.js";

const produtos: Produto[] = [
  {
    id: randomUUID(),
    nome: "Teclado",
    preco: 300,
    qnt: 5,
  },
  {
    id: randomUUID(),
    nome: "Mouse",
    preco: 150,
    qnt: 8,
  },
  {
    id: randomUUID(),
    nome: "monitor",
    preco: 700,
    qnt: 4,
  },
  {
    id: randomUUID(),
    nome: "fone de ouvido",
    preco: 150,
    qnt: 10,
  },
];

export function listarProdutos(req: Request, res: Response) {
  res.status(200).json(produtos);
}

export function cadastrarProduto(req: Request, res: Response) {
  const { nome, preco, qnt } = req.body;
  const id = randomUUID();

  if (!nome || !preco || qnt === undefined || qnt === null || qnt < 0) {
    res.status(400).send("Erro ao cadastrar um produto");
    return;
  }

  const novoProduto: Produto = {
    id,
    nome: req.body.nome,
    preco: req.body.preco,
    qnt: req.body.qnt,
  };

  produtos.push(novoProduto);

  res.status(201).json({
    mensage: "Produto cadastrado com sucesso",
    produto: novoProduto,
  });
}

export function editarProduto(req: Request<{ id: string }>, res: Response) {
  const { nome, preco, qnt } = req.body;
  const { id } = req.params;

  const indiceProduto = produtos.findIndex((produto) => produto.id === id);

  if (indiceProduto === -1) {
    res.status(404).send("Erro ao achar id do produto");
    return;
  }

  const produtoEncontrado = produtos[indiceProduto];

  if (!produtoEncontrado) {
    res.status(404).json({
      erro: "erro ao encontrar produto",
    });
    return;
  }

  const produtoEditado: Produto = {
    id: produtoEncontrado.id,
    nome: nome,
    preco: preco,
    qnt: qnt,
  };

  produtos[indiceProduto] = produtoEditado;

  res.status(200).json({
    mensagem: "produto editado com sucesso",
    produtoEditado,
  });
}

export function deletarProduto(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const indiceProduto = produtos.findIndex((produtos) => produtos.id === id);

  if (indiceProduto === -1) {
    res.status(404).send("erro ao procurar o id do produto");
    return;
  }

  const produtoRemovido = produtos.splice(indiceProduto, 1);

  res.status(200).json({
    mensagem: "Produto deletado com sucesso",
    produto: produtoRemovido[0],
  });
}

export function buscarProduto(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const produtoProcurado = produtos.find((produto) => produto.id === id);

  if (!produtoProcurado) {
    res.status(404).json({
      mensagem: "Erro ao procurar o produto",
    });
    return;
  }

  res.status(200).json({
    mensagem: "Busca feita com sucesso",
    produto: produtoProcurado,
  });
}
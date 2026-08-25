import type { Request, Response } from "express";
// import {Produto} from '../models/modeloProduto.js'
// import { randomUUID } from "node:crypto";

export function listarProdutos(req: Request, res: Response) {
  res.json([
    {
      id: 1,
      nome: "Teclado",
      preco: 300,
      qnt: 5,
    },
    {
      id: 2,
      nome: "Mouse",
      preco: 150,
      qnt: 8,
    },
    {
      id: 3,
      nome: "monitor",
      preco: 700,
      qnt: 4,
    },
    {
      id: 4,
      nome: "fone de ouvido",
      preco: 150,
      qnt: 10,
    },
  ]);
}

// export default function cadastrarProduto(req: Request, res: Response) {
//   const { nome, preco, qnt } = req.body;
//   const { id } = randomUUID()

//   if (!nome || !preco || qnt === undefined || qnt === null || qnt < 0) {
//     res.status(400).send("Erro ao cadastrar um produto");
//     return;
//   }

//   const novoProduto: Produto = {
//     nome: req.body.nome,
//     preco: req.body.preco,
//     qnt: req.body.qnt
//   }
// }

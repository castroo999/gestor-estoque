import { Router } from "express";

import {
  listarProdutos,
  cadastrarProduto,
  editarProduto,
  deletarProduto,
  buscarProduto,
} from "../controllers/produtosController.js";

import {
  listarEpis,
  cadastrarEpi,
  deletarEpi,
} from "../controllers/episControllers.js";

import { verificarToken } from "../middlewares/verificarToken.js";

const router = Router();

router.use(verificarToken);

// Rotas de EPI
router.get("/epis", listarEpis);
router.post("/epis", cadastrarEpi);
router.delete("/epis/:id", deletarEpi);

// Rotas de produtos
router.get("/", listarProdutos);
router.post("/add-produto", cadastrarProduto);
router.get("/buscar-produto/:id", buscarProduto);
router.put("/editar-produto/:id", editarProduto);
router.delete("/deletar-produto/:id", deletarProduto);

export default router;

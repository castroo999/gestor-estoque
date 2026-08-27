import { Router } from 'express'
import { listarProdutos } from '../controllers/produtosController.js'
import { cadastrarProduto } from '../controllers/produtosController.js'
import { editarProduto } from '../controllers/produtosController.js'
import { deletarProduto } from '../controllers/produtosController.js'
import { buscarProduto } from '../controllers/produtosController.js'
import { verificarToken } from "../middlewares/verificarToken.js";

const router = Router()

router.use(verificarToken);
router.get("/", listarProdutos)

router.post("/add-produto", cadastrarProduto)

router.put("/editar-produto/:id", editarProduto)

router.delete("/deletar-produto/:id", deletarProduto)

router.get("/buscar-produto/:id", buscarProduto)
export default router
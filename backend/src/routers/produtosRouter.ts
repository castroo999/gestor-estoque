import { Router } from 'express'
import { listarProdutos } from '../controllers/produtosController.js'

const router = Router()

router.get("/", listarProdutos)

export default router
import {  Router } from "express";

import { listarEpis } from "../controllers/episControllers.js";
import { cadastrarEpi } from "../controllers/episControllers.js";
import { deletarEpi } from "../controllers/episControllers.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = Router()

router.use(verificarToken)

router.post("/registar-epi", cadastrarEpi)

router.get("/listar-epi", listarEpis)

router.delete("/deletar-epi", deletarEpi)

export default router
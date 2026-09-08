import {  Router } from "express";
import { verificarToken } from "../middlewares/verificarToken.js";
import { registrarEntrega } from "../controllers/entregasController.js";
import { listarEntregas } from "../controllers/entregasController.js";
import { deletarEntrega } from "../controllers/entregasController.js";

const router = Router();


router.use(verificarToken);

router.post("/registrar-entrega", registrarEntrega);

router.get("/listar-entregas", listarEntregas);

router.delete("/deletar-entrega/:id", deletarEntrega);

export default router;
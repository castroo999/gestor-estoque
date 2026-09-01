import { Router } from "express";
import { verificarToken } from "../middlewares/verificarToken.js";
import { cadastrarFuncionario } from "../controllers/funcionariosController.js";
import { listarFuncionarios } from "../controllers/funcionariosController.js";
import { buscarFuncionario } from "../controllers/funcionariosController.js";
import { deletarFuncionario } from "../controllers/funcionariosController.js";

const router = Router();

router.use(verificarToken);

router.post("/add-funcionario", cadastrarFuncionario);

router.get("/", listarFuncionarios)

router.get("/buscar-funcionario", buscarFuncionario)

router.delete("/deletar-funcionario", deletarFuncionario)

export default router;
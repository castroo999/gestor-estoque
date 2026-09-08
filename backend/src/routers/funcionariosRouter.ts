import { Router } from "express";
import { verificarToken } from "../middlewares/verificarToken.js";
import { cadastrarFuncionario } from "../controllers/funcionariosController.js";
import { listarFuncionarios } from "../controllers/funcionariosController.js";
import { buscarFuncionario } from "../controllers/funcionariosController.js";
import { editarFuncionario } from "../controllers/funcionariosController.js";
import { deletarFuncionario } from "../controllers/funcionariosController.js";
import { listarEntregas } from "../controllers/entregasController.js";

const router = Router()

router.use(verificarToken);

router.post("/", cadastrarFuncionario);

router.get("/", listarFuncionarios);

router.get("/:funcionarioId/inventario", listarEntregas);

router.get("/:id", buscarFuncionario);

router.put("/:id", editarFuncionario);

router.patch("/:id/desativar", deletarFuncionario);

export default router;

import { Router } from "express";
import { verificarToken } from "../middlewares/verificarToken.js";
import { cadastrarFuncionario } from "../controllers/funcionariosController.js";

const router = Router();

router.use(verificarToken);

router.post("/", cadastrarFuncionario);

export default router;
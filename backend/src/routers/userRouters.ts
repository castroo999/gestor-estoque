import { Router } from 'express'
import { loginUser } from '../controllers/userController.js'
import { cadastroUser } from '../controllers/userController.js'

const router = Router()

router.post("/login", loginUser);

router.post("/cadastrar", cadastroUser);
export default router
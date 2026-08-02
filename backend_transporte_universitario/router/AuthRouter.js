import { Router } from 'express';
import { login } from '../controller/AuthController.js';

const router = Router();

// Iniciar sesión (pública)
router.post('/login', login);

export default router;

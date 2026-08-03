import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controller/AuthController.js';

const router = Router();

// Limitador de intentos: máximo 5 peticiones por minuto en el login (anti fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { mensaje: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en un minuto.' }
});

// Iniciar sesión (pública, con límite de intentos)
router.post('/login', loginLimiter, login);

export default router;

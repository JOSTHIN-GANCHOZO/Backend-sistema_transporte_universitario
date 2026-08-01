import { Router } from "express";
import usuarioRoutes from "./UsuarioRouter.js";

const router = Router();

router.use("/usuarios", usuarioRoutes);

export default router;
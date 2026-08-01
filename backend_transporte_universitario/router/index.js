import { Router } from "express";
import usuarioRoutes from "./UsuarioRouter.js";
import rolRoutes from "./RolRouter.js";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/roles", rolRoutes);

export default router;
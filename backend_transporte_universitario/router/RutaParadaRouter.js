import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRol } from '../middleware/roles.js';
import {
  obtenerParadasDeRuta,
  asignarParadasARuta,
  eliminarParadaDeRuta
} from '../controller/RutaParadaController.js';

const router = Router();

// Obtener las paradas asociadas a una ruta (ordenadas)
router.get('/ruta/:id_ruta', verifyToken, requireRol(['ADMINISTRATIVO']), obtenerParadasDeRuta);

// Asignar/reemplazar el listado completo de paradas de una ruta (solo admin)
router.post('/asignar', verifyToken, requireRol(['ADMINISTRATIVO']), asignarParadasARuta);

// Eliminar una parada de una ruta (solo admin)
router.delete('/:id_ruta/:id_parada', verifyToken, requireRol(['ADMINISTRATIVO']), eliminarParadaDeRuta);

export default router;

import { Router } from 'express';
import {
  obtenerParadasDeRuta,
  asignarParadasARuta,
  eliminarParadaDeRuta
} from '../controller/RutaParadaController.js';

const router = Router();

// Obtener las paradas asociadas a una ruta (ordenadas)
router.get('/ruta/:id_ruta', obtenerParadasDeRuta);

// Asignar/reemplazar el listado completo de paradas de una ruta
router.post('/asignar', asignarParadasARuta);

// Eliminar una parada de una ruta
router.delete('/:id_ruta/:id_parada', eliminarParadaDeRuta);

export default router;

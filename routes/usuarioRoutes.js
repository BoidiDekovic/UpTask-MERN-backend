import express from 'express'
const router = express.Router();
import  { registrar, autenticar, confirmar, olvidePassword, comprabarToken, nuevoPassword, perfil } from '../controllers/usuarioController.js'
import checkAuth from '../middleware/checkAuth.js';

// Autenticacion , registro de confirmacion de usuarios
router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprabarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);

export default router;
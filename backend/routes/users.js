const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas de gestión de usuarios requieren autenticación + rol admin
// Rutas que requieren autenticación
router.get('/:id', verificarToken, userController.getById);
router.patch('/:id', verificarToken, userController.update);

// Rutas exclusivas para administradores
router.get('/', verificarToken, esAdmin, userController.getAll);
router.post('/', verificarToken, esAdmin, userController.create);
router.put('/:id', verificarToken, esAdmin, userController.update);
router.delete('/:id', verificarToken, esAdmin, userController.remove);

module.exports = router;

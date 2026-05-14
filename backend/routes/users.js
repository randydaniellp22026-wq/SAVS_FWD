const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas de gestión de usuarios requieren autenticación + rol admin
router.get('/', verificarToken, esAdmin, userController.getAll);
router.get('/:id', verificarToken, esAdmin, userController.getById);
router.post('/', verificarToken, esAdmin, userController.create);
router.put('/:id', verificarToken, esAdmin, userController.update);
router.patch('/:id', verificarToken, esAdmin, userController.update);
router.delete('/:id', verificarToken, esAdmin, userController.remove);

module.exports = router;

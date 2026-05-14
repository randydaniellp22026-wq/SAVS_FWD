const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Rutas públicas (lectura)
router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);

// Rutas protegidas (escritura) — requiere admin + soporte de upload de imagen
router.post('/', verificarToken, esAdmin, upload.single('image'), vehicleController.create);
router.put('/:id', verificarToken, esAdmin, upload.single('image'), vehicleController.update);
router.patch('/:id', verificarToken, esAdmin, upload.single('image'), vehicleController.update);
router.delete('/:id', verificarToken, esAdmin, vehicleController.remove);

module.exports = router;

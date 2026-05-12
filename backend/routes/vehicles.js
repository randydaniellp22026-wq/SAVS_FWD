const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);
router.post('/', verificarToken, esAdmin, vehicleController.create);
router.put('/:id', verificarToken, esAdmin, vehicleController.update);
router.patch('/:id', verificarToken, esAdmin, vehicleController.update);
router.delete('/:id', verificarToken, esAdmin, vehicleController.remove);

module.exports = router;

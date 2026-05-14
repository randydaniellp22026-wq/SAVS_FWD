const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);
router.post('/', verificarToken, vehicleController.create);
router.put('/:id', vehicleController.update);
router.patch('/:id', vehicleController.update);
router.delete('/:id', vehicleController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

<<<<<<< HEAD
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);
router.post('/', verificarToken, vehicleController.create);
router.put('/:id', vehicleController.update);
router.patch('/:id', vehicleController.update);
router.delete('/:id', vehicleController.remove);
=======
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);
router.post('/', verificarToken, esAdmin, vehicleController.create);
router.put('/:id', verificarToken, esAdmin, vehicleController.update);
router.patch('/:id', verificarToken, esAdmin, vehicleController.update);
router.delete('/:id', verificarToken, esAdmin, vehicleController.remove);
>>>>>>> 1a0abb0ae686349fc379837802fecc6cd04152ad

module.exports = router;

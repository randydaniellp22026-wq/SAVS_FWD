const express = require('express');
const router = express.Router();
const saleRequestController = require('../controllers/saleRequestController');

const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, esAdmin, saleRequestController.getAll);
router.get('/:id', verificarToken, esAdmin, saleRequestController.getById);
router.post('/', verificarToken, saleRequestController.create); // Cualquier usuario autenticado puede crear
router.put('/:id', verificarToken, esAdmin, saleRequestController.update);
router.patch('/:id', verificarToken, esAdmin, saleRequestController.update);
router.delete('/:id', verificarToken, esAdmin, saleRequestController.remove);

module.exports = router;

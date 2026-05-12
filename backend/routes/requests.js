const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, esAdmin, requestController.getAll);
router.get('/:id', verificarToken, esAdmin, requestController.getById);
router.post('/', verificarToken, requestController.create); // Cualquier usuario autenticado puede crear
router.put('/:id', verificarToken, esAdmin, requestController.update);
router.patch('/:id', verificarToken, esAdmin, requestController.update);
router.delete('/:id', verificarToken, esAdmin, requestController.remove);

module.exports = router;

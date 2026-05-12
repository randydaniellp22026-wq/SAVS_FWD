const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.patch('/:id', userController.update);
router.delete('/:id', userController.remove);
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, esAdmin, userController.getAll);
router.get('/:id', verificarToken, esAdmin, userController.getById);
router.post('/', verificarToken, esAdmin, userController.create);
router.put('/:id', verificarToken, esAdmin, userController.update);
router.patch('/:id', verificarToken, esAdmin, userController.update);
router.delete('/:id', verificarToken, esAdmin, userController.remove);

module.exports = router;

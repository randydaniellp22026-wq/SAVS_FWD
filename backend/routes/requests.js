const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/', requestController.getAll);
router.get('/:id', requestController.getById);
router.post('/', requestController.create);
router.put('/:id', requestController.update);
router.patch('/:id', requestController.update);
router.delete('/:id', requestController.remove);

module.exports = router;

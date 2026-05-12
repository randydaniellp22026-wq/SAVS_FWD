const express = require('express');
const router = express.Router();
const saleRequestController = require('../controllers/saleRequestController');

router.get('/', saleRequestController.getAll);
router.get('/:id', saleRequestController.getById);
router.post('/', saleRequestController.create);
router.put('/:id', saleRequestController.update);
router.patch('/:id', saleRequestController.update);
router.delete('/:id', saleRequestController.remove);

module.exports = router;

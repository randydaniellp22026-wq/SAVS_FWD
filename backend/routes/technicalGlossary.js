const express = require('express');
const router = express.Router();
const technicalGlossaryController = require('../controllers/technicalGlossaryController');

router.get('/', technicalGlossaryController.getAll);
router.get('/:id', technicalGlossaryController.getById);
router.post('/', technicalGlossaryController.create);
router.put('/:id', technicalGlossaryController.update);
router.patch('/:id', technicalGlossaryController.update);
router.delete('/:id', technicalGlossaryController.remove);

module.exports = router;

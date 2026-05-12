const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get('/', settingController.getAll);
router.get('/:key', settingController.getByKey);
router.post('/', settingController.createOrUpdate);

module.exports = router;

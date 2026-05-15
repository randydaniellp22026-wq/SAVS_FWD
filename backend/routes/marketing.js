const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');
const { verificarToken, esAdminOGerente } = require('../middlewares/authMiddleware');

/**
 * @route POST /api/marketing/broadcast
 * @desc Enviar correo masivo a todos los usuarios
 * @access Private (Admin/Gerente)
 */
router.post('/broadcast', verificarToken, esAdminOGerente, marketingController.broadcastEmail);

module.exports = router;

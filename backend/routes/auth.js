const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  checkEmailSchema,
  resetPasswordSchema,
} = require('../schemas/authSchemas');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', verificarToken, authController.getMe);
router.post('/check-email', validate(checkEmailSchema), authController.checkEmail);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;

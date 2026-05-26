const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken, esAdmin, esAdminOGerente } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../schemas/userSchemas');

/**
 * @openapi
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único autogenerado del usuario
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         rolId:
 *           type: integer
 *           description: ID del rol asignado
 *         rol:
 *           type: string
 *           description: Nombre legible del rol asignado
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios registrados (solo Admins/Gerentes)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de usuarios obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no provisto o inválido
 *       403:
 *         description: No posee los permisos necesarios
 */
router.get('/', verificarToken, esAdminOGerente, userController.getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a consultar
 *     responses:
 *       200:
 *         description: Datos del usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', verificarToken, userController.getById);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Registra un nuevo usuario de forma manual (solo Admins)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *               rolId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Petición incorrecta
 */
router.post('/', verificarToken, esAdmin, validate(createUserSchema), userController.create);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Actualiza completamente los datos de un usuario (solo Admins/Gerentes)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', verificarToken, esAdminOGerente, validate(updateUserSchema), userController.update);
router.patch('/:id', verificarToken, validate(updateUserSchema), userController.update);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Elimina permanentemente un usuario por su ID (solo Admins)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', verificarToken, esAdmin, userController.remove);

module.exports = router;

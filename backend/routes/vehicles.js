const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const autoAdController = require('../controllers/autoAdController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @openapi
 * components:
 *   schemas:
 *     Vehiculo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del auto
 *         name:
 *           type: string
 *           description: Nombre / Modelo comercial del auto
 *         marca:
 *           type: string
 *         modelo:
 *           type: string
 *         price:
 *           type: number
 *           description: Precio en dólares
 *         year:
 *           type: integer
 *           description: Año de fabricación
 *         image:
 *           type: string
 *           description: URL o ruta de la imagen en el servidor
 *         type:
 *           type: string
 *           description: Tipo de carrocería (Sedán, SUV, Pick-up, etc.)
 *         fuel:
 *           type: string
 *         transmission:
 *           type: string
 *         color:
 *           type: string
 *         doors:
 *           type: integer
 *         passengers:
 *           type: integer
 *         mileage:
 *           type: integer
 *         tag:
 *           type: string
 *           description: Estado de venta (Disponible, Vendido, Promoción)
 */

/**
 * @openapi
 * /vehicles:
 *   get:
 *     summary: Lista vehículos del inventario con paginación, filtros y búsquedas dinámicas
 *     tags: [Vehículos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Autos por página (default 20)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda inteligente por texto libre
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo (SUV, Sedán, etc.)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Catálogo paginado de vehículos devuelto exitosamente
 */
router.get('/', vehicleController.getAll);

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     summary: Obtiene detalles de un vehículo por su ID
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/:id', vehicleController.getById);

/**
 * @openapi
 * /vehicles/auto-ad:
 *   post:
 *     summary: Analiza imagen de auto con visión computacional IA para pre-completar datos (Admins)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Atributos y copia publicitaria inferida por la IA
 */
router.post(
  '/auto-ad',
  verificarToken,
  esAdmin,
  upload.single('image'),
  autoAdController.generateAutoAd
);

/**
 * @openapi
 * /vehicles:
 *   post:
 *     summary: Crea un nuevo vehículo en el inventario con imagen (Admins)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               year:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vehículo creado correctamente
 */
router.post('/', verificarToken, esAdmin, upload.single('image'), vehicleController.create);

/**
 * @openapi
 * /vehicles/{id}:
 *   put:
 *     summary: Edita o actualiza los datos de un vehículo (Admins)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *       404:
 *         description: Vehículo no encontrado
 */
router.put('/:id', verificarToken, esAdmin, upload.single('image'), vehicleController.update);
router.patch('/:id', verificarToken, esAdmin, upload.single('image'), vehicleController.update);

/**
 * @openapi
 * /vehicles/{id}:
 *   delete:
 *     summary: Elimina permanentemente un vehículo del catálogo (Admins)
 *     tags: [Vehículos]
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
 *         description: Vehículo eliminado del catálogo
 *       404:
 *         description: Vehículo no encontrado
 */
router.delete('/:id', verificarToken, esAdmin, vehicleController.remove);

module.exports = router;

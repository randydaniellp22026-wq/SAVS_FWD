const router = require('express').Router();

router.use('/tracking', require('./tracking'));
router.use('/trade-in', require('./tradeIn'));
router.use('/marketing', require('./marketing'));
router.use('/crm', require('./crm'));
router.use('/loyalty', require('./loyalty'));
router.use('/appointments', require('./appointments'));
router.use('/promotions', require('./promotions'));
router.use('/reports', require('./reports'));

// Rutas migradas al estándar v1
router.use('/auth', require('../auth'));
router.use('/users', require('../users'));
router.use('/vehicles', require('../vehicles'));
router.use('/reviews', require('../reviews'));
router.use('/requests', require('../requests'));
router.use('/sale_requests', require('../saleRequests'));
router.use('/branches', require('../branches'));
router.use('/technical_glossary', require('../technicalGlossary'));
router.use('/settings', require('../settings'));
router.use('/chatbot', require('../chatbot'));
router.use('/points', require('../points'));

router.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0' }));

module.exports = router;

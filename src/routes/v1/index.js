const express = require('express');

const { infoController } = require('../../controllers');
const bookingRoutes = require('./booking');

const router = express.Router();

router.get('/info', infoController.info);
router.use('/bookings', bookingRoutes);

module.exports = router;
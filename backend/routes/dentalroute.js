const express = require('express');
const {
  getAppointments,
  createAppointment,
} = require('../controllers/dentalController');

const router = express.Router();

// GET /dental/appointments
router.get('/appointments', getAppointments);

// POST /dental/appointments
router.post('/appointments', createAppointment);

module.exports = router;
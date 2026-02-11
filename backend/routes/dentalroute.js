const express = require('express');
const {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/dentalController');
const {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const {
  getDentists,
  createDentist,
  getDentistById,
  updateDentist,
  deleteDentist,
} = require('../controllers/dentistController');

const router = express.Router();
  //Dental Routes

// GET /dental/appointments
router.get('/appointments', getAppointments);

// POST /dental/appointments
router.post('/appointments', createAppointment);

// GET /dental/appointments/:id
router.get('/appointments/:id', getAppointmentById);

// PUT /dental/appointments/:id
router.put('/appointments/:id', updateAppointment);

// DELETE /dental/appointments/:id
router.delete('/appointments/:id', deleteAppointment);

// Patient Routes
router.get('/patients', getPatients);
router.post('/patients', createPatient);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

// Dentist Routes
router.get('/dentists', getDentists);
router.post('/dentists', createDentist);
router.get('/dentists/:id', getDentistById);
router.put('/dentists/:id', updateDentist);
router.delete('/dentists/:id', deleteDentist);

module.exports = router;
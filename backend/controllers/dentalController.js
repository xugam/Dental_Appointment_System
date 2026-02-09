const Appointment = require('../models/Appointment');

// GET /dental/appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ dateTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

// POST /dental/appointments
const createAppointment = async (req, res) => {
  try {
    const { patientName, dentistName, dateTime, reason } = req.body;

    if (!patientName || !dentistName || !dateTime) {
      return res
        .status(400)
        .json({ message: 'patientName, dentistName and dateTime are required' });
    }

    const appointment = new Appointment({ patientName, dentistName, dateTime, reason: reason || '' });
    await appointment.save().then(appointment => res.status(201).json(appointment))
    .catch(err => res.status(400).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

module.exports = { getAppointments, createAppointment };
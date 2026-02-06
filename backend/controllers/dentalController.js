const getDental = (req, res) => {
  res.json({message: 'hello'});
}
const appointments = [];

// GET /dental/appointments
const getAppointments = (req, res) => {
  res.json(appointments);
};

// POST /dental/appointments
const createAppointment = (req, res) => {
  const { patientName, dentistName, dateTime, reason } = req.body;

  // basic validation
  if (!patientName || !dentistName || !dateTime) {
    return res.status(400).json({ message: 'patientName, dentistName and dateTime are required' });
  }

  const newAppointment = {
    id: appointments.length + 1,
    patientName,
    dentistName,
    dateTime,
    reason: reason || '',
    status: 'scheduled',
  };

  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
};

module.exports = {
  getAppointments,
  createAppointment,
};

module.exports = {
  getAppointments,
  createAppointment,

};
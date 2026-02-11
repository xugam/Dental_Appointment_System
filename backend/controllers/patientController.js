const Patient = require('../models/Patients');

// GET /dental/patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ name: 1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
};

// POST /dental/patients
const createPatient = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // Validate phone number (exactly 10 digits)
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }
    const digitsOnly = phone.toString().replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }
    
    const patient = new Patient({ name, email, phone, address });
    await patient.save().then(patient => res.status(201).json(patient))
    .catch(err => res.status(400).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create patient', error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try{
    const patient = await Patient.findById(req.params.id);
    if(!patient){
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patient', error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try{
    // Validate phone number if provided
    if (req.body.phone !== undefined) {
      const digitsOnly = req.body.phone.toString().replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
    }
    
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if(!patient){
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update patient', error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try{
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if(!patient){
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete patient', error: error.message });
  }
};

module.exports = { getPatients, createPatient, getPatientById, updatePatient, deletePatient };
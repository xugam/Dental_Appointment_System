const Dentists = require('../models/Dentists');

// GET /dental/dentists
const getDentists = async (req, res) => {
  try {
    const dentists = await Dentists.find().sort({ name: 1 });
    res.json(dentists);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dentists', error: error.message });
  }
};

    // POST /dental/dentists
const createDentist = async (req, res) => {
  try {
    const { name, specialization, experience, phone } = req.body;
    
    // Validate phone number (exactly 10 digits)
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }
    const digitsOnly = phone.toString().replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }
    
    const dentist = new Dentists({ name, specialization, experience, phone: Number(digitsOnly) });
    await dentist.save().then(dentist => res.status(201).json(dentist))
    .catch(err => res.status(400).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create dentist', error: error.message });
  }
};

const getDentistById = async (req, res) => {
  try{
    const dentist = await Dentists.findById(req.params.id);
    if(!dentist){
      return res.status(404).json({ message: 'Dentist not found' });
    }
    res.json(dentist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dentist', error: error.message });
  }
};

            const updateDentist = async (req, res) => {
  try{
    // Validate phone number if provided
    if (req.body.phone !== undefined) {
      const digitsOnly = req.body.phone.toString().replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
      req.body.phone = Number(digitsOnly);
    }
    
    const dentist = await Dentists.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if(!dentist){
      return res.status(404).json({ message: 'Dentist not found' });
    }
    res.json(dentist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update dentist', error: error.message });
  }
};

const deleteDentist = async (req, res) => {
  try{
    const dentist = await Dentists.findByIdAndDelete(req.params.id);
    if(!dentist){
      return res.status(404).json({ message: 'Dentist not found' });
    }
    res.json({ message: 'Dentist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete dentist', error: error.message });
  }
};

module.exports = { getDentists, createDentist, getDentistById, updateDentist, deleteDentist };
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
    const dentist = new Dentists({ name, specialization, experience, phone });
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
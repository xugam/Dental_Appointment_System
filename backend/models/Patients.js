const mongoose = require('mongoose');

const patientsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          const digitsOnly = v.replace(/\D/g, '');
          return digitsOnly.length === 10;
        },
        message: 'Phone number must be exactly 10 digits'
      }
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patients', patientsSchema);
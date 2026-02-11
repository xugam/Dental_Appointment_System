const mongoose = require('mongoose');

const dentistsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    phone: {
        type: Number,
        required: true,
        validate: {
          validator: function(v) {
            const digitsOnly = v.toString().replace(/\D/g, '');
            return digitsOnly.length === 10;
          },
          message: 'Phone number must be exactly 10 digits'
        }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dentists', dentistsSchema);
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
        trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dentists', dentistsSchema);
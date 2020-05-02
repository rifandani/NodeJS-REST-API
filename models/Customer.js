// untuk user login

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CustomerSchema = new mongoose.Schema({
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
  balance: {
    type: Number,
    default: 0,
  },
});

// buat kolom created_at dan updated_at
CustomerSchema.plugin(timestamp);

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;

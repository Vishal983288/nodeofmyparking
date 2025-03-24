const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  parkingLot: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'parking', 
    required: true 
  },
  slotNumber: { 
    type: String, 
    required: true 
  },
  vehicleType: {
    type: String,
    enum: ['4 Wheeler', '2 Wheeler'],
    required: true
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  hourlyCharge: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('reservation', reservationSchema);
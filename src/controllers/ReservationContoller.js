const Reservation = require("../models/ReservationModel");

// Helper function for error handling
const handleError = (res, error, status = 400) => {
  console.error(error);
  res.status(status).json({ 
    success: false,
    message: error.message || 'Operation failed' 
  });
};

exports.getActiveReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.id,
      endTime: { $gt: new Date() },
      status: 'active'
    }).populate('parkingLot', 'name location');

    res.json({ success: true, data: reservations });
  } catch (err) {
    handleError(res, err, 500);
  }
};

exports.getPastReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.id,
      $or: [
        { endTime: { $lt: new Date() } },
        { status: { $in: ['completed', 'cancelled'] } }
      ]
    }).populate('parkingLot', 'name location');

    res.json({ success: true, data: reservations });
  } catch (err) {
    handleError(res, err, 500);
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { parkingLot, slotNumber, vehicleType, startTime, endTime } = req.body;
    
    // Validate time inputs
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('End time must be after start time');
    }

    const hourlyCharge = vehicleType === '4 Wheeler' ? 100 : 70;

    const reservation = new Reservation({
      user: req.user.id,
      parkingLot,
      slotNumber,
      vehicleType,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      hourlyCharge
    });

    await reservation.save();
    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['slotNumber', 'startTime', 'endTime', 'vehicleType'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ success: false, message: 'Invalid updates!' });
    }

    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, data: reservation });
  } catch (err) {
    handleError(res, err);
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: 'active' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Active reservation not found' });
    }

    res.json({ success: true, data: reservation });
  } catch (err) {
    handleError(res, err);
  }
};
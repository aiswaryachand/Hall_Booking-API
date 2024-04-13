const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/room');

router.post('/', RoomController.createRoom);
router.post('/bookings', RoomController.bookRoom);
router.get('/allBookings', RoomController.getAllBookedRoom);
router.get('/customers/bookings', RoomController.getAllCustomerData);
router.get('/customers/bookings-count', RoomController.bookedCount);

module.exports = router;
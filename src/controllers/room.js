const roomData = [];
const bookings = [];

const createRoom = (req, res) => {
  const { seats, amenities, price_per_hour } = req.body;

  // Validate required fields
  if (!seats || !amenities || !price_per_hour) {
    res.status(400).send({ message: 'Missing required fields' });
  } else {
    const room = {
      id: roomData.length + 1,
      seats,
      amenities,
      price_per_hour,
    };
    roomData.push(room);
    res.status(201).send({ message: 'Room created successfully', room });

  }
};


const bookRoom = (req, res) => {
  const { customer_name, date, start_time, end_time, room_id } = req.body;

  // Validate required fields
  if (!customer_name || !date || !start_time || !end_time || !room_id) {
    res.status(400).send({ message: 'Missing required booking fields' });
  }

  // Check if the room exists
  const room = roomData.find((room) => room.id === room_id);
  if (!room) {
    res.status(404).send({ error: 'Room not found' });
  }

  let conflict = false;

  for (const booking of bookings) {
    if (
      booking.room_id === room_id &&
      booking.date === date &&
      !(end_time <= booking.start_time || start_time >= booking.end_time)
    ) {
      conflict = true;
      break;
    }
  }

  if (conflict) {
    res.status(409).send({ error: 'Room already booked for the selected date and time' });
  } else {

    // Create a new booking
    const newBooking = {
      id: bookings.length + 1,
      customer_name,
      date,
      start_time,
      end_time,
      room_id,
      booking_date: new Date(),
      booking_status: 'confirmed',
    };

    bookings.push(newBooking);

    res.status(201).send({ message: 'Booking created successfully', booking: newBooking });
  }

};


const getAllBookedRoom = (req, res) => {
  try {
    const roomsWithBookings = roomData.map((room) => {
      const bookingsForRoom = bookings.filter((booking) => booking.room_id === room.id);
      const bookedStatus = bookingsForRoom.length > 0;

      return {
        id: room.id,
        seats: room.seats,
        amenities: room.amenities,
        price_per_hour: room.price_per_hour,
        booked_status: bookedStatus,
        bookings: bookingsForRoom.map((booking) => ({
          customer_name: booking.customer_name,
          date: booking.date,
          start_time: booking.start_time,
          end_time: booking.end_time,
        })),
      };
    });

    res.status(200).send({ message: "Data fetched successfully", rooms: roomsWithBookings });
  } catch (error) {
    res.status(500).send({ message: "Internal error" });
  }
};


const getAllCustomerData = (req, res) => {
  try {
    const customersWithBookings = bookings.map((booking) => {
      const room = roomData.find((r) => r.id === booking.room_id);
      if (!room) {
        return null;

      }

      return {
        customer_name: booking.customer_name,
        room_name: `Room ${room.id}`,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
      };
    });

    res.status(200).send({ message: "Data fetched successfully", customers: customersWithBookings });
  } catch (error) {
    res.status(500).send({ message: "Internal error" });
  }
};



const bookedCount = (req, res) => {
  try {
    const bookingDetails = bookings.map((booking) => {
      const room = roomData.find((r) => r.id === booking.room_id);
      if (!room) {
        throw new Error(`Room not found for booking ID ${booking.id}`);
      }

      return {
        customer_name: booking.customer_name,
        room_name: `Room ${room.id}`,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        booking_id: booking.id,
        booking_date: booking.booking_date, 
        booking_status: booking.booking_status, 
      };
    });

    const customerBookingCounts = {};
    bookingDetails.forEach((booking) => {
      const key = `${booking.customer_name}_${booking.room_name}`;
      customerBookingCounts[key] = customerBookingCounts[key] + 1 || 1;
    });

    const result = bookingDetails.map((booking) => ({
      ...booking,
      booking_count: customerBookingCounts[`${booking.customer_name}_${booking.room_name}`],
    }));

    res.status(200).send({ message: "Data fetched successfully", bookings: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};






module.exports = {
  createRoom, bookRoom, getAllBookedRoom, getAllCustomerData, bookedCount
};
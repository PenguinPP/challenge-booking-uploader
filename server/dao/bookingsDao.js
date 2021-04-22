const fs = require("fs");

const bookingDataPath = "./server/data/bookings.json";

class BookingDao {
  //Read bookings from file
  readBookings() {
    const bookings = JSON.parse(fs.readFileSync(bookingDataPath)).map(
      (bookingRecord) => ({
        time: Date.parse(bookingRecord.time),
        duration: bookingRecord.duration * 60 * 1000, // mins into ms
        userId: bookingRecord.user_id,
      })
    );

    return bookings;
  }

  //Write bookings to file
  writeBookings(bookingsList) {
    fs.writeFileSync(
      bookingDataPath,
      JSON.stringify(this.bookingsToJson(bookingsList))
    );
  }

  //Parse bookings into required Json format for writing to file
  bookingsToJson(bookingsList) {
    const formattedBookingsList = bookingsList.map((bookingRecord) => ({
      time: new Date(bookingRecord.time).toString(),
      duration: bookingRecord.duration / 60 / 1000,
      user_id: bookingRecord.userId,
    }));

    return formattedBookingsList;
  }
}

module.exports = { BookingDao };

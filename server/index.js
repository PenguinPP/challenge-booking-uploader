const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { BookingDao } = require("./dao/bookingsDao");

const port = 3001;

const app = express();
app.use(cors()); // so that app can access
app.use(express.json());

const bookingDao = new BookingDao();
const bookings = bookingDao.readBookings();

app.get("/bookings", (_, res) => {
  res.json(bookings);
});

app.post("/bookings/add", (req, res) => {
  console.log(req.body);
  req.body.map((newBooking) => {
    bookings.push(newBooking);
  });
  bookingDao.writeBookings(bookings);
  res.send(bookings);
});

app.listen(port, () => {
  console.log("Server is listening on port: " + port);
});

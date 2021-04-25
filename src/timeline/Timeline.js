import React from "react";
import "./Timeline.css";

export default function Timeline({ bookings, newBookings }) {
  const bookingsList = bookings["bookings"];
  const newBookingsList = bookings["newBookings"];
  const dateList = [];
  const bookingsByDate = {};
  const newBookingsByDate = {};

  bookingsList.map((booking) => {
    const date = new Date(booking.time).toDateString();

    if (!(date in dateList)) {
      dateList.push(date);
      bookingsByDate[date] = [];
      booking.new = false;
      bookingsByDate[date].push(booking);
    }
  });

  newBookingsList.map((booking) => {
    const date = booking.time.toDateString();
    booking.new = true;

    console.log("date");
    if (!(date in dateList)) {
      dateList.push(date);
      bookingsByDate[date] = [];
      bookingsByDate[date].push(booking);
    } else {
      console.log("checking conflict");
      checkConflict(bookingsByDate[date], booking);
    }
  });
  console.log(bookingsByDate);
  return (
    <div>
      {bookingsList.map((booking) => {
        const date = new Date(booking.time);
        return <p>{date.toString()}</p>;
      })}
    </div>
  );
}

function checkConflict(dailyBookings, newBooking) {
  dailyBookings.map((booking) => {
    console.log(booking);
    console.log(newBooking);
  });
}

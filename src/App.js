import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import "./App.css";
// import csv from "csv";
import { parse } from "csv/lib/sync";
import { areIntervalsOverlapping, addMilliseconds } from "date-fns";

const apiUrl = "http://localhost:3001";

export const App = () => {
  const [bookings, setBookings] = useState([]);
  const [newBookings, setNewBookings] = useState([]);
  const [newBookingsWithValidity, setNewBookingsWithValidity] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(setBookings);
  }, []);

  useEffect(() => {
    const validatedBookings = newBookings.map((booking) => {
      const { time: startTime, duration, userId } = booking;
      const endTime = addMilliseconds(startTime, duration);

      let isOverlap = false;

      for (const existingBooking of bookings) {
        const {
          time: existingBookingStart,
          duration: existingBookingDuration,
        } = existingBooking;
        const existingBookingEnd = addMilliseconds(
          existingBookingStart,
          existingBookingDuration
        );

        if (
          areIntervalsOverlapping(
            { start: startTime, end: endTime },
            { start: existingBookingStart, end: existingBookingEnd }
          )
        ) {
          isOverlap = true;
          break;
        }
      }

      return { ...booking, hasConflict: isOverlap };
    });
    setNewBookingsWithValidity(validatedBookings);
  }, [newBookings]);

  const onDrop = (files) => {
    const reader = new FileReader();

    reader.onload = () => {
      const unformattedRecords = parse(reader.result, { from_line: 2 });

      const formattedRecords = unformattedRecords.map((record) => {
        return {
          time: new Date(record[0].trim()),
          duration: record[1].trim() * 60 * 1000,
          userId: record[2].trim(),
        };
      });

      setNewBookings(formattedRecords);
    };

    reader.readAsBinaryString(files[0]);
  };

  return (
    <div className="App">
      <div className="App-header">
        <Dropzone accept=".csv" onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div className="App-main">
        <p>Existing bookings:</p>
        {bookings.map((booking, i) => {
          const date = new Date(booking.time);
          const duration = booking.duration / (60 * 1000);
          return (
            <p key={i} className="App-booking">
              <span className="App-booking-time">{date.toString()}</span>
              <span className="App-booking-duration">
                {duration.toFixed(1)}
              </span>
              <span className="App-booking-user">{booking.userId}</span>
            </p>
          );
        })}
        <p>New Bookings: </p>
        {newBookingsWithValidity.map((booking, i) => {
          console.log(booking);
          const date = new Date(booking.time);
          const duration = booking.duration / (60 * 1000);
          return (
            <p key={i} className="App-booking">
              <span className="App-booking-time">{date.toString()}</span>
              <span className="App-booking-duration">
                {duration.toFixed(1)}
              </span>
              <span className="App-booking-user">{booking.userId}</span>
              <span className="App-booking-user">
                {String(booking.hasConflict)}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

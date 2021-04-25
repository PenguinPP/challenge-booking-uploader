import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import "./App.css";
import { parse } from "csv/lib/sync";
import { isValid } from "date-fns";
import Timeline from "./timeline/Timeline";
import { checkBookingValidity } from "./utils/timeUtils";
const apiUrl = "http://localhost:3001";

export const App = () => {
  const [bookings, setBookings] = useState([]);
  const [newBookings, setNewBookings] = useState([]);
  const [newBookingsWithValidity, setNewBookingsWithValidity] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(setBookings);
  }, [newBookings]);

  useEffect(() => {
    const validatedBookings = checkBookingValidity(bookings, newBookings);
    setNewBookingsWithValidity(validatedBookings);
  }, [newBookings]);

  const onDrop = (files) => {
    const reader = new FileReader();

    reader.onload = () => {
      const unformattedRecords = parse(reader.result, { from_line: 2 });
      console.log(unformattedRecords);
      const isRecordValidSize = (record) => {
        return record.length === 3;
      };
      const durationIsNumber = (record) => {
        return Number(record[1].trim());
      };
      const timeIsValidDate = (record) => {
        return isValid(new Date(record[0].trim()));
      };
      if (!unformattedRecords.every(isRecordValidSize)) {
        alert(
          "Error with CSV file, ensure CSV has 3 columns: time, duration, userId"
        );
        return;
      }
      if (!unformattedRecords.every(durationIsNumber)) {
        alert("Duration must be a number.");
        return;
      }
      if (!unformattedRecords.every(timeIsValidDate)) {
        alert("Invalid date in CSV file.");
        return;
      }

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

  const sendNewBookings = () => {
    fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        newBookingsWithValidity
          .filter((booking) => !booking.hasConflict)
          .map((booking) => {
            const { time, duration, userId } = booking;

            return {
              time: time.getTime(),
              duration: duration,
              userId: userId,
            };
          })
      ),
    })
      .then(setNewBookings([]))
      .then(setNewBookingsWithValidity([]))
      .catch((error) => console.error(error));
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
        <div className="App-chart">
          <Timeline
            bookings={bookings}
            newBookingsWithValidity={newBookingsWithValidity}
          />
        </div>
        {newBookingsWithValidity.length > 0 && (
          <button onClick={() => sendNewBookings()}>Send Valid Bookings</button>
        )}
      </div>
    </div>
  );
};

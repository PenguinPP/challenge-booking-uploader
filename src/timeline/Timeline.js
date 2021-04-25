import React from "react";
import {
  areIntervalsOverlapping,
  addMilliseconds,
  lightFormat,
} from "date-fns";
import Chart from "react-google-charts";

export default function Timeline({ bookings, newBookingsWithValidity }) {
  //Array containing formatted data for use in chart
  const displayData = [
    [
      { type: "string", id: "Term" },
      { type: "string", id: "Name" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
  ];

  //Add existing bookings to displayData
  for (let booking of bookings) {
    const { time: startTime, duration, userId } = booking;
    const endTime = addMilliseconds(startTime, duration);
    displayData.push([
      "Existing Bookings",
      userId,
      new Date(startTime),
      endTime,
    ]);
  }

  //Add new bookings to displayData and differentiate between valid and invalid bookings
  for (let booking of newBookingsWithValidity) {
    const { time: startTime, duration, userId, hasConflict } = booking;
    const endTime = addMilliseconds(startTime, duration);
    if (hasConflict) {
      displayData.push([
        "New Invalid Bookings (scheduling conflicts)",
        userId,
        new Date(startTime),
        endTime,
      ]);
    } else {
      displayData.push([
        "New Valid Bookings (no conflicts)",
        userId,
        new Date(startTime),
        endTime,
      ]);
    }
  }

  //render chart
  return (
    <Chart
      width={"90%"}
      chartType="Timeline"
      loader={<div>Loading Chart</div>}
      data={displayData}
      options={{
        colors: ["#2aaaf8", "#da2636", "#30b822"],
        timeline: {
          colorByRowLabel: true,
        },
      }}
    />
  );
}

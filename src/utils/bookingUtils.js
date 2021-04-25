import { addMilliseconds, areIntervalsOverlapping } from "date-fns";

export function checkBookingValidity(bookings, unvalidatedBookings) {
  const validatedBookings = unvalidatedBookings.map((newBooking) => {
    const { time: startTime, duration } = newBooking;
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

    return { ...newBooking, hasConflict: isOverlap };
  });

  return validatedBookings;
}

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const services = {
  "Shiroabhayanga": 50,
  "Padabhayanga": 50,
  "Lepa Snana": 30,
  "Test Service": 60
};

const buffer = 30;

app.use(cors());
app.use(express.json());

const bookingsFile = path.join(__dirname, "bookings.json");

// Test route
app.get("/", (req, res) => {
  res.send("Backend works!");
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
  try {
    const fileData = fs.readFileSync(bookingsFile, "utf8");
    const bookings = JSON.parse(fileData);

    res.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error("Error reading bookings:", error);

    res.status(500).json({
      success: false,
      message: "Could not load bookings."
    });
  }
});

// Available booking times
app.get("/api/bookings/available-times", (req, res) => {
  const { service, date } = req.query;

 

  const duration = services[service];

  if (!duration || !date) {
    return res.status(400).json({
      success: false,
      message: "Invalid service or date."
    });
  }

  const fileData = fs.readFileSync(bookingsFile, "utf8");
const bookings = JSON.parse(fileData);

const times = [];

const buffer = 30;
const totalDuration = duration + buffer;

// Convert working hours to minutes
const startOfDay = 9 * 60;
const endOfDay = 18 * 60;

for (
  let minutes = startOfDay;
  minutes + totalDuration <= endOfDay;
  minutes += 30
) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  const time =
    `${String(hour).padStart(2, "0")}:` +
    `${String(minute).padStart(2, "0")}`;

  const bookingExists = bookings.some((booking) => {
  if (
    booking.date !== date ||
    booking.status === "cancelled"
  ) {
    return false;
  }

  // Convert booking start time to minutes
  const [bookingHour, bookingMinute] = booking.time
    .split(":")
    .map(Number);

  const bookingStart =
    bookingHour * 60 + bookingMinute;

  const bookingDuration =
    services[booking.service] || 0;

  const bookingEnd =
    bookingStart + bookingDuration + buffer;

  // Current requested slot
  const [requestedHour, requestedMinute] =
    time.split(":").map(Number);

  const requestedStart =
    requestedHour * 60 + requestedMinute;

  const requestedEnd =
    requestedStart + totalDuration;

  // Check for overlap
  return (
    requestedStart < bookingEnd &&
    requestedEnd > bookingStart
  );
});

  if (!bookingExists) {
    times.push(time);
  }
}

res.json({
  success: true,
  service,
  date,
  duration,
  availableTimes: times
});
});

// Check if a booking slot is available
app.get("/api/bookings/check", (req, res) => {
  const { service, date, time } = req.query;

  try {
    const fileData = fs.readFileSync(bookingsFile, "utf8");
    const bookings = JSON.parse(fileData);

    const requestedDuration = services[req.body.service];

if (!requestedDuration) {
  return res.status(400).json({
    success: false,
    message: "Invalid service."
  });
}

const requestedStart = (() => {
  const [hour, minute] = req.body.time.split(":").map(Number);
  return hour * 60 + minute;
})();

const requestedEnd =
  requestedStart + requestedDuration + buffer;

const bookingExists = bookings.some((booking) => {
  if (
    booking.date !== req.body.date ||
    booking.status === "cancelled"
  ) {
    return false;
  }

  const existingDuration = services[booking.service];

  if (!existingDuration) {
    return false;
  }

  const [hour, minute] = booking.time.split(":").map(Number);

  const existingStart =
    hour * 60 + minute;

  const existingEnd =
    existingStart + existingDuration + buffer;

  return (
    requestedStart < existingEnd &&
    requestedEnd > existingStart
  );
});

    res.json({
      available: !bookingExists
    });

  } catch (error) {
    console.error("Error checking booking:", error);

    res.status(500).json({
      available: false,
      message: "Could not check booking."
    });
  }
});

// Create booking
app.post("/api/bookings", (req, res) => {
  console.log("Booking received:");
  console.log(req.body);

  try {
    // Read existing bookings
    const fileData = fs.readFileSync(bookingsFile, "utf8");
    const bookings = JSON.parse(fileData);

// Check if the time slot is already booked
const requestedDuration = services[req.body.service];

if (!requestedDuration) {
  return res.status(400).json({
    success: false,
    message: "Invalid service."
  });
}

const [requestedHour, requestedMinute] =
  req.body.time.split(":").map(Number);

const requestedStart =
  requestedHour * 60 + requestedMinute;

const requestedEnd =
  requestedStart + requestedDuration + buffer;

const bookingExists = bookings.some((booking) => {
  if (
    booking.date !== req.body.date ||
    booking.status === "cancelled"
  ) {
    return false;
  }

  const existingDuration = services[booking.service];

  if (!existingDuration) {
    return false;
  }

  const [existingHour, existingMinute] =
    booking.time.split(":").map(Number);

  const existingStart =
    existingHour * 60 + existingMinute;

  const existingEnd =
    existingStart + existingDuration + buffer;

  return (
    requestedStart < existingEnd &&
    requestedEnd > existingStart
  );
});

if (bookingExists) {
  return res.status(409).json({
    success: false,
    message: "This time slot is already booked."
  });
}

   // Create new booking
const newBooking = {
  id: `BK-${Date.now()}`,
  ...req.body,
  status: "pending"
};

// Add booking to the list
bookings.push(newBooking);

    // Save bookings
    fs.writeFileSync(
      bookingsFile,
      JSON.stringify(bookings, null, 2)
    );

    res.json({
      success: true,
      message: "Booking saved successfully!",
      booking: newBooking
    });

  } catch (error) {
    console.error("Error saving booking:", error);

    res.status(500).json({
      success: false,
      message: "Could not save booking."
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`SERVER IS RUNNING`);
});
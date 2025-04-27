// backend/server.js

// Load dependencies
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://healthcare-platform-a09b8.firebaseio.com"
});

const db = admin.firestore();

// Route to book an appointment
app.post('/book-appointment', async (req, res) => {
  const { doctorId, patientName, date, time } = req.body;

  try {
    // Validate input
    if (!doctorId || !patientName || !date || !time) {
      return res.status(400).json({ error: 'All fields (doctorId, patientName, date, time) are required.' });
    }

    // Check if the date is within the next 4 days
    const today = new Date();
    const bookingDate = new Date(date);
    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(today.getDate() + 4);

    if (bookingDate < today || bookingDate > maxBookingDate) {
      return res.status(400).json({ error: 'You can only book appointments within the next 4 days.' });
    }

    // Check if the time slot is already booked
    const existingAppointment = await db.collection('appointments')
      .where('doctorId', '==', doctorId)
      .where('date', '==', date)
      .where('time', '==', time)
      .get();

    if (!existingAppointment.empty) {
      return res.status(400).json({ error: `The time slot ${time} on ${date} is already booked.` });
    }

    // Create a new appointment
    const appointmentRef = db.collection('appointments').doc();
    await appointmentRef.set({
      doctorId,
      patientName,
      date,
      time,
      status: 'Confirmed',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error in /book-appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Healthcare Backend API');
});

const firebaseConfigRoute = require('./routes/firebase-config');
app.use('/', firebaseConfigRoute);

// Start the server
const PORT = process.env.PORT || 5001; // Change to 5001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

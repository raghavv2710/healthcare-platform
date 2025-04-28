// backend/server.js

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

// 1) Return Firebase client config
app.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: "AIzaSyB5gBk_3WjEE5HdlpT_qnquQYJUAJN6vmc",
    authDomain: "healthcare-platform-a09b8.firebaseapp.com",
    projectId: "healthcare-platform-a09b8",
    storageBucket: "healthcare-platform-a09b8.appspot.com",
    messagingSenderId: "159575142942",
    appId: "1:159575142942:web:f1bec02a9b46910531f40f",
    measurementId: "G-D2PT6VT8EC"
  });
});

// 2) List all doctors
app.get('/doctors', async (req, res) => {
  try {
    const snap = await db.collection('doctors').get();
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(docs);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3) Book an appointment
app.post('/book-appointment', async (req, res) => {
  const { doctorId, patientId, patientName, doctorName, date, time } = req.body;
  if (!doctorId || !patientId || !patientName || !doctorName || !date || !time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    // Prevent double-booking
    const exists = await db.collection('appointments')
      .where('doctorId', '==', doctorId)
      .where('date', '==', date)
      .where('time', '==', time)
      .get();
    if (!exists.empty) {
      return res.status(400).json({ error: `Slot ${time} on ${date} already booked.` });
    }
    const appointment = {
      doctorId,
      patientId,
      patientName,
      doctorName,
      date,
      time,
      status: 'Confirmed',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('appointments').add(appointment);
    res.json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4) Get all appointments for a patient
app.get('/appointments/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const appointmentsSnapshot = await db.collection('appointments')
      .where('patientId', '==', patientId)
      .orderBy('createdAt', 'desc')
      .get();

    if (appointmentsSnapshot.empty) {
      return res.status(200).json([]); // Return an empty array if no appointments are found
    }

    const appointments = appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5) Get appointments for a doctor
app.get('/appointments/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    const snap = await db.collection('appointments')
      .where('doctorId', '==', doctorId)
      .orderBy('createdAt', 'desc')
      .get();

    if (snap.empty) {
      return res.status(200).json([]); // Return an empty array if no appointments are found
    }

    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(list);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

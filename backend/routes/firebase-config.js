// backend/routes/firebaseConfig.js
const express = require('express');
const router = express.Router();

router.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: "AIzaSyB5gBk_3WjEE5HdlpT_qnquQYJUAJN6vmc",
    authDomain: "healthcare-platform-a09b8.firebaseapp.com",
    projectId: "healthcare-platform-a09b8",
    storageBucket: "healthcare-platform-a09b8.firebasestorage.app",
    messagingSenderId: "159575142942",
    appId: "1:159575142942:web:f1bec02a9b46910531f40f",
    measurementId: "G-D2PT6VT8EC"
  });
});

module.exports = router;

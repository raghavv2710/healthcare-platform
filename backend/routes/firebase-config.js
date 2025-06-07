// backend/routes/firebaseConfig.js
const express = require('express');
const router = express.Router();

router.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  });
});

module.exports = router;

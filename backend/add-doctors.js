const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://healthcare-platform-a09b8.firebaseio.com"
});

const db = admin.firestore(); // Use admin.firestore() for Firestore
const auth = admin.auth(); // Use admin.auth() for Authentication

// Add doctors to Firestore and Authentication
async function addDoctors() {
  const doctors = [
    {
        "name": "Dr. Aryan Mehta",
        "specialization": "cardiologist",
        "availability": ["Monday", "Wednesday", "Friday"],
        "email": "aryanmehta@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Grace Mitchell",
        "specialization": "cardiologist",
        "availability": ["Tuesday", "Thursday"],
        "email": "gracemitchell@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Rahul Chatterjee",
        "specialization": "cardiologist",
        "availability": ["Wednesday", "Saturday"],
        "email": "rahulchatterjee@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Kavya Sinha",
        "specialization": "dermatologist",
        "availability": ["Monday", "Tuesday", "Thursday"],
        "email": "kavyasinha@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Lucas Carter",
        "specialization": "dermatologist",
        "availability": ["Wednesday", "Friday"],
        "email": "lucascarter@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Niharika Rao",
        "specialization": "dermatologist",
        "availability": ["Thursday", "Saturday"],
        "email": "niharikarao@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Aditya Pillai",
        "specialization": "neurologist",
        "availability": ["Monday", "Wednesday", "Saturday"],
        "email": "adityapillai@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Sophia Nguyen",
        "specialization": "neurologist",
        "availability": ["Tuesday", "Thursday", "Friday"],
        "email": "sophianguyen@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Ritesh Kapoor",
        "specialization": "neurologist",
        "availability": ["Monday", "Thursday"],
        "email": "riteshkapoor@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Priyanka Desai",
        "specialization": "pulmonologist",
        "availability": ["Tuesday", "Thursday", "Saturday"],
        "email": "priyankadesai@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Nathan Scott",
        "specialization": "pulmonologist",
        "availability": ["Monday", "Wednesday", "Friday"],
        "email": "nathanscott@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Vivek Bansal",
        "specialization": "pulmonologist",
        "availability": ["Tuesday", "Wednesday", "Friday"],
        "email": "vivekbansal@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Aarushi Menon",
        "specialization": "ophthalmologist",
        "availability": ["Monday", "Tuesday", "Thursday"],
        "email": "aarushimenon@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Brandon Evans",
        "specialization": "ophthalmologist",
        "availability": ["Wednesday", "Friday"],
        "email": "brandonevans@example.com",
        "password": "password123"
      },
      {
        "name": "Dr. Devanshi Joshi",
        "specialization": "ophthalmologist",
        "availability": ["Thursday", "Saturday"],
        "email": "devanshijoshi@example.com",
        "password": "password123"
      }
  ];

  for (const doctor of doctors) {
    try {
      // Create doctor account in Firebase Authentication
      const user = await auth.createUser({
        email: doctor.email,
        password: doctor.password,
        displayName: doctor.name
      });

      // Add doctor details to Firestore
      await db.collection("doctors").doc(user.uid).set({
        name: doctor.name,
        specialization: doctor.specialization,
        availability: doctor.availability,
        email: doctor.email
      });

      console.log(`Added doctor: ${doctor.name}`);
    } catch (error) {
      console.error(`Error adding doctor ${doctor.name}:`, error.message);
    }
  }
}

addDoctors().catch(console.error);
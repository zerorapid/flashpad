// 🔼 Firebase Initialization FIRST
const firebaseConfig = {
  apiKey: "AIzaSyAOqXxXgSbTfVb91o5jvtiZz8UfWghNJPM",
  authDomain: "flashpad-a98e5.firebaseapp.com",
  projectId: "flashpad-a98e5",
  storageBucket: "flashpad-a98e5.firebasestorage.app",
  messagingSenderId: "326917682608",
  appId: "1:326917682608:web:1ee257d85a4e509b981275",
  measurementId: "G-ZG76M648BT"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Define "db" here

// Functions that use "db"
function saveNote() {
  const text = document.getElementById('editor').value;
  if (!text.trim()) {
    alert("Cannot save an empty note!");
    return;
  }

  db.collection("notes").add({
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById('editor').value = "";
    loadNotes();
  })
  .catch((error) => alert("Error saving note: " + error));
}

function loadNotes() { ... }
function deleteNote(noteId) { ... }

// Load notes on page load
window.onload = loadNotes;

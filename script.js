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

/ Define saveNote
function saveNote() {
  const text = document.getElementById('editor').value.trim();
  if (!text) {
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

// Attach saveNote to the button
document.getElementById('saveButton').addEventListener('click', saveNote);

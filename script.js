// Firebase Config (Replace with your details!)
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
const db = firebase.firestore();

// Save Note to Firestore
function saveNote() {
  const text = document.getElementById('editor').value;
  if (!text.trim()) {
    alert("Cannot save an empty note!");
    return;
  }

  // Add note to Firestore
  db.collection("notes").add({
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById('editor').value = ""; // Clear editor
    loadNotes(); // Refresh the list
  })
  .catch((error) => alert("Error saving note: " + error));
}

// Load Notes (Realtime Updates)
function loadNotes() {
  db.collection("notes")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = "";
      
      snapshot.forEach((doc) => {
        const note = doc.data();
        notesList.innerHTML += `
          <div class="card mb-3">
            <div class="card-body">
              <p class="card-text">${note.text}</p>
              <button class="btn btn-danger btn-sm" onclick="deleteNote('${doc.id}')">Delete</button>
            </div>
          </div>
        `;
      });
    });
}

// Delete Note
function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    db.collection("notes").doc(noteId).delete()
      .catch((error) => alert("Error deleting note: " + error));
  }
}

// Load notes when the page loads
window.onload = loadNotes;

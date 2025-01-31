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

/ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Save Note Function
function saveNote() {
  try {
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
      console.log("Note saved successfully!");
      document.getElementById('editor').value = "";
      loadNotes();
    })
    .catch((error) => {
      console.error("Error saving note:", error);
      alert("Error saving note. Check console for details.");
    });
  } catch (error) {
    console.error("Error in saveNote:", error);
  }
}

// Load Notes Function
function loadNotes() {
  db.collection("notes")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = "";
      
      snapshot.forEach((doc) => {
        const note = doc.data();
        notesList.innerHTML += `
          <div class="note-card">
            <p>${note.text}</p>
            <button class="btn btn-danger btn-sm" onclick="deleteNote('${doc.id}')">Delete</button>
          </div>
        `;
      });
    }, (error) => {
      console.error("Error loading notes:", error);
    });
}

// Delete Note Function
function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    db.collection("notes").doc(noteId).delete()
      .catch((error) => {
        console.error("Error deleting note:", error);
        alert("Error deleting note. Check console for details.");
      });
  }
}

// Initialize on Page Load
window.onload = () => {
  console.log("Flashpad initialized!");
  loadNotes();
};

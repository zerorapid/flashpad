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
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      // Save Note Function
      function saveNote() {
        const text = document.getElementById('editor').value.trim();
        if (!text) {
          alert("Cannot save an empty note!");
          return;
        }

        addDoc(collection(db, "notes"), {
          text: text,
          timestamp: serverTimestamp()
        })
        .then(() => {
          document.getElementById('editor').value = "";
          loadNotes();
        })
        .catch((error) => alert("Error saving note: " + error));
      }

      // Attach Save Button Listener
      document.getElementById('saveButton').addEventListener('click', saveNote);

      // Load Notes Function
      function loadNotes() {
        onSnapshot(collection(db, "notes"), (snapshot) => {
          const notesList = document.getElementById('notesList');
          notesList.innerHTML = "";
          
          snapshot.forEach((doc) => {
            const note = doc.data();
            const noteElement = document.createElement('div');
            noteElement.className = 'note-card';
            noteElement.innerHTML = `
              <p>${note.text}</p>
              <button class="btn btn-danger btn-sm deleteButton" data-id="${doc.id}">Delete</button>
            `;
            notesList.appendChild(noteElement);
          });

          // Attach delete handlers
          document.querySelectorAll('.deleteButton').forEach(button => {
            button.addEventListener('click', () => deleteNote(button.dataset.id));
          });
        });
      }

      // Delete Note Function
      function deleteNote(noteId) {
        if (confirm("Are you sure you want to delete this note?")) {
          deleteDoc(doc(db, "notes", noteId))
            .catch((error) => alert("Error deleting note: " + error));
        }
      }

      // Initialize on Page Load
      window.onload = loadNotes;

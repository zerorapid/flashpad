import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot,
    deleteDoc,
    doc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your web app's Firebase configuration
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
const notesCollection = collection(db, "notes");

// DOM Elements
const editor = document.getElementById('editor');
const saveBtn = document.getElementById('saveBtn');
const notesList = document.getElementById('notesList');
const toastEl = document.getElementById('statusToast');
const toast = new bootstrap.Toast(toastEl);

// Save Note Function
saveBtn.addEventListener('click', async () => {
    const content = editor.value.trim();
    
    if (!content) {
        alert("Please write something before saving!");
        return;
    }

    try {
        await addDoc(notesCollection, {
            content,
            createdAt: serverTimestamp()
        });
        
        editor.value = "";
        toast.show();
        setTimeout(() => toast.hide(), 2000);
        
    } catch (error) {
        console.error("Error saving note:", error);
        alert("Error saving note! Check console for details.");
    }
});

// Real-time Notes Listener
onSnapshot(notesCollection, (snapshot) => {
    notesList.innerHTML = "";
    
    snapshot.docs.forEach(doc => {
        const note = doc.data();
        const noteEl = document.createElement('div');
        noteEl.className = "col-md-4 mb-3";
        noteEl.innerHTML = `
            <div class="note-card p-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted">${new Date(note.createdAt?.toDate()).toLocaleString()}</small>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${doc.id}">
                        🗑️
                    </button>
                </div>
                <p class="mb-0">${note.content}</p>
            </div>
        `;
        
        notesList.appendChild(noteEl);
    });

    // Add delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to delete this note?")) {
                try {
                    await deleteDoc(doc(db, "notes", btn.dataset.id));
                } catch (error) {
                    console.error("Error deleting note:", error);
                }
            }
        });
    });
});

// Initialize Editor Focus
window.addEventListener('load', () => {
    editor.focus();
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, 
    deleteDoc, doc, serverTimestamp, query, orderBy 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { 
    getAuth, signInWithPopup, GoogleAuthProvider, 
    signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOqXxXgSbTfVb91o5jvtiZz8UfWghNJPM",
  authDomain: "flashpad-a98e5.firebaseapp.com",
  projectId: "flashpad-a98e5",
  storageBucket: "flashpad-a98e5.firebasestorage.app",
  messagingSenderId: "326917682608",
  appId: "1:326917682608:web:1ee257d85a4e509b981275",
  measurementId: "G-ZG76M648BT"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Rich Text Editor Configuration
const quill = new Quill('#editor', {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    },
    theme: 'snow'
});

// UI Elements
const authButton = document.getElementById('authButton');
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');
const notesList = document.getElementById('notesList');
const toast = new bootstrap.Toast(document.getElementById('statusToast'));

// Enhanced Save Function
saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('noteTitle').value.trim();
    const content = quill.root.innerHTML;
    
    if (!title || !content) {
        showToast('Please enter both title and content!', 'danger');
        return;
    }

    try {
        await addDoc(collection(db, 'notes'), {
            title,
            content,
            createdAt: serverTimestamp(),
            userId: auth.currentUser?.uid || 'anonymous'
        });
        
        quill.setText('');
        document.getElementById('noteTitle').value = '';
        showToast('Note saved successfully!', 'success');
    } catch (error) {
        console.error('Save error:', error);
        showToast('Error saving note!', 'danger');
    }
});

// Real-time Notes Listener
const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snapshot) => {
    notesList.innerHTML = '';
    
    snapshot.forEach(doc => {
        const note = doc.data();
        const noteEl = document.createElement('div');
        noteEl.className = 'col-md-4 mb-3';
        noteEl.innerHTML = `
            <div class="note-card p-3">
                <h5>${note.title}</h5>
                <div class="text-muted small mb-2">
                    ${new Date(note.createdAt?.toDate()).toLocaleString()}
                </div>
                <div class="content-preview">${note.content.substring(0, 100)}...</div>
                <button class="btn btn-danger btn-sm mt-2 delete-btn" data-id="${doc.id}">
                    Delete
                </button>
            </div>
        `;
        notesList.appendChild(noteEl);
    });

    // Delete Handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Delete this note permanently?')) {
                try {
                    await deleteDoc(doc(db, 'notes', btn.dataset.id));
                    showToast('Note deleted!', 'info');
                } catch (error) {
                    console.error('Delete error:', error);
                    showToast('Error deleting note!', 'danger');
                }
            }
        });
    });
});

// Auth Management
authButton.addEventListener('click', () => {
    if (auth.currentUser) {
        signOut(auth);
    } else {
        signInWithPopup(auth, provider);
    }
});

onAuthStateChanged(auth, (user) => {
    authButton.textContent = user ? 'Logout' : 'Login';
    if (user) showToast(`Welcome ${user.displayName}!`, 'success');
});

// Export Functionality
exportBtn.addEventListener('click', () => {
    const title = document.getElementById('noteTitle').value || 'Untitled';
    const content = quill.getText();
    
    const pdf = new jsPDF();
    pdf.text(20, 20, title);
    pdf.text(20, 30, content);
    pdf.save(`${title}.pdf`);
});

// Helper Functions
function showToast(message, type = 'info') {
    const toastBody = document.querySelector('.toast-body');
    toastBody.textContent = message;
    document.getElementById('statusToast').classList.remove('bg-primary', 'bg-success', 'bg-danger');
    document.getElementById('statusToast').classList.add(`bg-${type}`);
    toast.show();
}

// Initialize Editor
quill.focus();

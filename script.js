document.addEventListener('DOMContentLoaded', () => {
    try {
        // DOM Elements
        const elements = {
            notepad: document.getElementById('notepad'),
            charCount: document.getElementById('charCount'),
            wordCount: document.getElementById('wordCount'),
            deleteBtn: document.getElementById('deleteBtn'),
            fontOptions: document.querySelectorAll('.font-option')
        };

        // Initialize First Font
        const initializeFirstFont = () => {
            elements.fontOptions.forEach(btn => btn.classList.remove('active'));
            elements.fontOptions[0].classList.add('active');
            elements.notepad.style.fontFamily = elements.fontOptions[0].dataset.font;
        };

        // Font Selection Handler
        const handleFontSelection = (event) => {
            elements.fontOptions.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            elements.notepad.style.fontFamily = event.target.dataset.font;
        };

        // Update Counts
        const updateCounts = () => {
            const text = elements.notepad.value.trim();
            elements.charCount.textContent = text.length;
            elements.wordCount.textContent = text === '' ? 0 : text.split(/\s+/).filter(word => word.length > 0).length;
        };

        // Clear Content
        const clearContent = () => {
            elements.notepad.value = '';
            updateCounts();
            elements.notepad.focus();
        };

        // Event Listeners
        elements.fontOptions.forEach(btn => {
            btn.addEventListener('click', handleFontSelection);
        });

        elements.notepad.addEventListener('input', updateCounts);
        elements.deleteBtn.addEventListener('click', clearContent);

        // Initial Setup
        initializeFirstFont();
        updateCounts();

    } catch (error) {
        console.error('Initialization error:', error);
        alert('Application failed to initialize. Please refresh the page.');
    }
});

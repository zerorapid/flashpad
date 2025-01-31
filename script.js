document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const notepad = document.getElementById('notepad');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const deleteBtn = document.getElementById('deleteBtn');
    const fontOptions = document.querySelectorAll('.font-option');

    // Initialize first font
    const initializeFirstFont = () => {
        fontOptions[0].classList.add('active');
        notepad.style.fontFamily = fontOptions[0].dataset.font;
    };

    // Font selection handler
    const handleFontSelection = (event) => {
        fontOptions.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        notepad.style.fontFamily = event.target.dataset.font;
    };

    // Update counts function
    const updateCounts = () => {
        const text = notepad.value.trim();
        charCount.textContent = text.length;
        wordCount.textContent = text === '' ? 0 : text.split(/\s+/).length;
    };

    // Clear button handler
    const handleClear = () => {
        notepad.value = '';
        updateCounts();
        notepad.focus();
    };

    // Event listeners
    fontOptions.forEach(btn => {
        btn.addEventListener('click', handleFontSelection);
    });
    
    notepad.addEventListener('input', updateCounts);
    deleteBtn.addEventListener('click', handleClear);
    
    // Initial setup
    initializeFirstFont();
    updateCounts();
});

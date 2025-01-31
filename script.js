// your code goes here
document.addEventListener('DOMContentLoaded', () => {
    const notepad = document.getElementById('notepad');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const deleteBtn = document.getElementById('deleteBtn');
    const fontOptions = document.querySelectorAll('.font-option');

    const updateCounts = () => {
        const text = notepad.value.trim();
        charCount.textContent = text.length;
        wordCount.textContent = text === '' ? 0 : text.split(/\s+/).length;
    };

    // Font selection handler
    fontOptions.forEach(option => {
        option.addEventListener('click', () => {
            notepad.style.fontFamily = option.dataset.font;
            fontOptions.forEach(btn => btn.style.borderColor = '#bdc3c7');
            option.style.borderColor = '#3498db';
        });
    });

    // Text input handler
    notepad.addEventListener('input', updateCounts);

    // Clear button handler
    deleteBtn.addEventListener('click', () => {
        notepad.value = '';
        charCount.textContent = '0';
        wordCount.textContent = '0';
    });
});

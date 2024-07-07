function OpenWonder() {
    const popup = document.getElementById('WonderPopup');
    const overlay = document.getElementById('Wonderoverlay');

    if (popup.style.display === 'none') {
        // Show the pop-up
        popup.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        // Hide the pop-up
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }
}

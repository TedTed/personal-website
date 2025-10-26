document.addEventListener('keydown', function(e) {
    alert("Keycode : " + e.keyCode + ", touche pressée : " + String.fromCharCode(e.keyCode).toLowerCase());
}, false);

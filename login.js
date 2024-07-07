function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'TestAccount' && password === 'Anolet12345') {

        document.getElementById('error-message').innerText = '';
        localStorage.setItem('username', username);
        window.location.href = 'stats.html';
    } else {
        document.getElementById('error-message').innerText = 'Invalid username or password';
    }
}
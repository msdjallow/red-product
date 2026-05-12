const API_URL = "http://127.0.0.1:5000/api";

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
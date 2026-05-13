// Cette variable sera utilisée par TOUS les autres fichiers JS
const API_URL = "https://red-product-backend-jyol.onrender.com/api";

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
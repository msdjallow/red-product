// Remplaçons http://127.0.0.1:5000/api par le lien Render
const API_URL = "https://red-product-backend-jyol.onrender.com/api";
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
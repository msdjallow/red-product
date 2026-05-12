// On sélectionne le formulaire par son ID
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche la page de se recharger
        console.log("Tentative d'inscription...");

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Inscription réussie !");
                window.location.href = 'index.html'; // Redirige vers la connexion
            } else {
                alert(data.message || "Erreur lors de l'inscription");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Impossible de joindre le serveur. Vérifie qu'il est allumé sur le port 5000.");
        }
    });
} else {
    console.error("Le formulaire #register-form n'a pas été trouvé dans le HTML");
}
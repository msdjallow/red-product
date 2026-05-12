// On récupère le formulaire de connexion
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // On récupère les valeurs des champs de TA maquette
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("Tentative de connexion pour :", email);

        try {
            // On utilise API_URL qui vient de config.js
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Si ça marche, on stocke le TOKEN et les INFOS USER
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert("Connexion réussie !");
                window.location.href = 'dashboard.html'; // Vers ta liste d'hôtels
            } else {
                // C'est ici que tu reçois "Identifiants invalides" si l'email n'est pas en base
                alert(data.message || "Erreur de connexion");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Le serveur ne répond pas. Vérifie qu'il est lancé sur le port 5000.");
        }
    });
}
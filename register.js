document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inscription réussie ! Connectez-vous.");
            window.location.href = 'index.html';
        } else {
            alert(data.message || "Erreur lors de l'inscription");
        }
    } catch (err) {
        console.error("Erreur inscription:", err);
        alert("Impossible de contacter le serveur distant.");
    }
});
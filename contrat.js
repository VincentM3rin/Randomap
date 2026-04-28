document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById("contactForm");

    async function handleSubmit(event) {
        event.preventDefault();
        const btn = document.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Envoi en cours...';

        const data = new FormData(event.target);

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.textContent = 'Message envoyé !';
                alert("Votre message a bien été envoyé !");
                form.reset();
            } else {
                btn.textContent = 'Erreur';
                alert("Oups! Il y a eu un problème lors de l'envoi de votre formulaire.");
            }
        } catch (error) {
            btn.textContent = 'Erreur';
            alert("Oups! Il y a eu un problème lors de l'envoi de votre formulaire.");
        }

        setTimeout(() => {
            btn.textContent = originalText;
        }, 3000);
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    const navConnexion = document.getElementById('nav-connexion');
    const navProfil = document.getElementById('nav-profil');
    const btnLogout = document.getElementById('btn-logout');

    const estConnecte = localStorage.getItem('estConnecte') === 'true';

    if (estConnecte) {
        if (navConnexion) navConnexion.style.display = 'none';
        if (navProfil) navProfil.style.display = 'inline-block';
        if (btnLogout) btnLogout.style.display = 'inline-block';
    } else {
        if (navConnexion) navConnexion.style.display = 'inline-block';
        if (navProfil) navProfil.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); 
            localStorage.removeItem('estConnecte');
            localStorage.removeItem('nomUtilisateur');
            window.location.href = 'index.html'; 
        });
    }
});
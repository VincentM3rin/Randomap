document.addEventListener('DOMContentLoaded', () => {
    
    const utilisateurConnecte = localStorage.getItem('estConnecte');

    if (!utilisateurConnecte) {
        window.location.href = 'connexion.html';
    } else {
        const nom = localStorage.getItem('nomUtilisateur');
    }

    const btnDeconnexion = document.getElementById('btn-logout');

    if (btnDeconnexion) {
        btnDeconnexion.addEventListener('click', () => {
            localStorage.removeItem('estConnecte');
            localStorage.removeItem('nomUtilisateur');
            window.location.href = 'connexion.html';
        });
    }
});
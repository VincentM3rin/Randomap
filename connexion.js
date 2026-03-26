document.addEventListener('DOMContentLoaded', () => {
    
    const btnRegister = document.getElementById('btn-register');
    const btnLogin = document.getElementById('btn-login');
    const authMessage = document.getElementById('auth-message'); 

    async function gererAuthentification(typeAction) {
        const nomUserInput = document.getElementById('nomUser').value;
        const mdpUserInput = document.getElementById('mdpUser').value;

        if (!nomUserInput || !mdpUserInput) {
            authMessage.textContent = "Veuillez remplir tous les champs.";
            authMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch('http://localhost/Randomap/inscription.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nomUser: nomUserInput,
                    mdpUser: mdpUserInput,
                    action: typeAction 
                })
            });

            const data = await response.json();

            if (data.success) {
                if (typeAction === 'login') {
                    window.location.href = 'profil.html';
                } else {
                    authMessage.textContent = data.message;
                    authMessage.style.color = "green";
                    document.getElementById('login-form').reset();
                }
            } else {
                authMessage.textContent = data.message;
                authMessage.style.color = "red";
            }
        } catch (error) {
            console.error('Erreur:', error);
            authMessage.textContent = "Erreur de communication avec le serveur.";
            authMessage.style.color = "red";
        }
    }

    if (btnRegister) {
        btnRegister.addEventListener('click', () => gererAuthentification('register'));
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', () => gererAuthentification('login'));
    }
});
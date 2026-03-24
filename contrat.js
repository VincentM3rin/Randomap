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

form.addEventListener("submit", handleSubmit);
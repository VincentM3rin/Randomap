const ADMIN_API_BASE = 'http://localhost/Randomap/adminCarte.php';

const authConnecte = localStorage.getItem('estConnecte') === 'true';
const authIdUser = localStorage.getItem('idUser');

const sectionAdmin = document.getElementById('section-admin');
const formRando = document.getElementById('formRando');

if (authConnecte && sectionAdmin) {
    sectionAdmin.style.display = 'block';
}

if (formRando) {
    formRando.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('rando-id').value;
        const action = id ? 'edit' : 'add';
        const fileInput = document.getElementById('photoFile');

        const formData = new FormData();
        formData.append('action', action);
        formData.append('idUser', authIdUser || 0);
        formData.append('nomRandonné', document.getElementById('nom_parcours').value);
        formData.append('villeRandonné', document.getElementById('ville_depart').value);
        formData.append('nombreKilomètres', document.getElementById('km').value);
        formData.append('villeArrivee', document.getElementById('ville_arrivee').value);
        formData.append('idTypeLieu', document.getElementById('idTypeLieu').value);
        formData.append('idDiff', document.getElementById('idDiff').value);

        if (id) {
            formData.append('id', id);
        }

        if (fileInput.files.length > 0) {
            formData.append('photoRandonné', fileInput.files[0]);
        } else if (action === 'add') {
            alert("Veuillez sélectionner une image.");
            return;
        }

        fetch(ADMIN_API_BASE, {
            method: 'POST',
            body: formData 
        }).then(res => res.json()).then(data => {
            if(data.success) {
                formRando.reset();
                document.getElementById('rando-id').value = '';
                document.getElementById('btn-submit').innerText = "Envoyer";
                alert("Parcours enregistré avec succès !");
            } else {
                alert("Erreur lors de l'opération : " + (data.error || "Inconnue"));
            }
        }).catch(err => {
            console.error(err);
            alert("Une erreur s'est produite avec le serveur.");
        });
    });
}
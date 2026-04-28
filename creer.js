const ADMIN_API_BASE = 'http://localhost/Randomap/adminCarte.php';

const authConnecte = localStorage.getItem('estConnecte') === 'true';
const authIdUser = localStorage.getItem('idUser');

const sectionAdmin = document.getElementById('section-admin');
const formActu = document.getElementById('form-actu');
const conteneurActus = document.getElementById('conteneur-toutes-actualites');

const fileInput = document.getElementById('photoFile');

if (fileInput.files.length > 0) {
    formData.append('photoFile', fileInput.files[0]);
}

if (authConnecte && sectionAdmin) {
    sectionAdmin.style.display = 'block';
}

if (formActu) {
    formActu.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('actu-id').value;
        const action = id ? 'edit' : 'add';
        const fileInput = document.getElementById('actu-photo');

        const formData = new FormData();
        formData.append('action', action);
        formData.append('idUser', authIdUser);
        formData.append('titre', document.getElementById('actu-titre').value);
        formData.append('description', document.getElementById('actu-desc').value);

        if (id) {
            formData.append('id', id);
        }

        if (fileInput.files.length > 0) {
            formData.append('photo', fileInput.files[0]);
        } else if (action === 'add') {
            alert("Veuillez sélectionner une image.");
            return;
        }

        fetch(API_ACTU, {
            method: 'POST',
            body: formData 
        }).then(res => res.json()).then(data => {
            if(data.success) {
                formActu.reset();
                document.getElementById('actu-id').value = '';
                document.getElementById('btn-submit').innerText = "Ajouter l'actualité";
                chargerToutesActualites();
            } else {
                alert("Erreur lors de l'opération : " + (data.error || "Inconnue"));
            }
        }).catch(err => {
            console.error(err);
            alert("Une erreur s'est produite avec le serveur.");
        });
    });
}

window.supprimerActu = function(id) {
    if(confirm("Confirmer la suppression ? L'image sera également effacée du serveur.")) {
        fetch(API_ACTU, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: id })
        }).then(() => chargerToutesActualites());
    }
}

window.editerActu = function(id, titre, desc) {
    document.getElementById('actu-id').value = id;
    document.getElementById('actu-titre').value = titre;
    document.getElementById('actu-desc').value = desc;
    document.getElementById('btn-submit').innerText = "Enregistrer la modification";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

chargerToutesActualites();

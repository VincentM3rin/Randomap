const radioAB = document.getElementById('radioAB');
const radioBoucle = document.getElementById('radioBoucle');
const divArrivee = document.getElementById('div_arrivee');
const inputArrivee = document.getElementById('ville_arrivee');

radioAB.addEventListener('change', () => {
    divArrivee.classList.remove('hidden');
    inputArrivee.required = true;
});

radioBoucle.addEventListener('change', () => {
    divArrivee.classList.add('hidden');
    inputArrivee.required = false;
});

document.getElementById('formRando').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ville_depart', document.getElementById('ville_depart').value);
    formData.append('km', document.getElementById('km').value);
    formData.append('type', document.querySelector('input[name="type"]:checked').value);
    
    if (!divArrivee.classList.contains('hidden')) {
        formData.append('ville_arrivee', inputArrivee.value);
    }
    
    const photoInput = document.getElementById('photo');
    if (photoInput.files.length > 0) {
        formData.append('photo', photoInput.files[0]);
    }

    try {
        const response = await fetch('ajouter.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = 'carte.html';
        }
    } catch (error) {
        console.error(error);
    }
});
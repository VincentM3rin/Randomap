function getData() {
    const idUser = localStorage.getItem('token_idUser');
    
    if (!idUser) {
        alert("Vous devez être connecté pour voir vos randonnées.");
        return;
    }
    
    fetch(`http://localhost/Randomap/listeRando.php?idUser=${idUser}`)
        .then(res => res.json())
        .then(dataUser => {
            let list = document.getElementById("remplir");
            list.innerHTML = "";
            
            dataUser.forEach(randonne => {
                let node = document.createElement('tr');
                let p1 = document.createElement('td');
                let p2 = document.createElement('td');
                let p3 = document.createElement('td');
                let p4 = document.createElement('td');
                let p5 = document.createElement('td');
                let p6 = document.createElement('td');
                
                p1.textContent = randonne.nomRandonné;
                p2.textContent = randonne.villeRandonné;
                
                let img = document.createElement('img');
                img.src = "http://localhost/Randomap/uploads/" + randonne.photoRandonné;
                
                
                p3.appendChild(img);
                
                p4.textContent = randonne.libelTypeLieu;
                p5.textContent = randonne.LibelDiff;
                p6.textContent = randonne.nombreKilomètres + " km"; 
                                 
                node.appendChild(p1);
                node.appendChild(p2);
                node.appendChild(p3);
                node.appendChild(p4);
                node.appendChild(p5);
                node.appendChild(p6);
                list.appendChild(node);
            });
        })
        .catch(err => console.error(err));
}

function supprimerGare(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette ville ?")) return;
    
    fetch('http://localhost/Randomap/supprimer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({CODE_UIC: id})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            getData();
        }
    })
    .catch(err => console.error(err));
}
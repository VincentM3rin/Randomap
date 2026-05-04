function getData() {
    fetch('http://localhost/Randomap/listeRando.php')
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

                p1.textContent = randonne.nomRandonné;
                p2.textContent = randonne.villeRandonné;
                p3.textContent = randonne.photoRandonné;
                p4.textContent = randonne.nombreKilomètres;

                let btnModifier = document.createElement('button');
                btnModifier.addEventListener("click", () => {

                    sessionStorage.setItem("nomRandonné", randonne.nomRandonné);
                    sessionStorage.setItem("villeRandonné", randonne.villeRandonné);
                    sessionStorage.setItem("photoRandonné", randonne.photoRandonné);
                    sessionStorage.setItem("nombreKilomètres", randonne.nombreKilomètres);
                })

                node.appendChild(p1);
                node.appendChild(p2);
                node.appendChild(p3);
                node.appendChild(p4);

                list.appendChild(node);
            });
        })
        .catch(err => console.error("Erreur lors du chargement :", err));
}

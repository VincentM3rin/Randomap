<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once 'BDD.php';

$liste = [];

if(isset($_GET['idUser'])) {
    $idUser = $_GET['idUser'];
    
    $requete = $liaison->prepare("SELECT nomRandonné, villeRandonné, photoRandonné, nombreKilomètres FROM randonne WHERE idUser = $idUser");
    $requete->execute([$idUser]);
    $resultats = $requete->fetchAll(PDO::FETCH_ASSOC);

    foreach ($resultats as $idrequete) {
        array_push($liste, $idrequete);
    }
}

echo json_encode($liste);
?>
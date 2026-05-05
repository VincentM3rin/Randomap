<?php
 
include_once 'BDD.php';

$requete = $liaison->query("SELECT libelTypeLieu FROM typelieurandonne");

foreach ($requete as $idrequete) {
    array_push($liste, $idrequete);
}

echo json_encode($liste);

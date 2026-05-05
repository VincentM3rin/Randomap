<?php
header("Access-Control-Allow-Origin: *");
$liaison = new mysqli("localhost", "root", "", "randomap");
$liste = array();


if ($liaison->connect_error) {
    die(json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]));
}

?>
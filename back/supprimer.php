<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once 'BDD.php';

if ($liaison->connect_error) {
    die(json_encode(["success" => false, "message" => "Erreur de connexion à la base."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data["idRandonné"]);

if (!empty($id)) {
    $requete = "DELETE FROM randonne WHERE idRandonné = $id";
    if ($liaison->query($requete)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
} else {
    echo json_encode(["success" => false]);
}

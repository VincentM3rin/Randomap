<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include_once 'bdd.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = isset($data["nomUser"]) ? $liaison->real_escape_string(trim($data["nomUser"])) : '';
$password = isset($data["mdpUser"]) ? trim($data["mdpUser"]) : '';
$action = isset($data["action"]) ? $data["action"] : 'register';

if (!empty($username) && !empty($password)) {
    if ($action === 'login') {
        $requete = "SELECT idUser, mdpUser FROM utilisateurs WHERE nomUser = '$username'";
        $resultat = $liaison->query($requete);
        
        if ($resultat && $resultat->num_rows > 0) {
            $row = $resultat->fetch_assoc();
            $db_pass = $row['mdpUser'];
            
            if (password_verify($password, $db_pass) || $password === $db_pass) {
                echo json_encode(["success" => true, "message" => "Connexion réussie.", "idUser" => $row['idUser']]);
            } else {
                echo json_encode(["success" => false, "message" => "Mot de passe incorrect."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Utilisateur non trouvé."]);
        }
    } else {
        $checkRequete = "SELECT idUser FROM utilisateurs WHERE nomUser = '$username'";
        $resultat = $liaison->query($checkRequete);
        
        if ($resultat && $resultat->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Nom d'utilisateur déjà pris."]);
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $insertRequete = "INSERT INTO utilisateurs (nomUser, mdpUser) VALUES ('$username', '$hashed_password')";
            
            if ($liaison->query($insertRequete)) {
                echo json_encode(["success" => true, "message" => "Compte créé avec succès !"]);
            } else {
                echo json_encode(["success" => false, "message" => "Erreur lors de la création : " . $liaison->error]);
            }
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs."]);
}

$liaison->close();
?>
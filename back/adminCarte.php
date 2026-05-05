<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once 'bdd.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' || (isset($_GET['action']) && $_GET['action'] === 'get')) {
    
    if (isset($_GET['action'])) {
        if ($_GET['action'] === 'getTypes') {
            $query = "SELECT idTypeLieu, libelTypeLieu FROM typelieurandonne";
            $result = $liaison->query($query);
            $types = [];
            if ($result) {
                while($row = $result->fetch_assoc()) {
                    $types[] = $row;
                }
            }
            echo json_encode($types);
            exit;
        }
        
        if ($_GET['action'] === 'getDiffs') {
            $query = "SELECT idDiff, libelDiff FROM difficulte";
            $result = $liaison->query($query);
            $diffs = [];
            if ($result) {
                while($row = $result->fetch_assoc()) {
                    $diffs[] = $row;
                }
            }
            echo json_encode($diffs);
            exit;
        }
    }

    $limitClause = "";
    $whereClause = "";
    
    if (isset($_GET['idRandonne'])) {
        $id = intval($_GET['idRandonne']);
        $whereClause = "WHERE idRandonne = $id";
    }
    
    if (isset($_GET['limit'])) {
        $limit = intval($_GET['limit']);
        $limitClause = "LIMIT $limit";
    }
    
    $query = "SELECT * FROM randonne $whereClause $limitClause";
    $result = $liaison->query($query);
    
    $actualites = [];
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $actualites[] = $row;
        }
    }
    echo json_encode($actualites);

} elseif ($method === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if (empty($action)) {
        $data = json_decode(file_get_contents("php://input"), true);
        $action = $data['action'] ?? '';
    }

    if ($action === 'add' || $action === 'edit') {
        
        $nomRandonne = $liaison->real_escape_string($_POST['nomRandonne'] ?? '');
        $villeRandonne = $liaison->real_escape_string($_POST['villeRandonne'] ?? '');
        $nombreKilometres = floatval($_POST['nombreKilometres'] ?? 0);
        $idUser = intval($_POST['idUser'] ?? 0);
        
        $idTypeLieu = intval($_POST['idTypeLieu'] ?? 1);
        $idDiff = intval($_POST['idDiff'] ?? 1);
        $longRandoDepart = isset($_POST['longRandoDepart']) ? floatval($_POST['longRandoDepart']) : 0;
        $latRandoDepart = isset($_POST['latRandoDepart']) ? floatval($_POST['latRandoDepart']) : 0;
        $longRandoArrive = isset($_POST['longRandoArrive']) ? floatval($_POST['longRandoArrive']) : 0;
        $latRandoArrive = isset($_POST['latRandoArrive']) ? floatval($_POST['latRandoArrive']) : 0;
        
        $photoRandonne = "";
        
        if (isset($_FILES['photoRandonne']) && $_FILES['photoRandonne']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $fileExtension = pathinfo($_FILES['photoRandonne']['name'], PATHINFO_EXTENSION);
            $fileName = uniqid() . '.' . $fileExtension;
            $targetFilePath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['photoRandonne']['tmp_name'], $targetFilePath)) {
                $photoRandonne = $targetFilePath;
            } else {
                echo json_encode(["success" => false, "error" => "Erreur lors de la sauvegarde de l'image."]);
                exit;
            }
        }

        if ($action === 'add') {
            if ($photoRandonne === "") {
                echo json_encode(["success" => false, "error" => "Une image est requise."]);
                exit;
            }
            $query = "INSERT INTO randonne (nomRandonné, villeRandonné, photoRandonné, nombreKilomètres, longRandoDepart, latRandoDepart, longRandoArrivé, latRandoArrivé, idTypeLieu, idDiff, idUser) 
                      VALUES ('$nomRandonne', '$villeRandonne', '$photoRandonne', $nombreKilometres, $longRandoDepart, $latRandoDepart, $longRandoArrive, $latRandoArrive, $idTypeLieu, $idDiff, $idUser)";
        } else {
            $id = intval($_POST['id']);
            
            if ($photoRandonne !== "") {
                $querySel = "SELECT photoRandonné FROM randonne WHERE idRandonne=$id";
                $res = $liaison->query($querySel);
                if ($row = $res->fetch_assoc()) {
                    if (!empty($row['photoRandonné']) && file_exists($row['photoRandonné'])) {
                        unlink($row['photoRandonné']);
                    }
                }
                $query = "UPDATE randonne SET nomRandonné='$nomRandonne', villeRandonné='$villeRandonne', photoRandonné='$photoRandonne', nombreKilomètres=$nombreKilometres, idTypeLieu=$idTypeLieu, idDiff=$idDiff, longRandoDepart=$longRandoDepart, latRandoDepart=$latRandoDepart, longRandoArrivé=$longRandoArrive, latRandoArrivé=$latRandoArrive WHERE idRandonne=$id";
            } else {
                $query = "UPDATE randonne SET nomRandonné='$nomRandonne', villeRandonné='$villeRandonne', nombreKilomètres=$nombreKilometres, idTypeLieu=$idTypeLieu, idDiff=$idDiff, longRandoDepart=$longRandoDepart, latRandoDepart=$latRandoDepart, longRandoArrivé=$longRandoArrive, latRandoArrivé=$latRandoArrive WHERE idRandonne=$id";
            }
        }

        if ($liaison->query($query)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $liaison->error]);
        }
    }
    elseif ($action === 'delete') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = intval($data['id'] ?? 0);
        
        $querySel = "SELECT photoRandonné FROM randonne WHERE idRandonne=$id";
        $res = $liaison->query($querySel);
        if ($row = $res->fetch_assoc()) {
            if (!empty($row['photoRandonné']) && file_exists($row['photoRandonné'])) {
                unlink($row['photoRandonné']);
            }
        }
        
        $query = "DELETE FROM randonne WHERE idRandonne=$id";
        
        if ($liaison->query($query)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $liaison->error]);
        }
    }
}

$liaison->close();
?>
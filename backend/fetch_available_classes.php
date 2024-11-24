<?php
session_start();
include 'includes/db.php'; 

if ($_SESSION['role'] !== 'student') {
    http_response_code(403); 
    echo json_encode(["error" => "You do not have permission to access this page."]);
    exit;
}
try {
    $query = $pdo->prepare("SELECT * FROM class");  
    $query->execute();
    $classes = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($classes) {
        echo json_encode($classes);  
    } else {
        echo json_encode(["error" => "No available classes found."]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "No available classes found." . $e->getMessage()]);
}
?>

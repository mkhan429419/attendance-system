<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    exit;
}

$teacherId = $_SESSION['user_id'];
$query = $pdo->prepare("SELECT * FROM class WHERE teacherid = ?");
$query->execute([$teacherId]);
$classes = $query->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($classes);
?>

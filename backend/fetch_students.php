<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    exit;
}

$classId = $_GET['classid'];
$query = $pdo->prepare("
    SELECT u.id, u.fullname 
    FROM user u 
    JOIN attendance a ON u.id = a.studentid 
    WHERE a.classid = ?
");
$query->execute([$classId]);
$students = $query->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($students);
?>

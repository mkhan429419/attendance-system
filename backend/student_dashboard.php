<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'student') {
    http_response_code(403);
    exit;
}

$studentId = $_SESSION['user_id'];
$query = $pdo->prepare("
    SELECT a.date, a.isPresent, c.classname 
    FROM attendance a 
    JOIN class c ON a.classid = c.id 
    WHERE a.studentid = ?
");
$query->execute([$studentId]);
$attendanceRecords = $query->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($attendanceRecords);
?>

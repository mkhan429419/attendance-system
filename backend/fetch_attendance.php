<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    exit;
}

$classId = $_GET['classid'];
$query = $pdo->prepare("
    SELECT a.date, a.isPresent, u.fullname 
    FROM attendance a 
    JOIN user u ON a.studentid = u.id 
    WHERE a.classid = ?
");
$query->execute([$classId]);
$attendanceRecords = $query->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($attendanceRecords);
?>

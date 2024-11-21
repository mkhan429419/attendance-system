<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$classId = $data['classid'];
$studentId = $data['studentid'];
$isPresent = $data['isPresent'];
$date = $data['date'];

$query = $pdo->prepare("
    INSERT INTO attendance (classid, studentid, isPresent, date)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE isPresent = VALUES(isPresent)
");
$query->execute([$classId, $studentId, $isPresent, $date]);

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Attendance marked successfully']);
?>

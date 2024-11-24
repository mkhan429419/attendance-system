<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

$studentId = $data['studentId'];
$date = $data['date'];
$isPresent = $data['isPresent'];
$classId = $data['classId'];  

$query = $pdo->prepare("
    INSERT INTO attendance (studentid, classid, date, isPresent)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE isPresent = ?
");
$query->execute([$studentId, $classId, $date, $isPresent, $isPresent]);

header('Content-Type: application/json');
echo json_encode(["success" => true]);

?>

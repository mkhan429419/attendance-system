<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    exit;
}

$classId = $_GET['classid'];

$query = $pdo->prepare("
    SELECT COUNT(*) as count FROM attendance WHERE classid = ?
");
$query->execute([$classId]);
$attendanceCount = $query->fetch(PDO::FETCH_ASSOC)['count'];

if ($attendanceCount > 0) {
    $query = $pdo->prepare("
        SELECT a.date, a.isPresent,a.studentid, u.fullname 
        FROM attendance a 
        JOIN user u ON a.studentid = u.id 
        WHERE a.classid = ?
    ");
    $query->execute([$classId]);
    $attendanceRecords = $query->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode(['status' => 'attendance', 'data' => $attendanceRecords]);
} else {
    $query = $pdo->prepare("
        SELECT u.id, u.fullname 
        FROM user u 
        JOIN class_student cs ON u.id = cs.studentid 
        WHERE cs.classid = ?
    ");
    $query->execute([$classId]);
    $students = $query->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'students', 'data' => $students]);
}
?>

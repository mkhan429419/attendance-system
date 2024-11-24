<?php
session_start();
include 'includes/db.php';

if ($_SESSION['role'] !== 'student' && $_SESSION['role'] !== 'teacher') {
    http_response_code(403); 
    echo json_encode(["error" => "You do not have permission to access this page."]);
    exit;
}
$studentId = $_SESSION['user_id']; 
if (!isset($studentId)) {
    echo json_encode(["error" => "Student ID is not set in session."]);
    exit;
}
try {
    $query = $pdo->prepare("
        SELECT c.id AS class_id, c.classname, c.starttime, c.endtime, 
               a.isPresent, a.date
        FROM class c
        JOIN class_student cs ON c.id = cs.classid  -- Join with the class_student table
        LEFT JOIN attendance a ON c.id = a.classid AND a.studentid = ?
        WHERE cs.studentid = ?  -- Make sure we only get classes for this student
    ");
    $query->execute([$studentId, $studentId]); 
    $classes = $query->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($classes)) {
        echo json_encode(["error" => "No classes found for this student."]);
    } else {
        echo json_encode($classes);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Database query failed: " . $e->getMessage()]);
}
?>

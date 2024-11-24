<?php
session_start();
include 'includes/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User ID is not set in the session."]);
    exit;
}

$user_id = $_SESSION['user_id']; 
if ($_SESSION['role'] !== 'student') {
    http_response_code(403); 
    echo json_encode(["error" => "You do not have permission to enroll in classes."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['class_id']) || !is_numeric($data['class_id'])) {
    echo json_encode(["error" => "Invalid class ID."]);
    exit;
}

$class_id = (int)$data['class_id'];

try {
    $query = $pdo->prepare("SELECT * FROM class WHERE id = :class_id");
    $query->bindParam(':class_id', $class_id, PDO::PARAM_INT);
    $query->execute();
    $class = $query->fetch(PDO::FETCH_ASSOC);

    if (!$class) {
        echo json_encode(["error" => "Class not found."]);
        exit;
    }

    $enrollmentQuery = $pdo->prepare("SELECT * FROM class_student WHERE studentid = :user_id AND classid = :class_id");
    $enrollmentQuery->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $enrollmentQuery->bindParam(':class_id', $class_id, PDO::PARAM_INT);
    $enrollmentQuery->execute();
    $enrollment = $enrollmentQuery->fetch(PDO::FETCH_ASSOC);

    if ($enrollment) {
        echo json_encode(["error" => "You are already enrolled in this class."]);
        exit;
    }

    $enrollQuery = $pdo->prepare("INSERT INTO class_student (studentid, classid) VALUES (:user_id, :class_id)");
    $enrollQuery->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $enrollQuery->bindParam(':class_id', $class_id, PDO::PARAM_INT);
    $enrollQuery->execute();

    echo json_encode(["message" => "Successfully enrolled in the class."]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Enrollment failed: " . $e->getMessage()]);
}
?>

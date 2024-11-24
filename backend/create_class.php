<?php
session_start();
include 'includes/db.php'; 
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    http_response_code(403); 
    exit;
}
$teacherId = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $classname = trim($_POST['classname']);
    $starttime = trim($_POST['starttime']);
    $endtime = trim($_POST['endtime']);
    if (empty($classname) || empty($starttime) || empty($endtime)) {
        echo "All fields are required!";
        exit;
    }
    $query = $pdo->prepare("INSERT INTO class (teacherid, classname, starttime, endtime) VALUES (?, ?, ?, ?)");
    $result = $query->execute([$teacherId, $classname, $starttime, $endtime]);
    if ($result) {
        echo "Class created successfully!";
        header('Location: teacher_dashboard.php'); 
    } else {
        echo "Failed to create class. Please try again.";
    }
} else {
    header('Location: teacher_dashboard.php');
    exit;
}
?>

<?php
session_start();
include 'includes/db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$query = $pdo->prepare("SELECT * FROM user WHERE email = ?");
$query->execute([$email]);
$user = $query->fetch();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        'success' => true,
        'redirect' => $user['role'] === 'teacher' 
            ? '/public/teacher_dashboard.html' 
            : '/public/student_dashboard.html'
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
}
?>

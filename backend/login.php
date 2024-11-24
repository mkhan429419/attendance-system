<?php
session_start(); 
include 'includes/db.php';
header('Content-Type: application/json'); 

$data = json_decode(file_get_contents('php://input'), true);

error_log("Received data: " . json_encode($data)); 

$email = trim($data['email']) ?? ''; 
$password = trim($data['password']) ?? '';

error_log("Email: " . $email);
error_log("Password: " . $password);

$query = $pdo->prepare("SELECT * FROM user WHERE email = ?");
$query->execute([$email]); 

$user = $query->fetch();
if ($user) {
    error_log("User found: " . $user['email']);
} else {
    error_log("User not found.");
}
if ($user && password_verify($password, $user['password'])) {
    error_log("Password verified successfully for user: " . $user['email']);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        'success' => true,
        'redirect' => $user['role'] === 'teacher' 
            ? '/public/teacher_dashboard.html' 
            : '/public/student_dashboard.html'
    ]);
} else {
    error_log("Invalid email or password."); 
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
}
?>

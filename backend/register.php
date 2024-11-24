<?php
session_start(); 
include 'includes/db.php';
header('Content-Type: application/json'); 

$data = json_decode(file_get_contents('php://input'), true);

error_log("Received data: " . json_encode($data)); 

$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';
$confirmPassword = isset($data['confirmPassword']) ? trim($data['confirmPassword']) : '';
$fullname = isset($data['fullname']) ? trim($data['fullname']) : '';
$role = isset($data['role']) ? trim($data['role']) : '';

if (empty($email) || empty($password) || empty($confirmPassword) || empty($fullname) || empty($role)) {
    echo json_encode(['success' => false, 'error' => 'Please fill all the fields.']);
    exit();
}
if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'error' => 'Passwords do not match.']);
    exit();
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters long.']);
    exit();
}
try {
    $query = $pdo->prepare("SELECT * FROM user WHERE email = ?");
    $query->execute([$email]);
    $user = $query->fetch();
    if ($user) {
        echo json_encode(['success' => false, 'error' => 'Email already exists.']);
        exit();
    }
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $insertQuery = $pdo->prepare("INSERT INTO user (email, password, fullname, role) VALUES (?, ?, ?, ?)");
    $insertQuery->execute([$email, $hashedPassword, $fullname, $role]); 
    if ($insertQuery) {
        echo json_encode(['success' => true, 'message' => 'Registration successful. Please log in.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'An error occurred while registering. Please try again.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'An error occurred.']);
    error_log('Error: ' . $e->getMessage()); 
}
?>

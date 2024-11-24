<?php
session_start();
session_destroy();
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
header("Location:../frontend/login.html")
?>

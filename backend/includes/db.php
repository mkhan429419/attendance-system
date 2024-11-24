<?php
$host = 'localhost';
$dbname = 'attendance_system';
$username = 'root';
$password = 'seecs@123';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
     error_log("Connection failed: " . $e->getMessage()); 
     echo json_encode(['success' => false, 'error' => 'An error occurred while connecting to the database.']);
     exit();
}
?>

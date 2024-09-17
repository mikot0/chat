<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';

$mysqli = new mysqli("localhost", "your_username", "your_password", "your_username");

$query = "SELECT password_hash FROM users WHERE id = 1";
$result = $mysqli->query($query);

$row = $result->fetch_assoc();
if (password_verify($password, $row['password_hash'])) {
    echo json_encode(['success' => true]);
}

$mysqli->close();
?>
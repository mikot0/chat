<?php
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_username";

$conn = new mysqli($servername, $username, $password, $dbname);

$plain_password = "1";
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

$query = "INSERT INTO users (password_hash) VALUES (?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $hashed_password);
$stmt->execute();

$stmt->close();
$conn->close();
?>
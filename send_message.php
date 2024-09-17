<?php
$file = 'text.json';
$messages = json_decode(file_get_contents($file), true) ?: [];

if ($_POST['type'] === 'text') {
    $messages[] = ['nickname' => $_POST['nickname'], 'type' => 'text', 'content' => $_POST['content'] ?? ''];
} elseif ($_POST['type'] === 'mixed' && isset($_FILES['image'])) {
    $imagePath = 'uploads/' . basename($_FILES['image']['name']);
    if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
        $messages[] = ['nickname' => $_POST['nickname'], 'type' => 'mixed', 'content' => $_POST['content'] ?? '', 'image' => $imagePath];
    }
}

file_put_contents($file, json_encode($messages));
?>
<?php
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => ''];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $value = $_POST['value'] ?? '';
    $icon = empty($_POST['icon']) ? NULL : $_POST['icon'];

    if (empty($id) || empty($name) || empty($value)) {
        $response['message'] = 'ID, Name, and Value are required.';
        echo json_encode($response);
        exit();
    }

    try {
        $stmt = $conn->prepare("UPDATE tb_contact SET name = ?, value = ?, icon = ? WHERE id = ?");
        $stmt->bind_param("sssi", $name, $value, $icon, $id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Contact updated successfully.';
        } else {
            $response['message'] = 'Failed to update contact: ' . $stmt->error;
        }
        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    } finally {
        if ($conn) {
            $conn->close();
        }
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
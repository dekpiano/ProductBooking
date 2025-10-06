<?php
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = [
    'success' => false,
    'message' => 'Failed to fetch contacts.',
    'contacts' => []
];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

try {
    $sql = "SELECT * FROM tb_contact ORDER BY id";
    $result = $conn->query($sql);

    $contacts = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
    }

    $response['success'] = true;
    $response['contacts'] = $contacts;

} catch (Throwable $t) {
    $response['message'] = "Server Error: " . $t->getMessage();
} finally {
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($response);
?>
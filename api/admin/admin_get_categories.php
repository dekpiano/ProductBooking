<?php
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => '', 'data' => []];

try {
    $result = $conn->query("SELECT id, name, slug, icon, order_display FROM tb_categories ORDER BY order_display ASC, name ASC");
    $categories = $result->fetch_all(MYSQLI_ASSOC);

    $response['success'] = true;
    $response['data'] = $categories;

} catch (Exception $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
}

echo json_encode($response);
?>
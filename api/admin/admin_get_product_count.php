<?php
session_start();
header('Content-Type: application/json');

// Include database connection
require_once '../shared/db_connect.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

try {
    // Query to get the total count of products
    $stmt = $conn->prepare("SELECT COUNT(*) AS product_count FROM tb_products");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $productCount = $row['product_count'];

    echo json_encode(['success' => true, 'product_count' => $productCount]);

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching product count: ' . $e->getMessage()]);
}

$conn->close();
?>
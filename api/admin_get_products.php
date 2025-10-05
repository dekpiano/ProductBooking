<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php';

$response = ['success' => false, 'message' => '', 'products' => []];

if (!isset($_SESSION['admin_id'])) {
    $response['message'] = 'Unauthorized access.';
    echo json_encode($response);
    exit;
}

try {
    if (isset($_GET['id'])) {
        // Fetch single product
        $productId = $_GET['id'];
        $stmt = $conn->prepare("SELECT id, name, category, price, stock, is_active, description, material, sizes, colors, discount_amount FROM tb_products WHERE id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $response['success'] = true;
            $response['products'][] = $result->fetch_assoc();
        } else {
            $response['message'] = 'Product not found.';
        }
        $stmt->close();
    } else {
        // Fetch all products
        $stmt = $conn->prepare("SELECT id, name, category, price, stock, is_active, description, material, sizes, colors, discount_amount FROM tb_products ORDER BY id DESC");
        $stmt->execute();
        $result = $stmt->get_result();

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        $response['success'] = true;
        $response['products'] = $products;
        $stmt->close();
    }

} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
<?php
session_start();
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => '', 'products' => []];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

if (!isset($_SESSION['admin_id'])) {
    $response['message'] = 'Unauthorized access.';
    echo json_encode($response);
    exit;
}

try {
    if (isset($_GET['id'])) {
        // Fetch single product
        $productId = $_GET['id'];
        $stmt = $conn->prepare("SELECT id, name, category, price, stock, is_active, description, material, image_url, sizes, colors, discount_amount FROM tb_products WHERE id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($product = $result->fetch_assoc()) {
            $response['success'] = true;
            $response['products'][] = $product;
        } else {
            $response['message'] = 'Product not found.';
            $response['success'] = false;
        }
        $stmt->close();
    } else {
        // Fetch all products
        $stmt = $conn->prepare("SELECT id, name, category, price, stock, is_active, description, material, image_url, sizes, colors, discount_amount FROM tb_products ORDER BY id DESC");
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
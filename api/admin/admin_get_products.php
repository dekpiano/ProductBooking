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
        $stmt = $conn->prepare("SELECT p.id, p.name, p.category_id, c.name AS category_name, p.price, p.stock, p.is_active, p.description, p.material, p.image_url, p.sizes, p.colors, p.discount_amount FROM tb_products p LEFT JOIN tb_categories c ON p.category_id = c.id WHERE p.id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($product = $result->fetch_assoc()) {
            // Process image_url to ensure only filename is returned
            if (!empty($product['image_url']) && strpos($product['image_url'], 'uploads/products/') === 0) {
                $product['image_url'] = basename($product['image_url']);
            }
            $response['success'] = true;
            $response['products'][] = $product;
        } else {
            $response['message'] = 'Product not found.';
            $response['success'] = false;
        }
        $stmt->close();
    } else {
        // Fetch all products
        $stmt = $conn->prepare("SELECT p.id, p.name, p.category_id, c.name AS category_name, p.price, p.stock, p.is_active, p.description, p.material, p.image_url, p.sizes, p.colors, p.discount_amount FROM tb_products p LEFT JOIN tb_categories c ON p.category_id = c.id ORDER BY p.id DESC");
        $stmt->execute();
        $result = $stmt->get_result();

        $products = [];
        while ($row = $result->fetch_assoc()) {
            // Process image_url to ensure only filename is returned
            if (!empty($row['image_url']) && strpos($row['image_url'], 'uploads/products/') === 0) {
                $row['image_url'] = basename($row['image_url']);
            }
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
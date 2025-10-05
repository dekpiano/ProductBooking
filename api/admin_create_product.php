<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php';

$response = ['success' => false, 'message' => ''];

if (!isset($_SESSION['admin_id'])) {
    $response['message'] = 'Unauthorized access.';
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? 0;
    $description = $_POST['description'] ?? null;
    $stock = $_POST['stock'] ?? 0;
    $is_active = $_POST['is_active'] ?? 1;
    $sizes = $_POST['sizes'] ?? null;
    $colors = $_POST['colors'] ?? null;
    $discount_amount = $_POST['discount_amount'] ?? 0.00; // Assuming this might be added later

    // Basic validation
    if (empty($name) || empty($category) || !is_numeric($price) || $price < 0) {
        $response['message'] = 'Product name, category, and a valid price are required.';
        echo json_encode($response);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO tb_products (name, category, price, description, stock, is_active, sizes, colors, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdsiisss", $name, $category, $price, $description, $stock, $is_active, $sizes, $colors, $discount_amount);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Product created successfully.';
        } else {
            $response['message'] = 'Failed to create product: ' . $stmt->error;
        }
        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
?>
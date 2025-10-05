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
    $id = $_POST['id'] ?? null;
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? 0;
    $description = $_POST['description'] ?? null;
    $stock = $_POST['stock'] ?? 0;
    $is_active = $_POST['is_active'] ?? 1;
    $sizes = $_POST['sizes'] ?? null;
    $colors = $_POST['colors'] ?? null;
    $discount_amount = $_POST['discount_amount'] ?? 0.00;

    // Basic validation
    if (empty($id) || empty($name) || empty($category) || !is_numeric($price) || $price < 0) {
        $response['message'] = 'Product ID, name, category, and a valid price are required.';
        echo json_encode($response);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE tb_products SET name = ?, category = ?, price = ?, description = ?, stock = ?, is_active = ?, sizes = ?, colors = ?, discount_amount = ? WHERE id = ?");
        $stmt->bind_param("ssdsiisssi", $name, $category, $price, $description, $stock, $is_active, $sizes, $colors, $discount_amount, $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Product updated successfully.';
            } else {
                $response['message'] = 'Product not found or no changes made.';
            }
        } else {
            $response['message'] = 'Failed to update product: ' . $stmt->error;
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
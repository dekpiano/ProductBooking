<?php
session_start();
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => ''];

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;

    // Basic validation
    if (empty($id) || !is_numeric($id)) {
        $response['message'] = 'Product ID is required and must be a number.';
        echo json_encode($response);
        exit;
    }

    try {
        // 1. Fetch image_url before deleting the product
        $current_image_url = null;
        $stmt_fetch_image = $conn->prepare("SELECT image_url FROM tb_products WHERE id = ?");
        $stmt_fetch_image->bind_param("i", $id);
        $stmt_fetch_image->execute();
        $stmt_fetch_image->bind_result($current_image_url);
        $stmt_fetch_image->fetch();
        $stmt_fetch_image->close();

        // 2. Delete the image file if it exists
        if ($current_image_url) {
            $image_path = '../../uploads/products/' . $current_image_url; // Adjust path from api/admin/ to project root
            if (file_exists($image_path)) {
                if (!unlink($image_path)) {
                    // If unlink fails, add a message to the response
                    $response['message'] .= ' Failed to delete image file: ' . $image_path;
                }
            } else {
                // If file does not exist, add a message to the response
                $response['message'] .= ' Image file not found at: ' . $image_path;
            }
        }

        // 3. Delete the product record from the database
        $stmt = $conn->prepare("DELETE FROM tb_products WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Product deleted successfully.';
            } else {
                $response['message'] = 'Product not found.';
            }
        } else {
            $response['message'] = 'Failed to delete product: ' . $stmt->error;
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
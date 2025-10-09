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
    $name = $_POST['name'] ?? '';
    $category_id = $_POST['category_id'] ?? null;
    $price = $_POST['price'] ?? 0;
    $description = $_POST['description'] ?? null;
    $material = $_POST['material'] ?? null; // Added material
    $stock = $_POST['stock'] ?? 0;
    $is_active = $_POST['is_active'] ?? 1;
    $sizes = $_POST['sizes'] ?? null;
    $colors = $_POST['colors'] ?? null;
    $discount_amount = $_POST['discount_amount'] ?? 0.00;
    $image_url = null; // Initialize image_url

    // Basic validation
    if (empty($id) || empty($name) || empty($category_id) || !is_numeric($price) || $price < 0) {
        $response['message'] = 'Product ID, name, category, and a valid price are required.';
        echo json_encode($response);
        exit;
    }

    // Fetch current image_url if no new image is uploaded
    $current_image_url = null;
    $stmt_fetch_image = $conn->prepare("SELECT image_url FROM tb_products WHERE id = ?");
    $stmt_fetch_image->bind_param("i", $id);
    $stmt_fetch_image->execute();
    $stmt_fetch_image->bind_result($current_image_url);
    $stmt_fetch_image->fetch();
    $stmt_fetch_image->close();

    $image_url = $current_image_url; // Default to current image_url

    // Handle image upload
    if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../uploads/products/'; // Relative path to the uploads directory
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileTmpPath = $_FILES['productImage']['tmp_name'];
        $fileName = $_FILES['productImage']['name'];
        $fileSize = $_FILES['productImage']['size'];
        $fileType = $_FILES['productImage']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $image_url = 'uploads/products/' . $newFileName; // Path to store in DB

            // Optional: Delete old image if it exists
            if ($current_image_url && file_exists('../../' . $current_image_url)) {
                unlink('../../' . $current_image_url);
            }
        } else {
            $response['message'] = 'Failed to upload new image.';
            echo json_encode($response);
            exit;
        }
    }

    try {
        $stmt = $conn->prepare("UPDATE tb_products SET name = ?, category_id = ?, price = ?, description = ?, material = ?, image_url = ?, stock = ?, is_active = ?, sizes = ?, colors = ?, discount_amount = ? WHERE id = ?");
        $stmt->bind_param("sidsissisidi", $name, $category_id, $price, $description, $material, $image_url, $stock, $is_active, $sizes, $colors, $discount_amount, $id);

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
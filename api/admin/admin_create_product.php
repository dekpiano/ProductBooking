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
    if (empty($name) || empty($category_id) || !is_numeric($price) || $price < 0) {
        $response['message'] = 'Product name, category, and a valid price are required.';
        echo json_encode($response);
        exit;
    }

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
            $image_url = $newFileName; // Path to store in DB
        } else {
            $response['message'] = 'Failed to upload image.';
            echo json_encode($response);
            exit;
        }
    }

    try {
        $stmt = $conn->prepare("INSERT INTO tb_products (name, category_id, price, description, material, image_url, stock, is_active, sizes, colors, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sidsssiissd", $name, $category_id, $price, $description, $material, $image_url, $stock, $is_active, $sizes, $colors, $discount_amount);

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
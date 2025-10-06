<?php
error_reporting(E_ALL); ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => ''];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $type = $_POST['type'] ?? '';
    $account_name = $_POST['account_name'] ?? NULL;
    $account_number = $_POST['account_number'] ?? NULL;
    $bank_name = $_POST['bank_name'] ?? NULL;
    $promptpay_id = $_POST['promptpay_id'] ?? NULL;
    $qr_code_image = NULL; // Initialize qr_code_image

    // Handle QR Code image upload
    if (isset($_FILES['qrCodeImage']) && $_FILES['qrCodeImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../uploads/promptpay/'; // Relative path to the uploads directory
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileTmpPath = $_FILES['qrCodeImage']['tmp_name'];
        $fileName = $_FILES['qrCodeImage']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        $newFileName = 'qrcode_' . md5(time() . $fileName) . '.' . $fileExtension;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $qr_code_image = $newFileName; // Store only the filename in DB
        } else {
            $response['message'] = 'Failed to upload QR Code image.';
            echo json_encode($response);
            exit;
        }
    }

    if (empty($name) || empty($type)) {
        $response['message'] = 'Name and Type are required.';
        echo json_encode($response);
        exit();
    }

    try {
        $is_active = 1; // Default to active
        $stmt = $conn->prepare("INSERT INTO tb_payment_methods (name, type, account_name, account_number, bank_name, promptpay_id, qr_code_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssi", $name, $type, $account_name, $account_number, $bank_name, $promptpay_id, $qr_code_image, $is_active);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Payment method added successfully.';
        } else {
            $response['message'] = 'Failed to add payment method: ' . $stmt->error;
        }
        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    } finally {
        if ($conn) {
            $conn->close();
        }
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
<?php
error_reporting(E_ALL); ini_set('display_errors', 1);
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
    $type = $_POST['type'] ?? '';
    $account_name = empty($_POST['account_name']) ? NULL : $_POST['account_name'];
    $account_number = empty($_POST['account_number']) ? NULL : $_POST['account_number'];
    $bank_name = empty($_POST['bank_name']) ? NULL : $_POST['bank_name'];
    $promptpay_id = empty($_POST['promptpay_id']) ? NULL : $_POST['promptpay_id'];
    // $qr_code_image is handled by the image upload logic below
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    if (empty($id) || !is_numeric($id) || empty($name) || empty($type)) {
        $response['message'] = 'ID, Name, and Type are required.';
        echo json_encode($response);
        exit();
    }

    // First, get the current image filename from the DB
    $stmt_fetch_image = $conn->prepare("SELECT qr_code_image FROM tb_payment_methods WHERE id = ?");
    $stmt_fetch_image->bind_param("i", $id);
    $stmt_fetch_image->execute();
    $stmt_fetch_image->bind_result($current_qr_code_image);
    $stmt_fetch_image->fetch();
    $stmt_fetch_image->close();

    $qr_code_image = $current_qr_code_image; // Assume old image is kept

    // Handle QR Code image upload if a new file is provided
    if (isset($_FILES['qrCodeImage']) && $_FILES['qrCodeImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../uploads/promptpay/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Delete the old image if it exists
        if (!empty($current_qr_code_image)) {
            $oldImagePath = $uploadDir . $current_qr_code_image;
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        $fileTmpPath = $_FILES['qrCodeImage']['tmp_name'];
        $fileName = $_FILES['qrCodeImage']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $newFileName = 'qrcode_' . md5(time() . $fileName) . '.' . $fileExtension;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $qr_code_image = $newFileName; // Store only the new filename in DB
        } else {
            $response['message'] = 'Failed to upload new QR Code image.';
            echo json_encode($response);
            exit;
        }
    }

    try {
        // First, check if the payment method exists
        $stmt_check = $conn->prepare("SELECT id FROM tb_payment_methods WHERE id = ?");
        $stmt_check->bind_param("i", $id);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows === 0) {
            $response['message'] = 'Payment method not found.';
            echo json_encode($response);
            exit;
        }
        $stmt_check->close();

        $stmt = $conn->prepare("UPDATE tb_payment_methods SET name = ?, type = ?, account_name = ?, account_number = ?, bank_name = ?, promptpay_id = ?, qr_code_image = ?, is_active = ? WHERE id = ?");
        $stmt->bind_param("sssssssii", $name, $type, $account_name, $account_number, $bank_name, $promptpay_id, $qr_code_image, $is_active, $id);

        if ($stmt->execute()) {
            error_log("UPDATE query executed for payment method ID: " . $id);
            error_log("Name: " . $name . ", Type: " . $type . ", Account Name: " . $account_name . ", Account Number: " . $account_number . ", Bank Name: " . $bank_name . ", PromptPay ID: " . $promptpay_id . ", QR Code Image: " . $qr_code_image . ", Is Active: " . $is_active);
            error_log("Affected rows: " . $stmt->affected_rows);
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Payment method updated successfully.';
            } else {
                $response['success'] = true; // Change to true
                $response['message'] = 'No changes detected, payment method data is up to date.'; // More neutral message
            }
        } else {
            error_log("UPDATE query failed for payment method ID: " . $id . ": " . $stmt->error);
            $response['message'] = 'Failed to update payment method: ' . $stmt->error;
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
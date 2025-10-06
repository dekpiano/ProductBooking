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
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $type = $_POST['type'] ?? '';
    $account_name = $_POST['account_name'] ?? NULL;
    $account_number = $_POST['account_number'] ?? NULL;
    $bank_name = $_POST['bank_name'] ?? NULL;
    $promptpay_id = $_POST['promptpay_id'] ?? NULL;
    $qr_code_image = $_POST['qr_code_image'] ?? NULL; // Default to existing value if not uploading new
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    if (empty($id) || empty($name) || empty($type)) {
        $response['message'] = 'ID, Name, and Type are required.';
        echo json_encode($response);
        exit();
    }

    // Fetch current qr_code_image if no new image is uploaded
    $current_qr_code_image = null;
    if (empty($_FILES['qrCodeImage']) || $_FILES['qrCodeImage']['error'] !== UPLOAD_ERR_OK) {
        $stmt_fetch_image = $conn->prepare("SELECT qr_code_image FROM tb_payment_methods WHERE id = ?");
        $stmt_fetch_image->bind_param("i", $id);
        $stmt_fetch_image->execute();
        $stmt_fetch_image->bind_result($current_qr_code_image);
        $stmt_fetch_image->fetch();
        $stmt_fetch_image->close();
        $qr_code_image = $current_qr_code_image; // Default to current image_url
    }

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
            $qr_code_image = '../uploads/promptpay/' . $newFileName; // Path to store in DB

            // Optional: Delete old image if it exists
            if ($current_qr_code_image && file_exists('../' . $current_qr_code_image)) {
                unlink('../../' . $current_qr_code_image);
            }
        } else {
            $response['message'] = 'Failed to upload new QR Code image.';
            echo json_encode($response);
            exit;
        }
    }

    try {
        $stmt = $conn->prepare("UPDATE tb_payment_methods SET name = ?, type = ?, account_name = ?, account_number = ?, bank_name = ?, promptpay_id = ?, qr_code_image = ?, is_active = ? WHERE id = ?");
        $stmt->bind_param("sssssssii", $name, $type, $account_name, $account_number, $bank_name, $promptpay_id, $qr_code_image, $is_active, $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Payment method updated successfully.';
            } else {
                $response['message'] = 'Payment method not found or no changes made.';
            }
        } else {
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
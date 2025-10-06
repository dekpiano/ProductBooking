<?php
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

    if (empty($id)) {
        $response['message'] = 'Payment method ID is required.';
        echo json_encode($response);
        exit();
    }

    try {
        // Get the image file name before deleting the record
        $stmt_select = $conn->prepare("SELECT qr_code_image FROM tb_payment_methods WHERE id = ?");
        $stmt_select->bind_param("i", $id);
        $stmt_select->execute();
        $stmt_select->bind_result($qr_code_image);
        $stmt_select->fetch();
        $stmt_select->close();

        // Delete the record from the database
        $stmt_delete = $conn->prepare("DELETE FROM tb_payment_methods WHERE id = ?");
        $stmt_delete->bind_param("i", $id);

        if ($stmt_delete->execute()) {
            $response['success'] = true;
            $response['message'] = 'Payment method deleted successfully.';

            // If a QR code image exists, delete it from the server
            if (!empty($qr_code_image)) {
                $file_path = '../../uploads/promptpay/' . $qr_code_image;
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }
        } else {
            $response['message'] = 'Failed to delete payment method: ' . $stmt_delete->error;
        }
        $stmt_delete->close();
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
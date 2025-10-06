<?php
require_once '../shared/db_connect.php';

header('Content-Type: application/json');

$response = ['success' => false, 'data' => [], 'message' => ''];

if (!$conn) {
    $response['message'] = "Database connection failed: " . mysqli_connect_error();
    echo json_encode($response);
    exit;
}

try {
    // Select only active payment methods
    $stmt = $conn->prepare("SELECT id, name, type, account_name, account_number, bank_name, promptpay_id, qr_code_image FROM tb_payment_methods WHERE is_active = 1 ORDER BY id");
    $stmt->execute();
    $result = $stmt->get_result();
    $payment_methods = [];
    while ($row = $result->fetch_assoc()) {
        // Prepend path to qr_code_image if it exists
        if (!empty($row['qr_code_image'])) {
            $row['qr_code_image'] = 'uploads/promptpay/' . $row['qr_code_image'];
        }
        $payment_methods[] = $row;
    }
    $stmt->close();

    $response['success'] = true;
    $response['data'] = $payment_methods;
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
} finally {
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($response);
?>
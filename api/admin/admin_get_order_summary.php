<?php
session_start();
header('Content-Type: application/json');

require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => '', 'data' => []];

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

try {
    // Get total product count
    $stmt = $conn->prepare("SELECT COUNT(*) AS total_products FROM tb_products");
    $stmt->execute();
    $result = $stmt->get_result();
    $productSummary = $result->fetch_assoc();
    $response['data']['total_products'] = $productSummary['total_products'];
    $stmt->close();

    // Get total orders count
    $stmt = $conn->prepare("SELECT COUNT(*) AS total_orders FROM tb_orders");
    $stmt->execute();
    $result = $stmt->get_result();
    $orderSummary = $result->fetch_assoc();
    $response['data']['total_orders'] = $orderSummary['total_orders'];
    $stmt->close();

    // Get pending payment orders count
    $stmt = $conn->prepare("SELECT COUNT(*) AS pending_payment_orders FROM tb_orders WHERE status = 'รอชำระเงิน'");
    $stmt->execute();
    $result = $stmt->get_result();
    $pendingPaymentSummary = $result->fetch_assoc();
    $response['data']['pending_payment_orders'] = $pendingPaymentSummary['pending_payment_orders'];
    $stmt->close();

    // Get pending verification orders count
    $stmt = $conn->prepare("SELECT COUNT(*) AS pending_verification_orders FROM tb_orders WHERE status = 'รอตรวจสอบการชำระเงิน'");
    $stmt->execute();
    $result = $stmt->get_result();
    $pendingVerificationSummary = $result->fetch_assoc();
    $response['data']['pending_verification_orders'] = $pendingVerificationSummary['pending_verification_orders'];
    $stmt->close();

    // Get paid orders count
    $stmt = $conn->prepare("SELECT COUNT(*) AS paid_orders FROM tb_orders WHERE status = 'ชำระเงินแล้ว'");
    $stmt->execute();
    $result = $stmt->get_result();
    $paidOrdersSummary = $result->fetch_assoc();
    $response['data']['paid_orders'] = $paidOrdersSummary['paid_orders'];
    $stmt->close();

    // Get total revenue (sum of final_amount for 'ชำระเงินแล้ว' orders)
    $stmt = $conn->prepare("SELECT SUM(final_amount) AS total_revenue FROM tb_orders WHERE status = 'ชำระเงินแล้ว'");
    $stmt->execute();
    $result = $stmt->get_result();
    $revenueSummary = $result->fetch_assoc();
    $response['data']['total_revenue'] = $revenueSummary['total_revenue'] ?? 0; // Use null coalescing to default to 0 if sum is null
    $stmt->close();

    $response['success'] = true;

} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
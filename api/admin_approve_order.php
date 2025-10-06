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
    $orderId = $_POST['order_id'] ?? null;
    $action = $_POST['action'] ?? 'approve'; // Default to approve
    $adminId = $_SESSION['admin_id'];

    // Basic validation
    if (empty($orderId)) {
        $response['message'] = 'Order ID is required.';
        echo json_encode($response);
        exit;
    }

    $conn->begin_transaction();

    try {
        if ($action === 'approve') {
            // 1. Update order status in tb_orders
            $stmt_order = $conn->prepare("UPDATE tb_orders SET status = 'ชำระเงินแล้ว' WHERE id = ? AND status = 'รอตรวจสอบการชำระเงิน'");
            $stmt_order->bind_param("s", $orderId);
            $stmt_order->execute();

            if ($stmt_order->affected_rows === 0) {
                throw new Exception("Order not found or not in 'รอตรวจสอบการชำระเงิน' status.");
            }
            $stmt_order->close();

            // 2. Update payment confirmation status in tb_payment_confirmations
            $stmt_payment_conf = $conn->prepare("UPDATE tb_payment_confirmations SET status = 'อนุมัติ', verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE order_id = ? AND status = 'รอตรวจสอบ'");
            $stmt_payment_conf->bind_param("is", $adminId, $orderId);
            $stmt_payment_conf->execute();

            if ($stmt_payment_conf->affected_rows === 0) {
                throw new Exception("Payment confirmation not found or not in 'รอตรวจสอบ' status.");
            }
            $stmt_payment_conf->close();

            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Payment approved and order status updated successfully.';
        } else if ($action === 'unapprove') {
            // 1. Update order status in tb_orders (revert to 'รอตรวจสอบการชำระเงิน')
            $stmt_order = $conn->prepare("UPDATE tb_orders SET status = 'รอตรวจสอบการชำระเงิน' WHERE id = ? AND status = 'ชำระเงินแล้ว'");
            $stmt_order->bind_param("s", $orderId);
            $stmt_order->execute();

            if ($stmt_order->affected_rows === 0) {
                throw new Exception("Order not found or not in 'รอจัดส่ง' status.");
            }
            $stmt_order->close();

            // 2. Update payment confirmation status in tb_payment_confirmations (revert to 'รอตรวจสอบ')
            $stmt_payment_conf = $conn->prepare("UPDATE tb_payment_confirmations SET status = 'รอตรวจสอบ', verified_by = NULL, verified_at = NULL WHERE order_id = ? AND status = 'อนุมัติ'");
            $stmt_payment_conf->bind_param("s", $orderId);
            $stmt_payment_conf->execute();

            if ($stmt_payment_conf->affected_rows === 0) {
                throw new Exception("Payment confirmation not found or not in 'อนุมัติ' status.");
            }
            $stmt_payment_conf->close();

            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Payment unapproved and order status reverted successfully.';
        } else {
            throw new Exception("Invalid action specified.");
        }

    } catch (Exception $e) {
        $conn->rollback();
        $response['message'] = 'Failed to process payment action: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
?>
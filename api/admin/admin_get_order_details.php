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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $orderId = $_GET['order_id'] ?? null;

    if (empty($orderId)) {
        $response['message'] = 'Order ID is required.';
        echo json_encode($response);
        exit;
    }

    try {
        // Fetch order details
        $stmt_order = $conn->prepare("SELECT o.*, c.first_name as customer_first_name, c.last_name as customer_last_name, c.phone as customer_phone FROM tb_orders o JOIN tb_customers c ON o.customer_id = c.id WHERE o.id = ?");
        $stmt_order->bind_param("s", $orderId);
        $stmt_order->execute();
        $order = $stmt_order->get_result()->fetch_assoc();
        $stmt_order->close();

        if (!$order) {
            throw new Exception("Order not found.");
        }

        // Fetch payment confirmation details
        $stmt_payment_conf = $conn->prepare("SELECT * FROM tb_payment_confirmations WHERE order_id = ?");
        $stmt_payment_conf->bind_param("s", $orderId);
        $stmt_payment_conf->execute();
        $paymentConfirmation = $stmt_payment_conf->get_result()->fetch_assoc();
        $stmt_payment_conf->close();

        $response['success'] = true;
        $response['message'] = 'Order details fetched successfully.';
        $response['order'] = $order;
        $response['payment_confirmation'] = $paymentConfirmation;

    } catch (Exception $e) {
        $response['message'] = 'Failed to fetch order details: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
?>
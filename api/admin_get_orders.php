<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php';

$response = ['success' => false, 'message' => '', 'orders' => []];

if (!isset($_SESSION['admin_id'])) {
    $response['message'] = 'Unauthorized access.';
    echo json_encode($response);
    exit;
}

try {
    $sql_base = "SELECT
                o.id AS order_id,
                o.total_amount,
                o.discount_amount,
                o.final_amount,
                o.status AS order_status,
                o.payment_method,
                o.created_at AS order_created_at,
                c.first_name,
                c.last_name,
                c.phone,
                c.email,
                pc.transfer_amount,
                pc.transfer_date,
                pc.transfer_time,
                pc.from_bank,
                pc.from_account_name,
                pc.slip_filename,
                pc.slip_path,
                pc.status AS payment_confirmation_status
            FROM
                tb_orders o
            JOIN
                tb_customers c ON o.customer_id = c.id
            LEFT JOIN
                tb_payment_confirmations pc ON o.id = pc.order_id";

    if (isset($_GET['order_id'])) {
        // Fetch single order
        $orderId = $_GET['order_id'];
        $sql = $sql_base . " WHERE o.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $response['success'] = true;
            $response['orders'][] = $result->fetch_assoc();
        } else {
            $response['message'] = 'Order not found.';
        }
        $stmt->close();
    } else {
        // Fetch all orders
        $sql = $sql_base . " ORDER BY o.created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();

        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }

        $response['success'] = true;
        $response['orders'] = $orders;
        $stmt->close();
    }

} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
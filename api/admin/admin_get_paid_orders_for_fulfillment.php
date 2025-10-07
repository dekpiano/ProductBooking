<?php
session_start();
header('Content-Type: application/json');

require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => '', 'orders' => []];

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
    // Fetch paid orders
    $sql_orders = "SELECT
                    o.id AS order_id,
                    o.final_amount,
                    o.created_at,
                    c.first_name,
                    c.last_name,
                    c.phone
                   FROM tb_orders o
                   JOIN tb_customers c ON o.customer_id = c.id
                   WHERE o.status = 'ชำระเงินแล้ว'
                   ORDER BY o.created_at DESC";

    $stmt_orders = $conn->prepare($sql_orders);
    $stmt_orders->execute();
    $result_orders = $stmt_orders->get_result();

    $orders = [];
    while ($order_row = $result_orders->fetch_assoc()) {
        $order_id = $order_row['order_id'];
        $order_row['items'] = [];

        // Fetch items for each order
        $sql_items = "SELECT
                        oi.quantity,
                        oi.unit_price,
                        p.name AS product_name,
                        p.category,
                        p.image_url,
                        oi.gender,
                        oi.size
                      FROM tb_order_items oi
                      JOIN tb_products p ON oi.product_id = p.id
                      WHERE oi.order_id = ?";
        $stmt_items = $conn->prepare($sql_items);
        $stmt_items->bind_param("s", $order_id);
        $stmt_items->execute();
        $result_items = $stmt_items->get_result();

        while ($item_row = $result_items->fetch_assoc()) {
            $order_row['items'][] = $item_row;
        }
        $stmt_items->close();
        $orders[] = $order_row;
    }
    $stmt_orders->close();

    $response['success'] = true;
    $response['orders'] = $orders;

} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
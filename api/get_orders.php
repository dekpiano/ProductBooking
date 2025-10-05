<?php
header('Content-Type: application/json');

// --- Database Configuration ---
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'skjacth_product_booking';

$response = [
    'success' => false,
    'message' => 'Failed to fetch orders.',
    'orders' => []
];

$conn = null;

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    $conn->set_charset("utf8mb4");

    // --- Get query parameters for filtering and searching ---
    $status_filter = isset($_GET['status']) ? $_GET['status'] : '';
    $search_query = isset($_GET['q']) ? $_GET['q'] : '';

    // --- Build the SQL Query ---
    // This query joins orders with customers and aggregates order items into a single string
    $sql = "
        SELECT 
            o.id, 
            o.final_amount, 
            o.status, 
            o.created_at, 
            c.first_name, 
            c.last_name, 
            c.phone,
            (
                SELECT GROUP_CONCAT(oi.product_name, ' x', oi.quantity SEPARATOR ', ')
                FROM tb_order_items oi
                WHERE oi.order_id = o.id
            ) AS items_summary
        FROM tb_orders o
        JOIN tb_customers c ON o.customer_id = c.id
    ";

    $where_clauses = [];
    $params = [];
    $types = '';

    // Add status filter if provided
    if (!empty($status_filter)) {
        $where_clauses[] = "o.status = ?";
        $params[] = $status_filter;
        $types .= 's';
    }

    // Add search query if provided
    if (!empty($search_query)) {
        $search_term = '%' . $search_query . '%';
        $where_clauses[] = "(o.id LIKE ? OR CONCAT(c.first_name, ' ', c.last_name) LIKE ? OR c.phone LIKE ?)";
        // Add the search term three times for the three placeholders
        array_push($params, $search_term, $search_term, $search_term);
        $types .= 'sss';
    }

    if (!empty($where_clauses)) {
        $sql .= " WHERE " . implode(' AND ', $where_clauses);
    }

    $sql .= " ORDER BY o.created_at DESC LIMIT 100"; // Add ordering and a limit

    $stmt = $conn->prepare($sql);

    // Dynamically bind parameters
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    $stmt->close();

    $response['success'] = true;
    $response['message'] = 'Orders fetched successfully.';
    $response['orders'] = $orders;

} catch (Throwable $t) {
    $response['message'] = "Server Error: " . $t->getMessage();
} finally {
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($response);

?>
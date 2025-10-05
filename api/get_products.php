<?php
header('Content-Type: application/json');

// --- Database Configuration ---
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'skjacth_product_booking';

$response = [
    'success' => false,
    'message' => 'Failed to fetch products.',
    'products' => []
];

$conn = null;

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    $conn->set_charset("utf8mb4");

    $query = "SELECT * FROM tb_products WHERE is_active = 1 ORDER BY id ASC";
    $result = $conn->query($query);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Decode JSON fields for sizes and colors
        $row['sizes'] = json_decode($row['sizes']);
        $row['colors'] = json_decode($row['colors']);
        $products[] = $row;
    }

    $response['success'] = true;
    $response['message'] = 'Products fetched successfully.';
    $response['products'] = $products;

} catch (Throwable $t) {
    $response['message'] = "Server Error: " . $t->getMessage();
} finally {
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($response);

?>
<?php
header('Content-Type: application/json');

require_once '../shared/db_connect.php';

$response = [
    'success' => false,
    'message' => 'Failed to fetch products.',
    'products' => []
];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

try {
    // The $conn variable should be available from db_connect.php
    // No need for $conn = null; or mysqli_report(...) here

    $query = "SELECT * FROM tb_products WHERE is_active = 1 ORDER BY id ASC";
    $result = $conn->query($query);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Decode JSON fields for sizes and colors
        // $row['sizes'] = json_decode($row['sizes']); // No longer JSON
        // $row['colors'] = json_decode($row['colors']); // No longer JSON
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
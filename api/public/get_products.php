<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../shared/db_connect.php';

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

    $query = "SELECT p.*, c.slug AS category FROM tb_products p LEFT JOIN tb_categories c ON p.category_id = c.id WHERE p.is_active = 1 ORDER BY p.id ASC";
    $result = $conn->query($query);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['image_url'])) {
            $row['image_url'] = 'uploads/products/' . $row['image_url'];
        }
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
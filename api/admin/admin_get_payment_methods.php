<?php
session_start();
error_reporting(E_ALL); ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => '', 'paymentMethods' => []];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

try {
    if (isset($_GET['id'])) {
        // Fetch single payment method
        $methodId = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM tb_payment_methods WHERE id = ?");
        $stmt->bind_param("i", $methodId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($method = $result->fetch_assoc()) {
            $response['success'] = true;
            $response['paymentMethods'][] = $method;
        } else {
            $response['message'] = 'Payment method not found.';
            $response['success'] = false;
        }
        $stmt->close();
    } else {
        // Fetch all payment methods
        $sql = "SELECT * FROM tb_payment_methods ORDER BY id";
        $result = $conn->query($sql);

        $paymentMethods = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $paymentMethods[] = $row;
            }
        }
        $response['success'] = true;
        $response['paymentMethods'] = $paymentMethods;
    }

} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
} finally {
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($response);
?>
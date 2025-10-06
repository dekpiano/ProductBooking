<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

require_once '../shared/db_connect.php';

// --- Response Object ---
$response = [
    'success' => false,
    'message' => 'An unknown error occurred.',
    'order_id' => null
];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

// $conn is now available from db_connect.php

try {
    $conn->begin_transaction();

    // --- 1. รับและแปลงข้อมูล ---
    if (!isset($_POST['order_data']) || !isset($_POST['payment_confirmation_data'])) {
        throw new Exception('Incomplete data received.');
    }

    $orderData = json_decode($_POST['order_data'], true);
    $paymentConfirmData = json_decode($_POST['payment_confirmation_data'], true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    $customerInfo = $orderData['customer'];
    $items = $orderData['items'];

    // --- 2. จัดการข้อมูลลูกค้า (ค้นหาหรือสร้างใหม่) ---
    $customerId = null;
    $stmt = $conn->prepare("SELECT id FROM tb_customers WHERE phone = ?");
    $stmt->bind_param("s", $customerInfo['phone']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $customerId = $result->fetch_assoc()['id'];
    } else {
        $stmt_insert_customer = $conn->prepare("INSERT INTO tb_customers (first_name, last_name, phone) VALUES (?, ?, ?)");
        $stmt_insert_customer->bind_param("sss", $customerInfo['first_name'], $customerInfo['last_name'], $customerInfo['phone']);
        $stmt_insert_customer->execute();
        $customerId = $conn->insert_id;
        $stmt_insert_customer->close();
    }
    $stmt->close();

    if (!$customerId) {
        throw new Exception('Failed to create or find customer.');
    }

    // --- 3. สร้าง Order ID ---
    $orderId = 'ORD' . time();

    // --- 4. จัดการไฟล์สลิปที่อัปโหลด ---
    $slipPathForDb = null;
    $slipFilename = null;
    if (isset($_FILES['slip_file']) && $_FILES['slip_file']['error'] == 0) {
        $uploadDir = '../../uploads/slips/';
        if (!is_dir($uploadDir) || !is_writable($uploadDir)) {
            throw new Exception("Server error: Upload directory does not exist or is not writable.");
        }
        $fileExtension = strtolower(pathinfo($_FILES['slip_file']['name'], PATHINFO_EXTENSION));
        $slipFilename = 'slip_' . $orderId . '_' . time() . '.' . $fileExtension;
        $uploadPath = $uploadDir . $slipFilename;

        if (!move_uploaded_file($_FILES['slip_file']['tmp_name'], $uploadPath)) {
            throw new Exception('Failed to upload payment slip.');
        }
        $slipPathForDb = 'uploads/slips/' . $slipFilename;
    } else {
        throw new Exception('Payment slip is required. Error code: ' . $_FILES['slip_file']['error']);
    }

    // --- 5. Look up payment method type ---
    $paymentMethodType = null;
    if (isset($orderData['payment_method_id'])) {
        $stmt_pm = $conn->prepare("SELECT type FROM tb_payment_methods WHERE id = ?");
        $stmt_pm->bind_param("i", $orderData['payment_method_id']);
        $stmt_pm->execute();
        $result_pm = $stmt_pm->get_result();
        if ($row_pm = $result_pm->fetch_assoc()) {
            $paymentMethodType = $row_pm['type'];
        }
        $stmt_pm->close();
    }

    if (!$paymentMethodType) {
        throw new Exception('Invalid or missing Payment Method ID.');
    }

    // --- 6. บันทึกข้อมูลลง tb_orders ---
    $stmt_order = $conn->prepare(
        "INSERT INTO tb_orders (id, customer_id, total_amount, discount_amount, final_amount, status, payment_method) VALUES (?, ?, ?, ?, ?, 'รอตรวจสอบการชำระเงิน', ?)"
    );
    $stmt_order->bind_param("siddds", 
        $orderId, 
        $customerId, 
        $orderData['total_amount'], 
        $orderData['discount_amount'], 
        $orderData['final_amount'],
        $paymentMethodType
    );
    $stmt_order->execute();
    $stmt_order->close();

    // --- 7. บันทึกข้อมูลลง tb_order_items ---
    $stmt_items = $conn->prepare(
        "INSERT INTO tb_order_items (order_id, product_id, product_name, quantity, unit_price, gender, size, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    foreach ($items as $item) {
        $gender = isset($item['gender']) ? $item['gender'] : ''; // Default to empty string for non-shirt items
        $size = isset($item['size']) ? $item['size'] : null;
        $productId = isset($item['product_id']) ? $item['product_id'] : null;
        $stmt_items->bind_param("sisidssd", 
            $orderId, 
            $productId, 
            $item['product_name'], 
            $item['quantity'], 
            $item['unit_price'], 
            $gender,
            $size,
            $item['subtotal']
        );
        $stmt_items->execute();
    }
    $stmt_items->close();

    // --- 7. บันทึกข้อมูลลง tb_payment_confirmations ---
    $stmt_confirm = $conn->prepare(
        "INSERT INTO tb_payment_confirmations (order_id, transfer_amount, transfer_date, transfer_time, from_bank, from_account_name, slip_filename, slip_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'รอตรวจสอบ')"
    );
    $stmt_confirm->bind_param("sdssssss",
        $orderId,
        $paymentConfirmData['transfer_amount'],
        $paymentConfirmData['transfer_date'],
        $paymentConfirmData['transfer_time'],
        $paymentConfirmData['from_bank'],
        $paymentConfirmData['from_account_name'],
        $slipFilename,
        $slipPathForDb
    );
    $stmt_confirm->execute();
    $stmt_confirm->close();

    // --- Commit Transaction ---
    $conn->commit();

    $response['success'] = true;
    $response['message'] = 'Order created successfully!';
    $response['order_id'] = $orderId;

} catch (Throwable $t) {
    // --- Rollback Transaction ---
    if ($conn && $conn->ping()) { // Check if connection is still alive
        $conn->rollback();
    }
    // Provide a detailed error message for debugging
    $response['message'] = "Server Error: " . $t->getMessage();
    // For more detailed debugging, you could add these:
    // $response['debug_file'] = $t->getFile();
    // $response['debug_line'] = $t->getLine();

} finally {
    // --- Close Connection ---
    if ($conn && $conn->ping()) {
        $conn->close();
    }
}

// --- Send Response ---
echo json_encode($response);

?>
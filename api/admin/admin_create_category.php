<?php
header('Content-Type: application/json');
require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $slug = isset($_POST['slug']) ? trim($_POST['slug']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $icon = isset($_POST['icon']) ? trim($_POST['icon']) : '';
    $order_display = isset($_POST['order_display']) ? (int)$_POST['order_display'] : 0;

    if (empty($name) || empty($slug)) {
        $response['message'] = 'ชื่อและ Slug ห้ามว่าง';
    } else {
        try {
            // Check if slug already exists
            $stmt = $conn->prepare("SELECT id FROM tb_categories WHERE slug = ?");
            $stmt->bind_param('s', $slug);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->fetch_assoc()) {
                $response['message'] = 'Slug นี้มีอยู่แล้ว';
            } else {
                $stmt = $conn->prepare("INSERT INTO tb_categories (name, slug, description, icon, order_display) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param('ssssi', $name, $slug, $description, $icon, $order_display);
                $stmt->execute();

                $response['success'] = true;
                $response['message'] = 'เพิ่มหมวดหมู่สำเร็จ';
            }
        } catch (Exception $e) {
            $response['message'] = 'Database error: ' . $e->getMessage();
        }
    }
} else {
    $response['message'] = 'Invalid request method';
}

echo json_encode($response);
?>
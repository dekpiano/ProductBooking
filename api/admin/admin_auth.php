<?php
session_start();
require_once '../shared/db_connect.php';

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Invalid request'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (empty($_POST['username']) || empty($_POST['password'])) {
        $response['message'] = 'Username and password are required.';
    } else {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT id, username, password_hash, role, is_active FROM tb_admin_users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $admin = $result->fetch_assoc();
            if ($admin['is_active'] && password_verify($password, $admin['password_hash'])) {
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_username'] = $admin['username'];
                $_SESSION['admin_role'] = $admin['role'];
                $response['success'] = true;
                $response['message'] = 'Login successful.';

                // Update last_login timestamp
                $update_stmt = $conn->prepare("UPDATE tb_admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
                $update_stmt->bind_param("i", $admin['id']);
                $update_stmt->execute();
                $update_stmt->close();

            } else {
                $response['message'] = 'Invalid username or password, or account is inactive.';
            }
        } else {
            $response['message'] = 'Invalid username or password.';
        }
        $stmt->close();
    }
}

$conn->close();
echo json_encode($response);
?>
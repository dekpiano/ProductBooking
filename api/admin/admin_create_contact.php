require_once '../shared/db_connect.php';

$response = ['success' => false, 'message' => ''];

// Check if connection failed
if (!$conn) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $value = $_POST['value'] ?? '';
    $icon = empty($_POST['icon']) ? NULL : trim($_POST['icon']);

    if (empty($name) || empty($value)) {
        $response['message'] = 'Name and Value are required.';
        echo json_encode($response);
        exit();
    }

    try {
        $stmt = $conn->prepare("INSERT INTO tb_contact (name, value, icon) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $value, $icon);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Contact added successfully.';
        } else {
            $response['message'] = 'Failed to add contact: ' . $stmt->error;
        }
        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    } finally {
        if ($conn) {
            $conn->close();
        }
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
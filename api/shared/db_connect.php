<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'skjacth_product_booking';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    $conn = null;
} else {
    $conn->set_charset("utf8mb4");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}
?>
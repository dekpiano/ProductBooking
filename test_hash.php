<?php
$plaintext_password = 'admin1234'; // รหัสผ่านที่คุณใช้ล็อกอิน
$stored_hash = '$2y$10$9OLPz/6x3Z3B3z3C4D5E6F7G8H9I0J.K.L.M.N.O.P.Q.R.S.T.U.V.W'; // <<< วางค่า password_hash ที่คุณคัดลอกมาจากฐานข้อมูลตรงนี้

if (password_verify($plaintext_password, $stored_hash)) {
    echo 'Password is valid!';
} else {
    echo 'Password is NOT valid.';
}
?>
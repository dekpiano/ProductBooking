<?php
session_start();

// If admin is not logged in, redirect to login page
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

$admin_username = $_SESSION['admin_username'];
$pageTitle = 'จัดการการจัดเตรียมสินค้า'; // Set page title
include '_head.php';
?>

<?php include '_sidebar.php'; ?>

<!-- Content Wrapper -->
<div id="content-wrapper" class="d-flex flex-column">
    <!-- Main Content -->
    <div id="content">
        <?php include '_navbar.php'; ?>

        <!-- Begin Page Content -->
        <div class="container-fluid">

            <!-- Page Heading -->
            <h1 class="h3 mb-4 text-gray-800">จัดการการจัดเตรียมสินค้า</h1>

            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">รายการคำสั่งซื้อที่ชำระเงินแล้ว (สำหรับจัดเตรียม)</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="fulfillmentTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>รหัสคำสั่งซื้อ</th>
                                    <th>ลูกค้า</th>
                                    <th>เบอร์โทร</th>
                                    <th>รายการสินค้า</th>
                                    <th>ยอดรวม</th>
                                    <th>วันที่สั่ง</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Data will be loaded here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->

<?php include '_footer.php'; ?>

<!-- Page level plugins -->
<script src="vendor/datatables/jquery.dataTables.min.js"></script>
<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

<!-- Custom scripts for all pages -->
<script src="js/fulfillment.js"></script>

</body>
</html>
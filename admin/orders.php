<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}
$pageTitle = 'SB Admin 2 - จัดการคำสั่งซื้อ'; // Set page title
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
            <script>
                const currentAdminId = <?php echo json_encode($_SESSION['admin_id']); ?>;
            </script>

            <!-- Page Heading -->
            <h1 class="h3 mb-2 text-gray-800">จัดการคำสั่งซื้อ</h1>
            <p class="mb-4">ดูรายการคำสั่งซื้อและอนุมัติการชำระเงิน</p>

            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">ข้อมูลคำสั่งซื้อ</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="ordersTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>ID คำสั่งซื้อ</th>
                                    <th>ลูกค้า</th>
                                    <th>ยอดรวม</th>
                                    <th>สถานะ</th>
                                    <th>วิธีชำระเงิน</th>
                                    <th>วันที่สั่งซื้อ</th>
                                    <th>ผู้อนุมัติ</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody">
                                <!-- Order rows will be inserted here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->

    <!-- Payment Slip Modal -->
    <div class="modal fade" id="paymentSlipModal" tabindex="-1" role="dialog" aria-labelledby="paymentSlipModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentSlipModalLabel">สลิปการชำระเงิน</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-center">
                    <img id="slipImage" src="" alt="Payment Slip" class="img-fluid mb-3">
                    <p class="mb-1"><strong>จำนวนเงินที่โอน:</strong> <span id="transferAmount"></span></p>
                    <p class="mb-1"><strong>วันที่โอน:</strong> <span id="transferDate"></span></p>
                    <p class="mb-1"><strong>เวลาที่โอน:</strong> <span id="transferTime"></span></p>
                    <p class="mb-1"><strong>จากธนาคาร:</strong> <span id="fromBank"></span></p>
                    <p class="mb-1"><strong>ชื่อบัญชีผู้โอน:</strong> <span id="fromAccountName"></span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">ปิด</button>
                </div>
            </div>
        </div>
    </div>

<?php include '_footer.php'; ?>
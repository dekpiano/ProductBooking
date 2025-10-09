<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit();
}
include('_head.php');
?>

<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <?php include('_sidebar.php'); ?>

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <?php include('_navbar.php'); ?>

                <!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <h1 class="h3 mb-2 text-gray-800">จัดการวิธีชำระเงิน</h1>
                    <p class="mb-4">เพิ่ม, แก้ไข หรือลบข้อมูลวิธีชำระเงิน</p>

                    <!-- DataTales Example -->
                    <div class="card shadow mb-4">
                        <div class="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 class="m-0 font-weight-bold text-primary">ข้อมูลวิธีชำระเงิน</h6>
                            <button class="btn btn-primary" data-toggle="modal" data-target="#paymentMethodModal"
                                id="addPaymentMethodBtn">
                                <i class="fas fa-plus"></i> เพิ่มวิธีชำระเงินใหม่
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered" id="paymentMethodsTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ชื่อ</th>
                                            <th>ประเภท</th>
                                            <th>ชื่อบัญชี</th>
                                            <th>เลขที่บัญชี</th>
                                            <th>ชื่อธนาคาร</th>
                                            <th>PromptPay ID</th>
                                            <th>QR Code</th>
                                            <th>สถานะ</th>
                                            <th>การกระทำ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Payment method data will be loaded here via JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <?php include('_footer.php'); ?>

        </div>
        <!-- End of Content Wrapper -->
      
    </div>
    <!-- End of Page Wrapper -->

    <!-- Payment Method Modal (Add/Edit) -->
    <div class="modal fade" id="paymentMethodModal" tabindex="-1" role="dialog" aria-labelledby="paymentMethodModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentMethodModalLabel">เพิ่ม/แก้ไขวิธีชำระเงิน</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="paymentMethodForm">
                        <input type="hidden" id="paymentMethodId" name="id">
                        <div class="form-group">
                            <label for="paymentMethodName">ชื่อ</label>
                            <input type="text" class="form-control" id="paymentMethodName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="paymentMethodType">ประเภท</label>
                            <select class="form-control" id="paymentMethodType" name="type" required>
                                <option value="">เลือกประเภท</option>
                                <option value="bank_transfer">โอนเงินผ่านธนาคาร</option>
                                <option value="promptpay">พร้อมเพย์</option>
                            </select>
                        </div>
                        <div id="bankTransferFields" class="d-none">
                            <div class="form-group">
                                <label for="accountName">ชื่อบัญชี</label>
                                <input type="text" class="form-control" id="accountName" name="account_name">
                            </div>
                            <div class="form-group">
                                <label for="accountNumber">เลขที่บัญชี</label>
                                <input type="text" class="form-control" id="accountNumber" name="account_number">
                            </div>
                            <div class="form-group">
                                <label for="bankName">ชื่อธนาคาร</label>
                                <input type="text" class="form-control" id="bankName" name="bank_name">
                            </div>
                        </div>
                        <div id="promptpayFields" class="d-none">
                            <div class="form-group">
                                <label for="promptpayId">PromptPay ID</label>
                                <input type="text" class="form-control" id="promptpayId" name="promptpay_id">
                            </div>
                            <div class="form-group">
                                <label for="qrCodeImage">QR Code Image</label>
                                <input type="file" class="form-control-file" id="qrCodeImage" name="qrCodeImage" accept="image/*">
                                <small class="form-text text-muted">อัปโหลดไฟล์รูปภาพ QR Code</small>
                                <div id="currentQrCodeImage" class="mt-2"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="isActive" name="is_active" checked>
                                <label class="form-check-label" for="isActive">
                                    ใช้งานอยู่
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">ยกเลิก</button>
                            <button type="submit" class="btn btn-primary">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Page level custom scripts -->
    <script src="js/demo/datatables-demo.js"></script>
    <script src="js/payment_methods.js"></script> <!-- New JS for payment methods management -->

</body>

</html>
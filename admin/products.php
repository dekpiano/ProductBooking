<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}
$pageTitle = 'SB Admin 2 - จัดการสินค้า'; // Set page title
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
            <h1 class="h3 mb-2 text-gray-800">จัดการสินค้า</h1>
            <p class="mb-4">เพิ่ม แก้ไข และลบสินค้าจากระบบ</p>

            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                    <h6 class="m-0 font-weight-bold text-primary">ข้อมูลสินค้า</h6>
                    <button class="btn btn-primary" data-toggle="modal" data-target="#productModal">เพิ่มสินค้าใหม่</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="productsTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>รูปภาพ</th>
                                    <th>ชื่อสินค้า</th>
                                    <th>หมวดหมู่</th>
                                    <th>ราคา</th>
                                    <th>สต็อก</th>
                                    <th>สถานะ</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody id="productsTableBody">
                                <!-- Product rows will be inserted here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->

    <!-- Product Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="productModalLabel">เพิ่ม/แก้ไขสินค้า</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <input type="hidden" id="productId" name="id">
                        <div class="form-group">
                            <label for="name">ชื่อสินค้า</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="category">หมวดหมู่</label>
                            <select class="form-control" id="category" name="category" required>
                                <option value="bracelet">สร้อยข้อมือ</option>
                                <option value="shirt">เสื้อ</option>
                                <option value="combo">ชุดคอมโบ</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="price">ราคา</label>
                            <input type="number" class="form-control" id="price" name="price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="description">รายละเอียดสินค้า</label>
                            <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="material">วัสดุ</label>
                            <input type="text" class="form-control" id="material" name="material">
                        </div>
                        <div class="form-group">
                            <label for="discount_amount">ส่วนลด (สำหรับคอมโบ)</label>
                            <input type="number" class="form-control" id="discount_amount" name="discount_amount" step="0.01" value="0.00">
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="stock">สต็อก</label>
                                <input type="number" class="form-control" id="stock" name="stock" value="0">
                            </div>
                            <div class="form-group col-md-6">
                                 <label for="is_active">สถานะ</label>
                                <select class="form-control" id="is_active" name="is_active">
                                    <option value="1">ใช้งาน</option>
                                    <option value="0">ไม่ใช้งาน</option>
                                </select>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="sizes">ไซส์ (JSON)</label>
                            <input type="text" class="form-control" id="sizes" name="sizes" placeholder='S, M, L'>
                        </div>
                        <div class="form-group">
                            <label for="colors">สี (JSON)</label>
                            <input type="text" class="form-control" id="colors" name="colors" placeholder='แดง, น้ำเงิน'>
                        </div>
                        <div class="form-group">
                            <label for="productImage">รูปภาพสินค้า</label>
                            <input type="file" class="form-control-file" id="productImage" name="productImage" accept="image/*">
                            <div id="currentProductImage" class="mt-2">
                                <!-- Current image will be displayed here -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">ยกเลิก</button>
                            <button type="submit" class="btn btn-primary">บันทึกสินค้า</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
<?php include '_footer.php'; ?>
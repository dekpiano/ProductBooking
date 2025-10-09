
<!DOCTYPE html>
<html lang="en">

<head>
    <?php require_once('_head.php'); ?>
    <title>Admin - Categories</title>
</head>

<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <?php require_once('_sidebar.php'); ?>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <?php require_once('_navbar.php'); ?>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <h1 class="h3 mb-2 text-gray-800">จัดการหมวดหมู่</h1>

                    <!-- DataTales Example -->
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">เพิ่มหมวดหมู่ใหม่</h6>
                        </div>
                        <div class="card-body">
                            <form id="add-category-form">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="name">ชื่อหมวดหมู่</label>
                                        <input type="text" class="form-control" id="name" name="name" required>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="slug">Slug</label>
                                        <input type="text" class="form-control" id="slug" name="slug" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="description">รายละเอียด</label>
                                    <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="icon">ไอคอน</label>
                                        <input type="text" class="form-control" id="icon" name="icon">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="order_display">ลำดับการแสดงผล</label>
                                        <input type="number" class="form-control" id="order_display" name="order_display" value="0">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">เพิ่มหมวดหมู่</button>
                            </form>
                        </div>
                    </div>

                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">รายการหมวดหมู่</h6>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered" id="categories-table" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ไอคอน</th>
                                            <th>ชื่อ</th>
                                            <th>Slug</th>
                                            <th>ลำดับ</th>
                                            <th>การกระทำ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Data will be loaded here by DataTables -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <?php require_once('_footer.php'); ?>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>




    <!-- Logout Modal-->
    <?php require_once('_logout_modal.php'); ?>

    <?php require_once('_script.php'); ?>
    <script src="js/categories.js"></script>

</body>

</html>
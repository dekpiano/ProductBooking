document.addEventListener('DOMContentLoaded', function() {
    // --- Product Management Elements ---
    const productsTableBody = document.getElementById('productsTableBody');
    const productModalElement = $('#productModal'); // jQuery object for Bootstrap 4 modal
    const productForm = document.getElementById('productForm');
    const productIdInput = document.getElementById('productId');
    const productNameInput = document.getElementById('name');
    const productCategoryInput = document.getElementById('category');
    const productPriceInput = document.getElementById('price');
    const productDescriptionInput = document.getElementById('description');
    const productStockInput = document.getElementById('stock');
    const productIsActiveInput = document.getElementById('is_active'); // Corrected line
    const productSizesInput = document.getElementById('sizes');
    const productColorsInput = document.getElementById('colors');

    // --- Order Management Elements ---
    const ordersTableBody = document.getElementById('ordersTableBody');
    const paymentSlipModalElement = $('#paymentSlipModal'); // jQuery object for Bootstrap 4 modal
    const slipImage = document.getElementById('slipImage');
    const transferAmount = document.getElementById('transferAmount');
    const transferDate = document.getElementById('transferDate');
    const transferTime = document.getElementById('transferTime');
    const fromBank = document.getElementById('fromBank');
    const fromAccountName = document.getElementById('fromAccountName');

    // --- DataTables instances ---
    let productsDataTable;
    let ordersDataTable;

    // --- Product Management Functions ---
    async function fetchProducts() {
        const productsTable = $('#productsTable');
        if (productsTable.length === 0) return;

        try {
            const response = await fetch('../api/admin_get_products.php');
            const data = await response.json();

            if (data.success) {
                if ($.fn.DataTable.isDataTable('#productsTable')) {
                    productsTable.DataTable().destroy();
                }
                productsTableBody.innerHTML = ''; // Clear existing rows

                const productsData = data.products.map(product => [
                    product.id,
                    product.name,
                    product.category === 'bracelet' ? 'สร้อยข้อมือ' : product.category === 'shirt' ? 'เสื้อ' : 'ชุดคอมโบ',
                    parseFloat(product.price).toFixed(2),
                    product.stock,
                    product.is_active == 1 ? '<span class="badge badge-success">ใช้งาน</span>' : '<span class="badge badge-danger">ไม่ใช้งาน</span>',
                    `<button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i> แก้ไข</button>
                     <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i> ลบ</button>`
                ]);

                productsDataTable = productsTable.DataTable({
                    data: productsData,
                    columns: [
                        { title: "ID" },
                        { title: "ชื่อสินค้า" },
                        { title: "หมวดหมู่" },
                        { title: "ราคา" },
                        { title: "สต็อก" },
                        { title: "สถานะ" },
                        { title: "การดำเนินการ" }
                    ],
                    destroy: true,
                    responsive: true,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/th.json"
                    }
                });
            } else {
                Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อขณะดึงข้อมูลสินค้า', 'error');
        }
    }

    // --- Order Management Functions ---
    async function fetchOrders() {
        const ordersTable = $('#ordersTable');
        if (ordersTable.length === 0) return;

        try {
            const response = await fetch('../api/admin_get_orders.php');
            const data = await response.json();

            if (data.success) {
                if ($.fn.DataTable.isDataTable('#ordersTable')) {
                    ordersTable.DataTable().destroy();
                }
                ordersTableBody.innerHTML = '';

                const ordersData = data.orders.map(order => {
                    let actionsHtml = '';
                    let statusBadge = '';
                    switch (order.order_status) {
                        case 'รอชำระเงิน': statusBadge = '<span class="badge badge-warning">รอชำระเงิน</span>'; break;
                        case 'รอตรวจสอบการชำระเงิน': statusBadge = '<span class="badge badge-info">รอตรวจสอบการชำระเงิน</span>'; break;
                        case 'รอจัดส่ง': statusBadge = '<span class="badge badge-primary">รอจัดส่ง</span>'; break;
                        case 'จัดส่งแล้ว': statusBadge = '<span class="badge badge-secondary">จัดส่งแล้ว</span>'; break;
                        case 'สำเร็จ': statusBadge = '<span class="badge badge-success">สำเร็จ</span>'; break;
                        case 'ยกเลิก': statusBadge = '<span class="badge badge-danger">ยกเลิก</span>'; break;
                        default: statusBadge = '<span class="badge badge-light text-dark">ไม่ระบุ</span>';
                    }

                    if (order.slip_filename) {
                        actionsHtml += `<button class="btn btn-info btn-sm view-slip-btn mr-2" data-order-id="${order.order_id}"><i class="fas fa-eye"></i> ดูสลิป</button>`;
                    }
                    if (order.order_status === 'รอตรวจสอบการชำระเงิน' && order.slip_filename) {
                        actionsHtml += `<button class="btn btn-success btn-sm approve-payment-btn" data-order-id="${order.order_id}"><i class="fas fa-check"></i> อนุมัติ</button>`;
                    } else if (order.order_status === 'รอจัดส่ง') {
                        actionsHtml += `<button class="btn btn-danger btn-sm unapprove-payment-btn" data-order-id="${order.order_id}"><i class="fas fa-times"></i> ยกเลิกอนุมัติ</button>`;
                    }

                    return [
                        order.order_id,
                        `${order.first_name} ${order.last_name}`,
                        parseFloat(order.final_amount).toFixed(2),
                        statusBadge,
                        order.payment_method,
                        order.order_created_at,
                        actionsHtml
                    ];
                });

                ordersDataTable = ordersTable.DataTable({
                    data: ordersData,
                    columns: [
                        { title: "ID คำสั่งซื้อ" },
                        { title: "ลูกค้า" },
                        { title: "ยอดรวม" },
                        { title: "สถานะ" },
                        { title: "วิธีชำระเงิน" },
                        { title: "วันที่สั่งซื้อ" },
                        { title: "การดำเนินการ" }
                    ],
                    destroy: true,
                    responsive: true,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/th.json"
                    }
                });
            } else {
                Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อขณะดึงข้อมูลคำสั่งซื้อ', 'error');
        }
    }

    // --- Event Listeners for Product Management ---
    if (productsTableBody) {
        fetchProducts();

        // Handle Add New Product button click
        $('[data-target="#productModal"]').on('click', function() {
            productForm.reset();
            productIdInput.value = '';
            document.getElementById('productModalLabel').textContent = 'เพิ่มสินค้าใหม่';
            productModalElement.modal('show'); // Show Bootstrap 4 modal
        });

        $(productsTableBody).on('click', '.edit-btn', async function() {
            const productId = $(this).data('id');
            try {
                const response = await fetch(`../api/admin_get_products.php?id=${productId}`);
                const data = await response.json();

                if (data.success && data.products.length > 0) {
                    const product = data.products[0];
                    productIdInput.value = product.id;
                    productNameInput.value = product.name;
                    productCategoryInput.value = product.category;
                    productPriceInput.value = parseFloat(product.price).toFixed(2);
                    productDescriptionInput.value = product.description || '';
                    productStockInput.value = product.stock;
                    productIsActiveInput.value = product.is_active;
                    productSizesInput.value = product.sizes || '';
                    productColorsInput.value = product.colors || '';
                    document.getElementById('productModalLabel').textContent = 'แก้ไขสินค้า';
                    productModalElement.modal('show'); // Show Bootstrap 4 modal
                } else {
                    Swal.fire('ข้อผิดพลาด', 'ไม่พบรายละเอียดสินค้า: ' + data.message, 'error');
                }
            }
            catch (error) {
                console.error('Error:', error);
                Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อขณะดึงรายละเอียดสินค้า', 'error');
            }
        });

        $(productForm).on('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const url = productIdInput.value ? '../api/admin_update_product.php' : '../api/admin_create_product.php';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    Swal.fire('สำเร็จ', data.message, 'success');
                    productModalElement.modal('hide'); // Hide Bootstrap 4 modal
                    fetchProducts();
                } else {
                    Swal.fire('ข้อผิดพลาด', 'Error: ' + data.message, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการบันทึกสินค้า', 'error');
            }
        });

        $(productsTableBody).on('click', '.delete-btn', async function() {
            const productId = $(this).data('id');
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: 'คุณต้องการลบสินค้านี้ใช่หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, ลบเลย!',
                cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch('../api/admin_delete_product.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `id=${productId}`
                        });
                        const data = await response.json();

                        if (data.success) {
                            Swal.fire('ลบสำเร็จ!', data.message, 'success');
                            fetchProducts();
                        } else {
                            Swal.fire('ข้อผิดพลาด', 'Error: ' + data.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการลบสินค้า', 'error');
                    }
                }
            });
        });
    }

    // --- Event Listeners for Order Management ---
    if (ordersTableBody) {
        fetchOrders();

        $(ordersTableBody).on('click', '.view-slip-btn', async function() {
            const orderId = $(this).data('orderId');
            try {
                const response = await fetch(`../api/admin_get_orders.php?order_id=${orderId}`);
                const data = await response.json();

                if (data.success && data.orders.length > 0) {
                    const order = data.orders[0];
                    if (order.slip_filename) {
                        slipImage.src = `../uploads/slips/${order.slip_filename}`; // Adjust path as needed
                        transferAmount.textContent = parseFloat(order.transfer_amount).toFixed(2);
                        transferDate.textContent = order.transfer_date;
                        transferTime.textContent = order.transfer_time;
                        fromBank.textContent = order.from_bank || '-';
                        fromAccountName.textContent = order.from_account_name || '-';
                        paymentSlipModalElement.modal('show'); // Show Bootstrap 4 modal
                    } else {
                        Swal.fire('ไม่พบสลิป', 'ไม่พบสลิปการชำระเงินสำหรับคำสั่งซื้อนี้', 'info');
                    }
                } else {
                    Swal.fire('ข้อผิดพลาด', 'ไม่พบรายละเอียดคำสั่งซื้อ: ' + data.message, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อขณะดึงรายละเอียดคำสั่งซื้อ', 'error');
            }
            
        });

        $(ordersTableBody).on('click', '.approve-payment-btn', async function() {
            const orderId = $(this).data('orderId');
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: 'คุณต้องการอนุมัติการชำระเงินสำหรับคำสั่งซื้อนี้ใช่หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, อนุมัติเลย!',
                cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch('../api/admin_approve_order.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `order_id=${orderId}&action=approve`
                        });
                        const data = await response.json();

                        if (data.success) {
                            Swal.fire('อนุมัติสำเร็จ!', data.message, 'success');
                            fetchOrders();
                        } else {
                            Swal.fire('ข้อผิดพลาด', 'Error: ' + data.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการอนุมัติการชำระเงิน', 'error');
                    }
                }
            });
        });

        $(ordersTableBody).on('click', '.unapprove-payment-btn', async function() {
            const orderId = $(this).data('orderId');
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: 'คุณต้องการยกเลิกการอนุมัติสำหรับคำสั่งซื้อนี้ใช่หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ใช่, ยกเลิกอนุมัติเลย!',
                cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch('../api/admin_approve_order.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `order_id=${orderId}&action=unapprove`
                        });
                        const data = await response.json();

                        if (data.success) {
                            Swal.fire('ยกเลิกอนุมัติสำเร็จ!', data.message, 'success');
                            fetchOrders();
                        } else {
                            Swal.fire('ข้อผิดพลาด', 'Error: ' + data.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการยกเลิกการอนุมัติ', 'error');
                    }
                }
            });
        });
    }

    // SB Admin 2 Sidebar Toggle
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };
        
        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the sidebar is toggled
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var o = $('.sidebar');
            var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
            var scrollTop = o.scrollTop();
            if (scrollTop === 0 && delta > 0) {
                o.scrollTop(-1);
                e.preventDefault();
            } else if (o.get(0).scrollHeight - o.scrollTop() === o.height() && delta < 0) {
                o.scrollTop(o.scrollTop() + 1);
                e.preventDefault();
            }
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });
});
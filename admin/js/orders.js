document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const ordersTableBody = document.getElementById('ordersTableBody');
    const paymentSlipModal = $('#paymentSlipModal');
    const slipImage = document.getElementById('slipImage');
    const transferAmountSpan = document.getElementById('transferAmount');
    const transferDateSpan = document.getElementById('transferDate');
    const transferTimeSpan = document.getElementById('transferTime');
    const fromBankSpan = document.getElementById('fromBank');
    const fromAccountNameSpan = document.getElementById('fromAccountName');

    let dataTable; // For DataTables instance

    const fetchOrders = async () => {
        try {
            const response = await fetch('../api/admin/admin_get_orders.php'); // Updated API path
            const data = await response.json();

            if (data.success) {
                renderOrders(data.orders);
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            Swal.fire('Error', 'Failed to fetch orders.', 'error');
        }
    };

    const renderOrders = (orders) => {
        if (dataTable) {
            dataTable.destroy();
        }
        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const row = ordersTableBody.insertRow();
            let statusClass = '';
            switch(order.status) {
                case 'รอชำระเงิน': statusClass = 'badge-warning'; break;
                case 'รอตรวจสอบการชำระเงิน': statusClass = 'badge-info'; break;
                case 'ชำระเงินแล้ว': statusClass = 'badge-success'; break;
                default: statusClass = 'badge-secondary';
            }

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer_first_name} ${order.customer_last_name} (${order.customer_phone})</td>
                <td>฿${parseFloat(order.final_amount).toLocaleString()}</td>
                <td><span class="badge ${statusClass}">${order.status}</span></td>
                <td>${order.payment_method}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>
                    <button class="btn btn-info btn-sm view-slip-btn" data-order-id="${order.id}" ${order.status === 'รอชำระเงิน' ? 'disabled' : ''}>
                        <i class="fas fa-eye"></i> ดูสลิป
                    </button>
                    <button class="btn btn-success btn-sm approve-btn" data-order-id="${order.id}" ${order.status !== 'รอตรวจสอบการชำระเงิน' ? 'disabled' : ''}>
                        <i class="fas fa-check"></i> อนุมัติ
                    </button>
                    <button class="btn btn-danger btn-sm unapprove-btn" data-order-id="${order.id}" ${order.status !== 'ชำระเงินแล้ว' ? 'disabled' : ''}>
                        <i class="fas fa-times"></i> ไม่อนุมัติ
                    </button>
                </td>
            `;
        });

        dataTable = $('#ordersTable').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Thai.json"
            },
            "order": [[ 5, "desc" ]] // Order by created_at (6th column, 0-indexed)
        });
    };

    // Event Listeners for action buttons
    $(document).on('click', '.view-slip-btn', async function() {
        const orderId = $(this).data('order-id');
        try {
            const response = await fetch(`../api/admin/admin_get_order_details.php?order_id=${orderId}`); // Assuming a new API for details
            const data = await response.json();

            if (data.success && data.order && data.payment_confirmation) {
                const paymentConf = data.payment_confirmation;
                slipImage.src = `../${paymentConf.slip_path}`; // Adjust path as needed
                transferAmountSpan.textContent = parseFloat(paymentConf.transfer_amount).toLocaleString();
                transferDateSpan.textContent = paymentConf.transfer_date;
                transferTimeSpan.textContent = paymentConf.transfer_time;
                fromBankSpan.textContent = paymentConf.from_bank || '-';
                fromAccountNameSpan.textContent = paymentConf.from_account_name || '-';
                paymentSlipModal.modal('show');
            } else {
                Swal.fire('Error', data.message || 'Failed to fetch payment slip details.', 'error');
            }
        } catch (error) {
            console.error('Error fetching slip details:', error);
            Swal.fire('Error', 'Failed to fetch payment slip details.', 'error');
        }
    });

    $(document).on('click', '.approve-btn, .unapprove-btn', async function() {
        const orderId = $(this).data('order-id');
        const action = $(this).hasClass('approve-btn') ? 'approve' : 'unapprove';
        const confirmText = action === 'approve' ? 'คุณแน่ใจหรือไม่ที่จะอนุมัติการชำระเงินนี้?' : 'คุณแน่ใจหรือไม่ที่จะไม่อนุมัติการชำระเงินนี้?';
        const successText = action === 'approve' ? 'อนุมัติการชำระเงินแล้ว!' : 'ยกเลิกการอนุมัติการชำระเงินแล้ว!';

        Swal.fire({
            title: 'ยืนยันการดำเนินการ',
            text: confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ดำเนินการ!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    formData.append('order_id', orderId);
                    formData.append('action', action);

                    const response = await fetch('../api/admin/admin_approve_order.php', { // Updated API path
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.success) {
                        Swal.fire('สำเร็จ!', successText, 'success');
                        fetchOrders(); // Reload orders table
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                } catch (error) {
                    console.error('Error processing order action:', error);
                    Swal.fire('Error', 'Failed to process order action.', 'error');
                }
            }
        });
    });

    // Initial fetch
    fetchOrders();
});
document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodsTableBody = document.querySelector('#paymentMethodsTable tbody');
    const paymentMethodModal = $('#paymentMethodModal');
    const paymentMethodForm = document.getElementById('paymentMethodForm');
    const paymentMethodIdInput = document.getElementById('paymentMethodId');
    const paymentMethodNameInput = document.getElementById('paymentMethodName');
    const paymentMethodTypeSelect = document.getElementById('paymentMethodType');
    const bankTransferFields = document.getElementById('bankTransferFields');
    const promptpayFields = document.getElementById('promptpayFields');
    const accountNameInput = document.getElementById('accountName');
    const accountNumberInput = document.getElementById('accountNumber');
    const bankNameInput = document.getElementById('bankName');
    const promptpayIdInput = document.getElementById('promptpayId');
    const qrCodeImageInput = document.getElementById('qrCodeImage');
    const currentQrCodeImageDiv = document.getElementById('currentQrCodeImage');
    const isActiveCheckbox = document.getElementById('isActive');
    const addPaymentMethodBtn = document.getElementById('addPaymentMethodBtn');

    let dataTable;

    const toggleMethodFields = () => {
        const selectedType = paymentMethodTypeSelect.value;
        bankTransferFields.classList.add('d-none');
        promptpayFields.classList.add('d-none');

        if (selectedType === 'bank_transfer') {
            bankTransferFields.classList.remove('d-none');
        } else if (selectedType === 'promptpay') {
            promptpayFields.classList.remove('d-none');
        }
    };

    paymentMethodTypeSelect.addEventListener('change', toggleMethodFields);

    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch('../api/admin/admin_get_payment_methods.php');
            const data = await response.json();

            if (data.success) {
                renderPaymentMethods(data.paymentMethods);
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            Swal.fire('Error', 'Failed to fetch payment methods.', 'error');
        }
    };

    const renderPaymentMethods = (paymentMethods) => {
        if (dataTable) {
            dataTable.destroy();
        }
        paymentMethodsTableBody.innerHTML = '';
        paymentMethods.forEach(method => {
            const row = paymentMethodsTableBody.insertRow();
            row.innerHTML = `
                <td>${method.id}</td>
                <td>${method.name}</td>
                <td>${method.type}</td>
                <td>${method.account_name || '-'}</td>
                <td>${method.account_number || '-'}</td>
                <td>${method.bank_name || '-'}</td>
                <td>${method.promptpay_id || '-'}</td>
                <td>${method.qr_code_image ? `<img src="../uploads/promptpay/${method.qr_code_image}" width="50">` : '-'}</td>
                <td>${method.is_active == 1 ? '<span class="badge badge-success">ใช้งาน</span>' : '<span class="badge badge-danger">ไม่ใช้งาน</span>'}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${method.id}">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${method.id}">
                        <i class="fas fa-trash"></i> ลบ
                    </button>
                </td>
            `;
        });

        dataTable = $('#paymentMethodsTable').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Thai.json"
            }
        });
    };

    addPaymentMethodBtn.addEventListener('click', () => {
        paymentMethodForm.reset();
        paymentMethodIdInput.value = '';
        paymentMethodModal.find('.modal-title').text('เพิ่มวิธีชำระเงินใหม่');
        isActiveCheckbox.checked = true; // Default to active
        qrCodeImageInput.value = ''; // Clear file input
        currentQrCodeImageDiv.innerHTML = ''; // Clear current image display
        toggleMethodFields(); // Hide/show fields based on default type
    });

    $(document).on('click', '.edit-btn', async function() {
        const id = $(this).data('id');
        try {
            const response = await fetch(`../api/admin/admin_get_payment_methods.php?id=${id}`);
            const data = await response.json();

            if (data.success && data.paymentMethods.length > 0) {
                const method = data.paymentMethods[0];
                paymentMethodIdInput.value = method.id;
                paymentMethodNameInput.value = method.name;
                paymentMethodTypeSelect.value = method.type;
                accountNameInput.value = method.account_name;
                accountNumberInput.value = method.account_number;
                bankNameInput.value = method.bank_name;
                promptpayIdInput.value = method.promptpay_id;
                // qrCodeImageInput.value = method.qr_code_image; // Don't set value for file input
                isActiveCheckbox.checked = method.is_active == 1;

                // Display current QR Code image
                currentQrCodeImageDiv.innerHTML = ''; // Clear previous
                if (method.qr_code_image) {
                    const img = document.createElement('img');
                    img.src = `../${method.qr_code_image}`;
                    img.alt = 'QR Code';
                    img.style.maxWidth = '100px';
                    img.style.maxHeight = '100px';
                    currentQrCodeImageDiv.appendChild(img);
                }

                qrCodeImageInput.value = ''; // Clear file input for new upload

                toggleMethodFields();
                paymentMethodModal.find('.modal-title').text('แก้ไขวิธีชำระเงิน');
                paymentMethodModal.modal('show');
            } else {
                Swal.fire('Error', 'Payment method not found.', 'error');
            }
        } catch (error) {
            console.error('Error fetching payment method for edit:', error);
            Swal.fire('Error', 'Failed to fetch payment method details.', 'error');
        }
    });

    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณต้องการลบวิธีชำระเงินนี้หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    formData.append('id', id);

                    const response = await fetch('../api/admin/admin_delete_payment_method.php', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.success) {
                        Swal.fire('ลบแล้ว!', 'วิธีชำระเงินถูกลบเรียบร้อยแล้ว.', 'success');
                        fetchPaymentMethods();
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                } catch (error) {
                    console.error('Error deleting payment method:', error);
                    Swal.fire('Error', 'Failed to delete payment method.', 'error');
                }
            }
        });
    });

    paymentMethodForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = paymentMethodIdInput.value;
        const name = paymentMethodNameInput.value;
        const type = paymentMethodTypeSelect.value;
        const account_name = accountNameInput.value;
        const account_number = accountNumberInput.value;
        const bank_name = bankNameInput.value;
        const promptpay_id = promptpayIdInput.value;
        // const qr_code_image = qrCodeImageInput.value; // This will be handled by FormData
        const is_active = isActiveCheckbox.checked ? 1 : 0;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('account_name', account_name);
        formData.append('account_number', account_number);
        formData.append('bank_name', bank_name);
        formData.append('promptpay_id', promptpay_id);
        // Append image file if selected
        if (qrCodeImageInput.files.length > 0) {
            formData.append('qrCodeImage', qrCodeImageInput.files[0]);
        }
        formData.append('is_active', is_active);

        let url = '';
        if (id) {
            url = '../api/admin/admin_update_payment_method.php';
            formData.append('id', id);
        } else {
            url = '../api/admin/admin_create_payment_method.php';
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                Swal.fire('สำเร็จ!', data.message, 'success');
                paymentMethodModal.modal('hide');
                fetchPaymentMethods();
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error('Error saving payment method:', error);
            Swal.fire('Error', 'Failed to save payment method.', 'error');
        }
    });

    // Initial fetch
    fetchPaymentMethods();
});
document.addEventListener('DOMContentLoaded', () => {
    const contactsTableBody = document.querySelector('#contactsTable tbody');
    const contactModal = $('#contactModal');
    const contactForm = document.getElementById('contactForm');
    const contactIdInput = document.getElementById('contactId');
    const contactNameInput = document.getElementById('contactName');
    const contactValueInput = document.getElementById('contactValue');
    const contactIconInput = document.getElementById('contactIcon');
    const addContactBtn = document.getElementById('addContactBtn');

    let dataTable;

    const fetchContacts = async () => {
        try {
            const response = await fetch('../api/admin/admin_get_contacts.php');
            const data = await response.json();

            if (data.success) {
                renderContacts(data.contacts);
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            Swal.fire('Error', 'Failed to fetch contacts.', 'error');
        }
    };

    const renderContacts = (contacts) => {
        if (dataTable) {
            dataTable.destroy();
        }
        contactsTableBody.innerHTML = '';
        contacts.forEach(contact => {
            const row = contactsTableBody.insertRow();
            row.innerHTML = `
                <td>${contact.id}</td>
                <td>${contact.name}</td>
                <td>${contact.value}</td>
                <td><i class="${contact.icon}"></i> ${contact.icon}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${contact.id}" data-name="${contact.name}" data-value="${contact.value}" data-icon="${contact.icon}">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${contact.id}">
                        <i class="fas fa-trash"></i> ลบ
                    </button>
                </td>
            `;
        });

        dataTable = $('#contactsTable').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Thai.json"
            }
        });
    };

    addContactBtn.addEventListener('click', () => {
        contactForm.reset();
        contactIdInput.value = '';
        contactModal.find('.modal-title').text('เพิ่มผู้ติดต่อใหม่');
    });

    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const value = $(this).data('value');
        const icon = $(this).data('icon');

        contactIdInput.value = id;
        contactNameInput.value = name;
        contactValueInput.value = value;
        contactIconInput.value = icon;

        contactModal.find('.modal-title').text('แก้ไขผู้ติดต่อ');
        contactModal.modal('show');
    });

    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณต้องการลบผู้ติดต่อนี้หรือไม่?",
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

                    const response = await fetch('../api/admin/admin_delete_contact.php', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.success) {
                        Swal.fire('ลบแล้ว!', 'ผู้ติดต่อถูกลบเรียบร้อยแล้ว.', 'success');
                        fetchContacts();
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                } catch (error) {
                    console.error('Error deleting contact:', error);
                    Swal.fire('Error', 'Failed to delete contact.', 'error');
                }
            }
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = contactIdInput.value;
        const name = contactNameInput.value;
        const value = contactValueInput.value;
        const icon = contactIconInput.value;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('value', value);
        formData.append('icon', icon);

        let url = '';
        if (id) {
            url = '../api/admin/admin_update_contact.php';
            formData.append('id', id);
        } else {
            url = '../api/admin_create_contact.php';
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                Swal.fire('สำเร็จ!', data.message, 'success');
                contactModal.modal('hide');
                fetchContacts();
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error('Error saving contact:', error);
            Swal.fire('Error', 'Failed to save contact.', 'error');
        }
    });

    // Initial fetch
    fetchContacts();
});
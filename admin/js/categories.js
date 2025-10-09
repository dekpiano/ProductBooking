$(document).ready(function() {
    // Function to fetch and display categories
    function loadCategories() {
        if ($.fn.DataTable.isDataTable('#categories-table')) {
            $('#categories-table').DataTable().destroy();
        }
        $('#categories-table').DataTable({
            "ajax": {
                "url": "../api/admin/admin_get_categories.php",
                "type": "GET",
                "dataSrc": "data"
            },
            "columns": [
                { "data": "id" },
                { "data": "icon" },
                { "data": "name" },
                { "data": "slug" },
                { "data": "order_display" },
                {
                    "data": null,
                    "render": function(data, type, row) {
                        return `<button class="btn btn-sm btn-warning btn-edit" data-id="${row.id}">แก้ไข</button> 
                                <button class="btn btn-sm btn-danger btn-delete" data-id="${row.id}">ลบ</button>`;
                    }
                }
            ]
        });
    }

    // Initial load of categories
    loadCategories();

    // Handle form submission for adding a new category
    $('#add-category-form').on('submit', function(e) {
        e.preventDefault();
        var formData = $(this).serialize();

        $.ajax({
            type: 'POST',
            url: '../api/admin/admin_create_category.php',
            data: formData,
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    $('#add-category-form')[0].reset();
                    loadCategories(); // Reload the table
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('An error occurred while adding the category.');
            }
        });
    });

    // Note: Edit and Delete functionality will require additional API endpoints and modal dialogs.
    // The buttons are prepared for future implementation.

});

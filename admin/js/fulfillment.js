$(document).ready(function() {
    var fulfillmentTable = $('#fulfillmentTable').DataTable({
        "ajax": {
            "url": "../api/admin/admin_get_paid_orders_for_fulfillment.php",
            "type": "GET",
            "dataSrc": "orders"
        },
        "columns": [
            { "data": "order_id" },
            { "data": null, "render": function(data, type, row) {
                return row.first_name + ' ' + row.last_name;
            }},
            { "data": "phone" },
            { "data": "items", "render": function(data, type, row) {
                let itemsHtml = '<ul class="list-unstyled">';
                data.forEach(item => {
                    let details = '';
                    if (item.category === 'shirt') {
                        details += ` (${item.gender}, ไซส์ ${item.size})`;
                    }
                    itemsHtml += `<li>${item.product_name} x ${item.quantity} ${details}</li>`;
                });
                itemsHtml += '</ul>';
                return itemsHtml;
            }},
            { "data": "final_amount", "render": function(data, type, row) {
                return '฿' + parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            }},
            { "data": "created_at", "render": function(data, type, row) {
                return new Date(data).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            }},
            { "data": null, "render": function(data, type, row) {
                return '<span class="badge badge-success">ชำระเงินแล้ว</span>';
            }}
        ],
        "order": [[ 5, "desc" ]], // Order by created_at descending
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Thai.json"
        }
    });

    // Optional: Refresh data periodically
    // setInterval(function() {
    //     fulfillmentTable.ajax.reload(null, false); // user paging is not reset on reload
    // }, 30000); // Refresh every 30 seconds
});
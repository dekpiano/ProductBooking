$(document).ready(function() {
    // Function to fetch and update dashboard stats
    function updateDashboardStats() {
        // Fetch Product Count
        $.ajax({
            url: '../api/admin/admin_get_product_count.php',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#totalProductsCount').text(response.product_count);
                } else {
                    console.error('Error fetching product count:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error fetching product count:', status, error);
            }
        });

        // Fetch Order Summary
        $.ajax({
            url: '../api/admin/admin_get_order_summary.php',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#totalOrdersCount').text(response.data.total_orders);
                    $('#pendingPaymentOrdersCount').text(response.data.pending_payment_orders);
                    $('#pendingVerificationOrdersCount').text(response.data.pending_verification_orders);
                    $('#paidOrdersCount').text(response.data.paid_orders);
                    // For total revenue, format it as currency
                    $('#totalRevenueAmount').text('฿' + parseFloat(response.data.total_revenue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
                } else {
                    console.error('Error fetching order summary:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error fetching order summary:', status, error);
            }
        });
    }

    // Call the function to update stats when the page loads
    updateDashboardStats();

    // You might want to refresh stats periodically
    // setInterval(updateDashboardStats, 60000); // Refresh every 60 seconds
});
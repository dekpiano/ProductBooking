document.addEventListener('DOMContentLoaded', function() {
        // Product prices
        const prices = {
            lipstick: 100,
            shirt: 300
        };

        let selectedLipstick = null;
        let selectedShirt = null;
        let selectedSize = null;
        let isCombo = false;
        let braceletQuantity = 1;
        let shirtQuantity = 1;
        let comboQuantity = 1;

        // Quantity management functions
        window.updateQuantity = function(product, change) {
            if (product === 'bracelet') {
                const qtyInput = document.getElementById('braceletQty');
                let newQty = parseInt(qtyInput.value) + change;
                if (change === 0) newQty = parseInt(qtyInput.value); // Direct input change
                
                if (newQty < 1) newQty = 1;
                
                braceletQuantity = newQty;
                qtyInput.value = newQty;
            } else if (product === 'shirt') {
                const qtyInput = document.getElementById('shirtQty');
                let newQty = parseInt(qtyInput.value) + change;
                if (change === 0) newQty = parseInt(qtyInput.value); // Direct input change
                
                if (newQty < 1) newQty = 1;
                
                shirtQuantity = newQty;
                qtyInput.value = newQty;
            }
            
            updatePriceDisplay();
        }



        // Step 1: Product Selection Logic
        function updatePriceDisplay() {
            const priceBreakdown = document.getElementById('priceBreakdown');
            const totalPriceEl = document.getElementById('totalPrice');
            const nextBtn = document.getElementById('nextStep1');
            const comboSavings = document.getElementById('comboSavings');
            
            let total = 0;
            let breakdown = [];

            // Calculate when both products are selected (auto combo) - but only if shirt has size selected
            if (selectedLipstick && selectedShirt && selectedSize) {
                // Calculate combo sets (minimum quantity)
                const comboSets = Math.min(braceletQuantity, shirtQuantity);
                
                if (comboSets > 0) {
                    // Combo pricing
                    const comboTotal = 350 * comboSets;
                    const regularComboTotal = (prices.lipstick + prices.shirt) * comboSets;
                    const comboSavings = regularComboTotal - comboTotal;
                    
                    breakdown.push(`🎁 คอมโบพิเศษ: กำไลข้อมือ + เสื้อ (${selectedSize}) (${comboSets} ชุด)`);
                    breakdown.push(`ราคาพิเศษ: ฿350 × ${comboSets} = ฿${comboTotal.toLocaleString()}`);
                    breakdown.push(`<span class="text-green-600">ประหยัด: ฿${comboSavings.toLocaleString()}</span>`);
                    total += comboTotal;
                    
                    // Calculate remaining items at regular price
                    const remainingBracelets = braceletQuantity - comboSets;
                    const remainingShirts = shirtQuantity - comboSets;
                    
                    if (remainingBracelets > 0) {
                        const remainingBraceletTotal = prices.lipstick * remainingBracelets;
                        breakdown.push(`กำไลข้อมือเพิ่มเติม (${remainingBracelets} ชิ้น): ฿${remainingBraceletTotal.toLocaleString()}`);
                        total += remainingBraceletTotal;
                    }
                    
                    if (remainingShirts > 0) {
                        const remainingShirtTotal = prices.shirt * remainingShirts;
                        breakdown.push(`เสื้อผ้าเพิ่มเติม (${selectedSize}) (${remainingShirts} ตัว): ฿${remainingShirtTotal.toLocaleString()}`);
                        total += remainingShirtTotal;
                    }
                    
                    // Update combo savings display
                    document.getElementById('comboSavings').textContent = `ประหยัด ฿${comboSavings.toLocaleString()}`;
                }
            } else {
                // Calculate individual items only
                if (selectedLipstick) {
                    const braceletTotal = prices.lipstick * braceletQuantity;
                    breakdown.push(`กำไลข้อมือ (${braceletQuantity} ชิ้น): ฿${braceletTotal.toLocaleString()}`);
                    total += braceletTotal;
                }

                if (selectedShirt && selectedSize) {
                    const shirtTotal = prices.shirt * shirtQuantity;
                    breakdown.push(`เสื้อผ้า (${selectedSize}) (${shirtQuantity} ตัว): ฿${shirtTotal.toLocaleString()}`);
                    total += shirtTotal;
                } else if (selectedShirt && !selectedSize) {
                    // Show warning when shirt is selected but no size chosen
                    breakdown.push(`<div class="text-red-600">⚠️ กรุณาเลือกไซส์เสื้อ</div>`);
                }
                
                // Reset combo savings display
                document.getElementById('comboSavings').textContent = 'ประหยัด ฿50';
            }

            if (breakdown.length === 0) {
                priceBreakdown.innerHTML = '<div>กรุณาเลือกสินค้า</div>';
                totalPriceEl.textContent = '฿0';
                nextBtn.disabled = true;
            } else {
                priceBreakdown.innerHTML = breakdown.map(item => `<div>${item}</div>`).join('');
                totalPriceEl.textContent = `฿${total.toLocaleString()}`;
                
                // Enable next button only if:
                // 1. Only bracelet selected (no size needed), OR
                // 2. Only shirt selected AND size is selected, OR  
                // 3. Both selected AND size is selected
                const hasValidBraceletOnly = selectedLipstick && !selectedShirt;
                const hasValidShirtOnly = !selectedLipstick && selectedShirt && selectedSize;
                const hasValidCombo = selectedLipstick && selectedShirt && selectedSize;
                
                const hasCompleteSelection = hasValidBraceletOnly || hasValidShirtOnly || hasValidCombo;
                nextBtn.disabled = !hasCompleteSelection;
            }
        }

        // Helper function to get shirt name
        function getShirtName(shirtValue) {
            return 'เสื้อผ้า';
        }

        // Event listeners for product selection
        document.getElementById('lipstickCheckbox').addEventListener('change', function() {
            selectedLipstick = this.checked ? this.value : null;
            
            // Update visual selection
            if (this.checked) {
                this.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                document.getElementById('braceletQuantity').classList.remove('hidden');
            } else {
                this.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
                document.getElementById('braceletQuantity').classList.add('hidden');
                braceletQuantity = 1;
                document.getElementById('braceletQty').value = 1;
            }
            
            checkComboStatus();
            updatePriceDisplay();
        });

        document.getElementById('shirtCheckbox').addEventListener('change', function() {
            selectedShirt = this.checked ? this.value : null;
            
            // Update visual selection
            if (this.checked) {
                this.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                document.getElementById('sizeSelection').classList.remove('hidden');
                document.getElementById('shirtQuantity').classList.remove('hidden');
            } else {
                this.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
                document.getElementById('sizeSelection').classList.add('hidden');
                document.getElementById('shirtQuantity').classList.add('hidden');
                // Reset size selection when shirt is unchecked
                selectedSize = null;
                shirtQuantity = 1;
                document.getElementById('shirtQty').value = 1;
                document.querySelectorAll('input[name="size"]').forEach(r => {
                    r.checked = false;
                    r.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
                });
            }
            
            checkComboStatus();
            updatePriceDisplay();
        });

        document.querySelectorAll('input[name="size"]').forEach(radio => {
            radio.addEventListener('change', function() {
                selectedSize = this.value;
                // Update visual selection for size buttons
                document.querySelectorAll('input[name="size"]').forEach(r => {
                    r.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
                });
                this.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                checkComboStatus();
                updatePriceDisplay();
            });
        });

        // Function to check and update combo status automatically
        function checkComboStatus() {
            const comboCheckbox = document.getElementById('comboOption');
            const comboContainer = comboCheckbox.closest('.mt-8');
            const comboQuantityDiv = document.getElementById('comboQuantity');
            
            // Auto-check combo if both products are selected AND size is selected
            if (selectedLipstick && selectedShirt && selectedSize) {
                isCombo = true;
                comboCheckbox.checked = true;
                comboContainer.classList.add('border-green-300', 'bg-green-50');
                comboContainer.classList.remove('border-purple-200');
                
                // Auto-calculate combo quantity based on minimum of both products
                const maxComboSets = Math.min(braceletQuantity, shirtQuantity);
                comboQuantity = maxComboSets;
            } else {
                isCombo = false;
                comboCheckbox.checked = false;
                comboContainer.classList.remove('border-green-300', 'bg-green-50');
                comboContainer.classList.add('border-purple-200');
                comboQuantity = 1;
            }
        }

        document.getElementById('comboOption').addEventListener('change', function() {
            // Combo checkbox is now read-only, controlled by checkComboStatus()
            // Prevent manual changes by reverting to auto-calculated state
            checkComboStatus();
        });

        // Step navigation functions
        window.goBackToStep1 = function() {
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step1').classList.remove('hidden');
            document.getElementById('step1').classList.add('fade-in');
        }

        window.goBackToStep2 = function() {
            document.getElementById('step3').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('step2').classList.add('fade-in');
        }

        window.goBackToStep3 = function() {
            document.getElementById('step4').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('step3').classList.add('fade-in');
            
            // Reset payment processing button
            const processBtn = document.getElementById('processPayment');
            processBtn.innerHTML = 'ดำเนินการชำระเงิน 💳';
            processBtn.disabled = false;
        }

        // Step navigation
        document.getElementById('nextStep1').addEventListener('click', function() {
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('step2').classList.add('fade-in');
        });

        // Customer form submission
        document.getElementById('customerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!firstName || !lastName || !phone) {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }

            // Show order summary
            showOrderSummary(firstName, lastName, phone);
            
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('step3').classList.add('fade-in');
        });

        function showOrderSummary(firstName, lastName, phone) {
            const orderDetails = document.getElementById('finalOrderDetails');
            let total = 0;
            let items = [];

            // Calculate when both products are selected (auto combo)
            if (selectedLipstick && selectedShirt && selectedSize) {
                // Calculate combo sets (minimum quantity)
                const comboSets = Math.min(braceletQuantity, shirtQuantity);
                
                if (comboSets > 0) {
                    // Combo pricing
                    const comboTotal = 350 * comboSets;
                    const regularComboTotal = (prices.lipstick + prices.shirt) * comboSets;
                    const comboSavings = regularComboTotal - comboTotal;
                    
                    items.push(`🎁 คอมโบพิเศษ: กำไลข้อมือ + เสื้อ (${comboSets} ชุด)`);
                    items.push(`ราคาพิเศษ: ฿350 × ${comboSets} = ฿${comboTotal.toLocaleString()}`);
                    items.push(`<span class="text-green-600">ประหยัด: ฿${comboSavings.toLocaleString()}</span>`);
                    total += comboTotal;
                    
                    // Calculate remaining items at regular price
                    const remainingBracelets = braceletQuantity - comboSets;
                    const remainingShirts = shirtQuantity - comboSets;
                    
                    if (remainingBracelets > 0) {
                        const remainingBraceletTotal = prices.lipstick * remainingBracelets;
                        items.push(`กำไลข้อมือเพิ่มเติม (${remainingBracelets} ชิ้น): ฿${remainingBraceletTotal.toLocaleString()}`);
                        total += remainingBraceletTotal;
                    }
                    
                    if (remainingShirts > 0) {
                        const remainingShirtTotal = prices.shirt * remainingShirts;
                        items.push(`เสื้อผ้าเพิ่มเติม (${selectedSize}) (${remainingShirts} ตัว): ฿${remainingShirtTotal.toLocaleString()}`);
                        total += remainingShirtTotal;
                    }
                }
            } else {
                // Calculate individual items only
                if (selectedLipstick) {
                    const braceletTotal = prices.lipstick * braceletQuantity;
                    items.push(`กำไลข้อมือ (${braceletQuantity} ชิ้น): ฿${braceletTotal.toLocaleString()}`);
                    total += braceletTotal;
                }

                if (selectedShirt && selectedSize) {
                    const shirtTotal = prices.shirt * shirtQuantity;
                    items.push(`เสื้อผ้า (${selectedSize}) (${shirtQuantity} ตัว): ฿${shirtTotal.toLocaleString()}`);
                    total += shirtTotal;
                }
            }

            orderDetails.innerHTML = `
                <div class="space-y-3">
                    <div>
                        <div class="font-semibold text-gray-700">สินค้า:</div>
                        ${items.map(item => `<div class="ml-4 text-gray-600">${item}</div>`).join('')}
                    </div>
                    <div class="border-t pt-3">
                        <div class="font-semibold text-gray-700">ข้อมูลลูกค้า:</div>
                        <div class="ml-4 text-gray-600">
                            <div>ชื่อ: ${firstName} ${lastName}</div>
                            <div>เบอร์โทร: ${phone}</div>
                        </div>
                    </div>
                    <div class="border-t pt-3">
                        <div class="text-xl font-bold text-purple-600">ยอดรวม: ฿${total.toLocaleString()}</div>
                    </div>
                </div>
            `;
        }

        // Payment method switching
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const bankDetails = document.getElementById('bankTransferDetails');
                const promptpayDetails = document.getElementById('promptpayDetails');
                
                if (this.value === 'bank-transfer') {
                    bankDetails.classList.remove('hidden');
                    promptpayDetails.classList.add('hidden');
                } else if (this.value === 'promptpay') {
                    bankDetails.classList.add('hidden');
                    promptpayDetails.classList.remove('hidden');
                }
            });
        });

        // Payment processing
        document.getElementById('processPayment').addEventListener('click', function() {
            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
            
            // Simulate payment processing
            this.innerHTML = 'กำลังดำเนินการ... ⏳';
            this.disabled = true;
            
            setTimeout(() => {
                // Generate order number
                const orderNumber = 'ORD' + Date.now().toString().slice(-8);
                
                // Show order summary in confirmation step
                showConfirmationOrderSummary(orderNumber);
                
                // Set today's date and current time as default
                const today = new Date();
                document.getElementById('transferDate').value = today.toISOString().split('T')[0];
                document.getElementById('transferTime').value = today.toTimeString().slice(0, 5);
                
                // Set expected transfer amount
                let total = 0;
                if (isCombo && selectedLipstick && selectedShirt && selectedSize) {
                    total = 350 * comboQuantity;
                } else {
                    if (selectedLipstick) total += prices.lipstick * braceletQuantity;
                    if (selectedShirt && selectedSize) total += prices.shirt * shirtQuantity;
                }
                document.getElementById('transferAmount').value = total;
                
                document.getElementById('step3').classList.add('hidden');
                document.getElementById('step4').classList.remove('hidden');
                document.getElementById('step4').classList.add('fade-in');
            }, 2000);
        });

        // Sample orders data - โครงสร้างฐานข้อมูลรองรับจำนวนสินค้าแล้ว
        let orders = [
            {
                id: 'ORD12345678',
                customerName: 'สมชาย ใจดี',
                phone: '081-234-5678',
                items: ['กำไลข้อมือยาง (2 ชิ้น)', 'เสื้อผ้า (M) (1 ตัว)'], // จำนวนเก็บใน items
                total: 500,
                status: 'รอชำระเงิน',
                date: '2024-01-15',
                isCombo: false,
                // ข้อมูลเพิ่มเติมที่สามารถเก็บได้
                quantities: { bracelet: 2, shirt: 1 }, // เก็บจำนวนแยกตามประเภท
                sizes: { shirt: 'M' } // เก็บไซส์แยกตามประเภท
            },
            {
                id: 'ORD12345679',
                customerName: 'สมหญิง รักสวย',
                phone: '082-345-6789',
                items: ['คอมโบพิเศษ: กำไลข้อมือ + เสื้อผ้า (L) (1 ชุด)'],
                total: 350,
                status: 'รอตรวจสอบการชำระเงิน',
                date: '2024-01-14',
                isCombo: true,
                quantities: { bracelet: 1, shirt: 1 },
                sizes: { shirt: 'L' },
                paymentData: {
                    transferAmount: 350,
                    transferDate: '2024-01-14',
                    transferTime: '14:30',
                    fromBank: 'กสิกรไทย',
                    fromAccountName: 'สมหญิง รักสวย'
                }
            },
            {
                id: 'ORD12345680',
                customerName: 'วิชัย มั่นคง',
                phone: '083-456-7890',
                items: ['เสื้อผ้า (XL) (3 ตัว)'],
                total: 900,
                status: 'จัดส่งแล้ว',
                date: '2024-01-13',
                isCombo: false,
                quantities: { shirt: 3 },
                sizes: { shirt: 'XL' }
            },
            {
                id: 'ORD12345681',
                customerName: 'นิดา สุขใจ',
                phone: '084-567-8901',
                items: ['กำไลข้อมือยาง (1 ชิ้น)'],
                total: 100,
                status: 'สำเร็จ',
                date: '2024-01-12',
                isCombo: false,
                quantities: { bracelet: 1 }
            },
            {
                id: 'ORD12345682',
                customerName: 'อรุณ ยิ้มแย้ม',
                phone: '085-678-9012',
                items: ['กำไลข้อมือยาง (3 ชิ้น)', 'เสื้อผ้า (S) (2 ตัว)'],
                total: 650,
                status: 'รอตรวจสอบการชำระเงิน',
                date: '2024-01-16',
                isCombo: false,
                quantities: { bracelet: 3, shirt: 2 },
                sizes: { shirt: 'S' },
                paymentData: {
                    transferAmount: 650,
                    transferDate: '2024-01-16',
                    transferTime: '09:15',
                    fromBank: 'กรุงเทพ',
                    fromAccountName: 'อรุณ ยิ้มแย้ม'
                }
            }
        ];

        // Tab switching functionality
        window.switchToProductsView = function() {
            document.getElementById('productsView').classList.remove('hidden');
            document.getElementById('ordersView').classList.add('hidden');
            document.getElementById('newOrderView').classList.add('hidden');
            
            // Update tab styles
            document.getElementById('productsTab').classList.add('bg-purple-600', 'text-white');
            document.getElementById('productsTab').classList.remove('text-purple-600', 'hover:bg-purple-50');
            document.getElementById('viewOrdersTab').classList.remove('bg-purple-600', 'text-white');
            document.getElementById('viewOrdersTab').classList.add('text-purple-600', 'hover:bg-purple-50');
            document.getElementById('newOrderTab').classList.remove('bg-purple-600', 'text-white');
            document.getElementById('newOrderTab').classList.add('text-purple-600', 'hover:bg-purple-50');
        }

        window.switchToOrdersView = function() {
            document.getElementById('productsView').classList.add('hidden');
            document.getElementById('ordersView').classList.remove('hidden');
            document.getElementById('newOrderView').classList.add('hidden');
            
            // Update tab styles
            document.getElementById('productsTab').classList.remove('bg-purple-600', 'text-white');
            document.getElementById('productsTab').classList.add('text-purple-600', 'hover:bg-purple-50');
            document.getElementById('viewOrdersTab').classList.add('bg-purple-600', 'text-white');
            document.getElementById('viewOrdersTab').classList.remove('text-purple-600', 'hover:bg-purple-50');
            document.getElementById('newOrderTab').classList.remove('bg-purple-600', 'text-white');
            document.getElementById('newOrderTab').classList.add('text-purple-600', 'hover:bg-purple-50');
            
            renderOrdersTable();
            updateLastUpdateTime();
        }

        // New function to select product and go to order page
        function selectProductAndOrder(productType) {
            switchToNewOrder(productType);
        }

        window.switchToNewOrder = function(preselect = null) {
            document.getElementById('productsView').classList.add('hidden');
            document.getElementById('ordersView').classList.add('hidden');
            document.getElementById('newOrderView').classList.remove('hidden');
            
            // Update tab styles
            document.getElementById('productsTab').classList.remove('bg-purple-600', 'text-white');
            document.getElementById('productsTab').classList.add('text-purple-600', 'hover:bg-purple-50');
            document.getElementById('viewOrdersTab').classList.remove('bg-purple-600', 'text-white');
            document.getElementById('viewOrdersTab').classList.add('text-purple-600', 'hover:bg-purple-50');
            document.getElementById('newOrderTab').classList.add('bg-purple-600', 'text-white');
            document.getElementById('newOrderTab').classList.remove('text-purple-600', 'hover:bg-purple-50');
            
            // Pre-select products based on what was clicked
            if (preselect) {
                // Reset all selections first
                resetProductSelections();
                
                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    if (preselect === 'bracelet') {
                        // Select bracelet only
                        const braceletCheckbox = document.getElementById('lipstickCheckbox');
                        if (braceletCheckbox) {
                            braceletCheckbox.checked = true;
                            braceletCheckbox.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                            selectedLipstick = braceletCheckbox.value;
                            document.getElementById('braceletQuantity').classList.remove('hidden');
                        }
                    } else if (preselect === 'shirt') {
                        // Select shirt only and show size selection
                        const shirtCheckbox = document.getElementById('shirtCheckbox');
                        if (shirtCheckbox) {
                            shirtCheckbox.checked = true;
                            shirtCheckbox.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                            selectedShirt = shirtCheckbox.value;
                            document.getElementById('sizeSelection').classList.remove('hidden');
                            document.getElementById('shirtQuantity').classList.remove('hidden');
                        }
                    } else if (preselect === 'combo') {
                        // Auto-select both products for combo
                        const braceletCheckbox = document.getElementById('lipstickCheckbox');
                        const shirtCheckbox = document.getElementById('shirtCheckbox');
                        
                        if (braceletCheckbox) {
                            braceletCheckbox.checked = true;
                            braceletCheckbox.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                            selectedLipstick = braceletCheckbox.value;
                            document.getElementById('braceletQuantity').classList.remove('hidden');
                        }
                        
                        if (shirtCheckbox) {
                            shirtCheckbox.checked = true;
                            shirtCheckbox.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                            selectedShirt = shirtCheckbox.value;
                            document.getElementById('sizeSelection').classList.remove('hidden');
                            document.getElementById('shirtQuantity').classList.remove('hidden');
                        }
                        
                        // Auto-select size M
                        const defaultSizeRadio = document.querySelector('input[name="size"][value="M"]');
                        if (defaultSizeRadio) {
                            defaultSizeRadio.checked = true;
                            selectedSize = 'M';
                            defaultSizeRadio.closest('label').classList.add('border-purple-500', 'bg-purple-50');
                        }
                    }
                    
                    checkComboStatus();
                    updatePriceDisplay();
                }, 100);
            }
        }
        
        function resetProductSelections() {
            // Reset all checkboxes and radio buttons
            const lipstickCheckbox = document.getElementById('lipstickCheckbox');
            const shirtCheckbox = document.getElementById('shirtCheckbox');
            
            lipstickCheckbox.checked = false;
            lipstickCheckbox.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
            
            shirtCheckbox.checked = false;
            shirtCheckbox.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
            
            document.querySelectorAll('input[name="size"]').forEach(radio => {
                radio.checked = false;
                radio.closest('label').classList.remove('border-purple-500', 'bg-purple-50');
            });
            
            document.getElementById('comboOption').checked = false;
            
            // Reset variables
            selectedLipstick = null;
            selectedShirt = null;
            selectedSize = null;
            isCombo = false;
            braceletQuantity = 1;
            shirtQuantity = 1;
            comboQuantity = 1;
            
            // Reset quantity inputs
            document.getElementById('braceletQty').value = 1;
            document.getElementById('shirtQty').value = 1;
            
            // Hide selections
            document.getElementById('sizeSelection').classList.add('hidden');
            document.getElementById('braceletQuantity').classList.add('hidden');
            document.getElementById('shirtQuantity').classList.add('hidden');
            
            // Reset combo container styling
            const comboContainer = document.getElementById('comboOption').closest('.mt-8');
            comboContainer.classList.remove('border-green-300', 'bg-green-50');
            comboContainer.classList.add('border-purple-200');
        }

        // Render orders table
        function renderOrdersTable(filteredOrders = null) {
            const ordersToShow = filteredOrders || orders;
            const tbody = document.getElementById('ordersTableBody');
            const emptyState = document.getElementById('emptyState');

            if (ordersToShow.length === 0) {
                tbody.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            
            tbody.innerHTML = ordersToShow.map(order => {
                const statusColors = {
                    'รอชำระเงิน': 'bg-yellow-100 text-yellow-800',
                    'รอตรวจสอบการชำระเงิน': 'bg-orange-100 text-orange-800',
                    'รอจัดส่ง': 'bg-blue-100 text-blue-800',
                    'จัดส่งแล้ว': 'bg-purple-100 text-purple-800',
                    'สำเร็จ': 'bg-green-100 text-green-800'
                };

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="border border-gray-200 px-4 py-3 font-mono text-sm">${order.id}</td>
                        <td class="border border-gray-200 px-4 py-3">${order.customerName}</td>
                        <td class="border border-gray-200 px-4 py-3">${order.phone}</td>
                        <td class="border border-gray-200 px-4 py-3">
                            <div class="text-sm">
                                ${order.items.map(item => `<div>${item}</div>`).join('')}
                            </div>
                        </td>
                        <td class="border border-gray-200 px-4 py-3 font-semibold text-purple-600">฿${order.total.toLocaleString()}</td>
                        <td class="border border-gray-200 px-4 py-3">
                            <div class="flex flex-col space-y-2">
                                <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}">${order.status}</span>
                                ${order.status === 'รอตรวจสอบการชำระเงิน' ? 
                                    `<button onclick="viewPaymentDetails('${order.id}')" class="w-full px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors">
                                        ✅ ยืนยันการชำระเงิน
                                    </button>` : ''
                                }
                            </div>
                        </td>
                        <td class="border border-gray-200 px-4 py-3 text-sm text-gray-600">${formatDate(order.date)}</td>
                    </tr>
                `;
            }).join('');
        }

        // Format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        // Update last update time
        function updateLastUpdateTime() {
            const now = new Date();
            document.getElementById('lastUpdate').textContent = now.toLocaleString('th-TH');
        }

        // Search and filter functionality
        function filterOrders() {
            const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
            const statusFilter = document.getElementById('statusFilter').value;

            const filtered = orders.filter(order => {
                const matchesSearch = !searchTerm || 
                    order.customerName.toLowerCase().includes(searchTerm) ||
                    order.phone.includes(searchTerm) ||
                    order.id.toLowerCase().includes(searchTerm);
                
                const matchesStatus = !statusFilter || order.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            });

            renderOrdersTable(filtered);
        }

        // Event listeners for tabs
        document.getElementById('productsTab').addEventListener('click', switchToProductsView);
        document.getElementById('viewOrdersTab').addEventListener('click', switchToOrdersView);
        document.getElementById('newOrderTab').addEventListener('click', switchToNewOrder);

        // Event listeners for search and filter
        document.getElementById('searchOrder').addEventListener('input', filterOrders);
        document.getElementById('statusFilter').addEventListener('change', filterOrders);

        // Add new order to the list when order is completed
        function addNewOrder(orderData) {
            orders.unshift(orderData);
            if (!document.getElementById('ordersView').classList.contains('hidden')) {
                renderOrdersTable();
                updateLastUpdateTime();
            }
        }

        // Show confirmation order summary
        function showConfirmationOrderSummary(orderNumber) {
            const confirmationDetails = document.getElementById('confirmationOrderDetails');
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            let total = 0;
            let items = [];

            if (isCombo && selectedLipstick && selectedShirt && selectedSize) {
                const comboTotal = 350 * comboQuantity;
                const regularTotal = (prices.lipstick + prices.shirt) * comboQuantity;
                const savings = regularTotal - comboTotal;
                
                items.push(`คอมโบพิเศษ: กำไลข้อมือ + เสื้อ (${comboQuantity} ชุด)`);
                items.push(`ราคาพิเศษ: ฿350 × ${comboQuantity} = ฿${comboTotal.toLocaleString()}`);
                items.push(`<span class="text-green-600">ประหยัด: ฿${savings.toLocaleString()}</span>`);
                total = comboTotal;
            } else {
                // Calculate individual items
                if (selectedLipstick) {
                    const braceletTotal = prices.lipstick * braceletQuantity;
                    items.push(`กำไลข้อมือ (${braceletQuantity} ชิ้น): ฿${braceletTotal.toLocaleString()}`);
                    total += braceletTotal;
                }

                if (selectedShirt && selectedSize) {
                    const shirtTotal = prices.shirt * shirtQuantity;
                    items.push(`เสื้อผ้า (${selectedSize}) (${shirtQuantity} ตัว): ฿${shirtTotal.toLocaleString()}`);
                    total += shirtTotal;
                }
                
                // Apply combo discount if both items are selected
                if (selectedLipstick && selectedShirt && selectedSize) {
                    const minQuantity = Math.min(braceletQuantity, shirtQuantity);
                    if (minQuantity > 0) {
                        const comboDiscount = minQuantity * 50;
                        items.push(`<span class="text-green-600">ส่วนลดคอมโบ (${minQuantity} ชุด): -฿${comboDiscount.toLocaleString()}</span>`);
                        total -= comboDiscount;
                    }
                }
            }

            confirmationDetails.innerHTML = `
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">หมายเลขคำสั่งซื้อ:</span>
                        <span class="font-mono text-purple-600">${orderNumber}</span>
                    </div>
                    <div>
                        <div class="font-semibold text-gray-700">สินค้า:</div>
                        ${items.map(item => `<div class="ml-4 text-gray-600">${item}</div>`).join('')}
                    </div>
                    <div>
                        <div class="font-semibold text-gray-700">ข้อมูลลูกค้า:</div>
                        <div class="ml-4 text-gray-600">
                            <div>ชื่อ: ${firstName} ${lastName}</div>
                            <div>เบอร์โทร: ${phone}</div>
                        </div>
                    </div>
                    <div class="border-t pt-3">
                        <div class="text-xl font-bold text-purple-600">ยอดที่ต้องชำระ: ฿${total.toLocaleString()}</div>
                    </div>
                </div>
            `;
            
            // Store order number for later use
            window.currentOrderNumber = orderNumber;
        }

        // File upload handling
        document.getElementById('paymentSlip').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    alert('ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB');
                    this.value = '';
                    return;
                }

                // Check file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                if (!allowedTypes.includes(file.type)) {
                    alert('รองรับเฉพาะไฟล์ JPG, PNG, และ PDF เท่านั้น');
                    this.value = '';
                    return;
                }

                // Show preview
                const uploadArea = document.getElementById('uploadArea');
                const uploadPreview = document.getElementById('uploadPreview');
                const previewImage = document.getElementById('previewImage');
                const fileName = document.getElementById('fileName');

                uploadArea.classList.add('hidden');
                uploadPreview.classList.remove('hidden');

                if (file.type === 'application/pdf') {
                    previewImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTUwIDEwMEgxMDBWNTBaIiBmaWxsPSIjRUY0NDQ0Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0Q1RDdEQSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE0Ij5QREYgRmlsZTwvdGV4dD4KPC9zdmc+';
                    previewImage.alt = 'PDF File';
                } else {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }

                fileName.textContent = file.name;
            }
        });

        // Clear upload function
        window.clearUpload = function() {
            document.getElementById('paymentSlip').value = '';
            document.getElementById('uploadArea').classList.remove('hidden');
            document.getElementById('uploadPreview').classList.add('hidden');
        }

        // Payment confirmation form submission
        document.getElementById('paymentConfirmationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            const paymentSlip = document.getElementById('paymentSlip').files[0];
            const transferAmount = document.getElementById('transferAmount').value;
            const transferDate = document.getElementById('transferDate').value;
            const transferTime = document.getElementById('transferTime').value;

            if (!paymentSlip) {
                alert('กรุณาอัปโหลดสลิปการโอนเงิน');
                return;
            }

            if (!transferAmount || !transferDate || !transferTime) {
                alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'กำลังส่งข้อมูล... ⏳';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Collect all form data
                const formData = {
                    orderNumber: window.currentOrderNumber,
                    paymentSlip: paymentSlip.name,
                    transferAmount: transferAmount,
                    transferDate: transferDate,
                    transferTime: transferTime,
                    fromBank: document.getElementById('fromBank').value,
                    fromAccountName: document.getElementById('fromAccountName').value
                };

                // Add order to the list with "รอตรวจสอบการชำระเงิน" status
                const firstName = document.getElementById('firstName').value.trim();
                const lastName = document.getElementById('lastName').value.trim();
                const phone = document.getElementById('phone').value.trim();
                
                let items = [];
                let total = 0;
                let isComboOrder = false;

                if (isCombo && selectedLipstick && selectedShirt && selectedSize) {
                    items.push(`คอมโบพิเศษ: กำไลข้อมือ + ${getShirtName(selectedShirt)} (${selectedSize}) (${comboQuantity} ชุด)`);
                    total = 350 * comboQuantity;
                    isComboOrder = true;
                } else {
                    // Calculate individual items
                    if (selectedLipstick) {
                        items.push(`กำไลข้อมือยาง (${braceletQuantity} ชิ้น)`);
                        total += prices.lipstick * braceletQuantity;
                    }
                    if (selectedShirt && selectedSize) {
                        items.push(`${getShirtName(selectedShirt)} (${selectedSize}) (${shirtQuantity} ตัว)`);
                        total += prices.shirt * shirtQuantity;
                    }
                    
                    // Apply combo discount if both items are selected
                    if (selectedLipstick && selectedShirt && selectedSize) {
                        const minQuantity = Math.min(braceletQuantity, shirtQuantity);
                        if (minQuantity > 0) {
                            const comboDiscount = minQuantity * 50;
                            items.push(`ส่วนลดคอมโบ (${minQuantity} ชุด)`);
                            total -= comboDiscount;
                        }
                    }
                }

                const newOrder = {
                    id: window.currentOrderNumber,
                    customerName: `${firstName} ${lastName}`,
                    phone: phone,
                    items: items,
                    total: total,
                    status: 'รอตรวจสอบการชำระเงิน',
                    date: new Date().toISOString().split('T')[0],
                    isCombo: isComboOrder,
                    paymentData: formData,
                    // เก็บข้อมูลจำนวนและไซส์แยกเพื่อใช้ในอนาคต
                    quantities: {
                        ...(selectedLipstick && { bracelet: braceletQuantity }),
                        ...(selectedShirt && selectedSize && { shirt: shirtQuantity })
                    },
                    sizes: {
                        ...(selectedShirt && selectedSize && { shirt: selectedSize })
                    }
                };

                addNewOrder(newOrder);

                // Show final order number
                document.getElementById('finalOrderNumber').textContent = window.currentOrderNumber;
                
                document.getElementById('step4').classList.add('hidden');
                document.getElementById('step5').classList.remove('hidden');
                document.getElementById('step5').classList.add('fade-in');
            }, 2000);
        });

        // Payment modal functions
        let currentModalOrderId = null;

        window.viewPaymentDetails = function(orderId) {
            const order = orders.find(o => o.id === orderId);
            if (!order || !order.paymentData) {
                alert('ไม่พบข้อมูลการชำระเงินสำหรับคำสั่งซื้อนี้');
                return;
            }

            currentModalOrderId = orderId;

            // Populate order information
            const modalOrderInfo = document.getElementById('modalOrderInfo');
            modalOrderInfo.innerHTML = `
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">หมายเลขคำสั่งซื้อ:</span>
                        <span class="font-mono text-purple-600">${order.id}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">ลูกค้า:</span>
                        <span class="text-gray-800">${order.customerName}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">เบอร์โทร:</span>
                        <span class="text-gray-800">${order.phone}</span>
                    </div>
                    <div>
                        <div class="font-semibold text-gray-700 mb-2">สินค้า:</div>
                        ${order.items.map(item => `<div class="ml-4 text-gray-600">• ${item}</div>`).join('')}
                    </div>
                    <div class="border-t pt-3">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-gray-700">ยอดรวม:</span>
                            <span class="text-xl font-bold text-purple-600">฿${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;

            // Populate payment information
            const modalPaymentInfo = document.getElementById('modalPaymentInfo');
            
            modalPaymentInfo.innerHTML = `
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <span class="text-orange-600 text-xl mr-3 mt-1">⏳</span>
                        <div>
                            <div class="font-semibold text-orange-800 mb-2">รอการชำระเงิน</div>
                            <div class="text-sm text-orange-700 space-y-1">
                                <div>• ลูกค้ายังไม่ได้ทำการโอนเงิน</div>
                                <div>• กรุณารอให้ลูกค้าโอนเงินและอัปโหลดสลิป</div>
                                <div>• หลังจากได้รับการชำระเงิน สามารถยืนยันได้ที่นี่</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <span class="text-blue-600 text-xl mr-3 mt-1">💡</span>
                        <div>
                            <div class="font-semibold text-blue-800 mb-2">ข้อมูลการชำระเงิน</div>
                            <div class="text-sm text-blue-700 space-y-1">
                                <div>• ยอดที่ต้องชำระ: <strong>฿${order.total.toLocaleString()}</strong></div>
                                <div>• วิธีการชำระ: โอนเงินผ่านธนาคาร</div>
                                <div>• ลูกค้า: ${order.customerName}</div>
                                <div>• เบอร์โทร: ${order.phone}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <span class="text-yellow-600 text-xl mr-3 mt-1">📞</span>
                        <div>
                            <div class="font-semibold text-yellow-800 mb-2">ติดต่อลูกค้า</div>
                            <div class="text-sm text-yellow-700 space-y-1">
                                <div>• สามารถติดต่อลูกค้าเพื่อแจ้งข้อมูลการชำระเงิน</div>
                                <div>• เบอร์โทร: ${order.phone}</div>
                                <div>• แจ้งให้ลูกค้าโอนเงินและอัปโหลดสลิปผ่านระบบ</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Show modal
            document.getElementById('paymentModal').classList.remove('hidden');
        }

        window.closePaymentModal = function() {
            document.getElementById('paymentModal').classList.add('hidden');
            currentModalOrderId = null;
        }

        window.confirmPaymentFromModal = function() {
            if (!currentModalOrderId) return;
            
            // Show payment confirmation form instead of direct confirmation
            showPaymentConfirmationForm(currentModalOrderId);
        }

        function showPaymentConfirmationForm(orderId) {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            // Update modal content to show confirmation form
            const modalOrderInfo = document.getElementById('modalOrderInfo');
            const modalPaymentInfo = document.getElementById('modalPaymentInfo');
            const modalConfirmBtn = document.getElementById('modalConfirmBtn');

            // Keep order info the same
            modalOrderInfo.innerHTML = `
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">หมายเลขคำสั่งซื้อ:</span>
                        <span class="font-mono text-purple-600">${order.id}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">ลูกค้า:</span>
                        <span class="text-gray-800">${order.customerName}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-700">เบอร์โทร:</span>
                        <span class="text-gray-800">${order.phone}</span>
                    </div>
                    <div>
                        <div class="font-semibold text-gray-700 mb-2">สินค้า:</div>
                        ${order.items.map(item => `<div class="ml-4 text-gray-600">• ${item}</div>`).join('')}
                    </div>
                    <div class="border-t pt-3">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-gray-700">ยอดรวม:</span>
                            <span class="text-xl font-bold text-purple-600">฿${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;

            // Show payment confirmation form
            modalPaymentInfo.innerHTML = `
                <form id="adminPaymentForm" class="space-y-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 class="font-semibold text-blue-800 mb-2">📝 เพิ่มข้อมูลการชำระเงิน</h4>
                        <p class="text-sm text-blue-700">กรอกข้อมูลการโอนเงินและอัปโหลดสลิปเพื่อยืนยันการชำระเงิน</p>
                    </div>

                    <!-- Payment Method Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            💳 วิธีการชำระเงิน <span class="text-red-500">*</span>
                        </label>
                        <div class="grid md:grid-cols-2 gap-3">
                            <label class="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                                <input type="radio" name="adminPaymentMethod" value="bank-transfer" class="mr-3 text-purple-500" checked>
                                <div class="flex-1">
                                    <div class="font-medium">🏦 โอนเงินผ่านธนาคาร</div>
                                    <div class="text-sm text-gray-500">โอนเงินเข้าบัญชีธนาคาร</div>
                                </div>
                            </label>

                            <label class="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                                <input type="radio" name="adminPaymentMethod" value="promptpay" class="mr-3 text-purple-500">
                                <div class="flex-1">
                                    <div class="font-medium">📱 พร้อมเพย์</div>
                                    <div class="text-sm text-gray-500">ชำระผ่าน QR Code พร้อมเพย์</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Payment Details -->
                    <div id="adminPaymentDetails" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div id="adminBankTransferDetails">
                            <h4 class="text-lg font-semibold text-blue-800 mb-4">🏦 ข้อมูลการโอนเงิน</h4>
                            <div class="space-y-3">
                                <div class="bg-white p-4 rounded-lg border">
                                    <div class="text-sm text-gray-600">ธนาคาร</div>
                                    <div class="font-semibold text-gray-800">ธนาคารกสิกรไทย</div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border">
                                    <div class="text-sm text-gray-600">เลขที่บัญชี</div>
                                    <div class="font-mono text-lg font-semibold text-gray-800">123-4-56789-0</div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border">
                                    <div class="text-sm text-gray-600">ชื่อบัญชี</div>
                                    <div class="font-semibold text-gray-800">นาย ตัวอย่าง ระบบจอง</div>
                                </div>
                            </div>
                        </div>

                        <div id="adminPromptpayDetails" class="hidden">
                            <h4 class="text-lg font-semibold text-blue-800 mb-4">📱 พร้อมเพย์ QR Code</h4>
                            <div class="text-center">
                                <div class="bg-white p-6 rounded-lg border inline-block">
                                    <!-- QR Code Placeholder -->
                                    <div class="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <div class="text-center">
                                            <div class="text-4xl mb-2">📱</div>
                                            <div class="text-sm text-gray-600">QR Code สำหรับ<br>พร้อมเพย์</div>
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-600">หมายเลขพร้อมเพย์</div>
                                    <div class="font-mono text-lg font-semibold text-gray-800">0XX-XXX-XXXX</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Transfer Details -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                💰 จำนวนเงินที่ชำระ <span class="text-red-500">*</span>
                            </label>
                            <input type="number" id="adminTransferAmount" step="0.01" required 
                                   value="${order.total}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                   placeholder="0.00">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                📅 วันที่ชำระ <span class="text-red-500">*</span>
                            </label>
                            <input type="date" id="adminTransferDate" required 
                                   value="${new Date().toISOString().split('T')[0]}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                ⏰ เวลาที่โอน <span class="text-red-500">*</span>
                            </label>
                            <input type="time" id="adminTransferTime" required 
                                   value="${new Date().toTimeString().slice(0, 5)}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                🏦 ธนาคารที่โอนจาก
                            </label>
                            <select id="adminFromBank" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">เลือกธนาคาร</option>
                                <option value="กสิกรไทย">ธนาคารกสิกรไทย</option>
                                <option value="กรุงเทพ">ธนาคารกรุงเทพ</option>
                                <option value="กรุงไทย">ธนาคารกรุงไทย</option>
                                <option value="ไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                                <option value="กรุงศรีอยุธยา">ธนาคารกรุงศรีอยุธยา</option>
                                <option value="ทหารไทยธนชาต">ธนาคารทหารไทยธนชาต</option>
                                <option value="ออมสิน">ธนาคารออมสิน</option>
                                <option value="อาคารสงเคราะห์">ธนาคารอาคารสงเคราะห์</option>
                                <option value="เกียรตินาคินภัทร">ธนาคารเกียรตินาคินภัทร</option>
                                <option value="ซีไอเอ็มบี">ธนาคารซีไอเอ็มบี</option>
                                <option value="ยูโอบี">ธนาคารยูโอบี</option>
                                <option value="แลนด์ แอนด์ เฮ้าส์">ธนาคารแลนด์ แอนด์ เฮ้าส์</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <!-- Account Details -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            👤 ชื่อบัญชีที่โอนจาก
                        </label>
                        <input type="text" id="adminFromAccountName" 
                               value="${order.customerName}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                               placeholder="ชื่อเจ้าของบัญชีที่โอนเงิน">
                    </div>

                    <!-- Slip Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            📎 อัปโหลดสลิปการโอนเงิน <span class="text-red-500">*</span>
                        </label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                            <input type="file" id="adminPaymentSlip" accept="image/*,.pdf" class="hidden" required>
                            <div id="adminUploadArea" class="cursor-pointer" onclick="document.getElementById('adminPaymentSlip').click()">
                                <div class="text-3xl mb-2">📷</div>
                                <div class="text-gray-600 mb-1">คลิกเพื่อเลือกไฟล์สลิป</div>
                                <div class="text-xs text-gray-500">รองรับไฟล์: JPG, PNG, PDF (ขนาดไม่เกิน 5MB)</div>
                            </div>
                            <div id="adminUploadPreview" class="hidden">
                                <img id="adminPreviewImage" class="max-w-xs mx-auto rounded-lg shadow-md" alt="ตัวอย่างสลิป">
                                <div id="adminFileName" class="mt-2 text-sm text-gray-600"></div>
                                <button type="button" onclick="clearAdminUpload()" class="mt-2 text-red-500 hover:text-red-700 text-sm">
                                    🗑️ ลบไฟล์
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            📝 หมายเหตุ
                        </label>
                        <textarea id="adminNotes" rows="3" 
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"></textarea>
                    </div>

                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div class="text-sm text-green-800">
                            <div class="font-medium mb-1">✅ การดำเนินการ:</div>
                            <div>หลังจากกรอกข้อมูลครบถ้วน ระบบจะเปลี่ยนสถานะคำสั่งซื้อเป็น "รอจัดส่ง"</div>
                        </div>
                    </div>
                </form>
            `;

            // Update button text
            modalConfirmBtn.innerHTML = '✅ บันทึกและยืนยันการชำระเงิน';
            modalConfirmBtn.onclick = function() { submitAdminPaymentForm(orderId); };
        }
});
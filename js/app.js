document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentView: 'products',
        productList: [], // Will be populated from the API
        order: {
            items: [],
            customer: {},
            payment: {},
            total_amount: 0,
            discount_amount: 0,
            final_amount: 0,
        },
    };

    // --- DOM Elements ---
    const productsView = document.getElementById('productsView');
    const newOrderView = document.getElementById('newOrderView');
    const ordersView = document.getElementById('ordersView');
    const allViews = [productsView, newOrderView, ordersView];

    const productsTab = document.getElementById('productsTab');
    const newOrderTab = document.getElementById('newOrderTab');
    const viewOrdersTab = document.getElementById('viewOrdersTab');
    const allTabs = [productsTab, newOrderTab, viewOrdersTab];

    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4'),
        document.getElementById('step5'),
    ];

    // Step 1 Elements
    const braceletCheckbox = document.getElementById('braceletCheckbox');
    const shirtCheckbox = document.getElementById('shirtCheckbox');
    const braceletQuantityDiv = document.getElementById('braceletQuantity');
    const shirtQuantityDiv = document.getElementById('shirtQuantity');
    const braceletQtyInput = document.getElementById('braceletQty');
    const shirtQtyInput = document.getElementById('shirtQty');
    const sizeSelectionDiv = document.getElementById('sizeSelection');
    const comboOptionCheckbox = document.getElementById('comboOption');
    const comboSavingsSpan = document.getElementById('comboSavings');
    const priceBreakdownDiv = document.getElementById('priceBreakdown');
    const totalPriceSpan = document.getElementById('totalPrice');
    const nextStep1Btn = document.getElementById('nextStep1');

    // Other elements remain the same...
    const customerForm = document.getElementById('customerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneInput = document.getElementById('phone');
    const finalOrderDetailsDiv = document.getElementById('finalOrderDetails');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const bankTransferDetails = document.getElementById('bankTransferDetails');
    const promptpayDetails = document.getElementById('promptpayDetails');
    const processPaymentBtn = document.getElementById('processPayment');
    const paymentConfirmationForm = document.getElementById('paymentConfirmationForm');
    const confirmationOrderDetailsDiv = document.getElementById('confirmationOrderDetails');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const fileNameSpan = document.getElementById('fileName');
    const paymentSlipInput = document.getElementById('paymentSlip');
    const finalOrderNumberSpan = document.getElementById('finalOrderNumber');

    // --- Dynamic Rendering ---
    const renderProducts = (products) => {
        const container = document.getElementById('product-list-container');
        const bracelet = products.find(p => p.category === 'bracelet');
        const shirt = products.find(p => p.category === 'shirt');
        const combo = products.find(p => p.category === 'combo');

        let html = '';

        // Main product grid
        html += '<div class="grid md:grid-cols-2 gap-8 mb-8">';
        if (bracelet) {
            html += `
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 class="text-2xl font-bold text-purple-800 mb-6 text-center">📿 ${bracelet.name}</h3>
                <div class="bg-white rounded-lg p-6 shadow-md">
                    <div class="text-center mb-4">
                        <div class="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center"><span class="text-4xl">📿</span></div>
                        <h4 class="text-xl font-semibold text-gray-800">${bracelet.name}</h4>
                        <p class="text-gray-600 text-sm mt-2">${bracelet.description}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center"><span class="text-gray-600">วัสดุ:</span> <span class="font-semibold">${bracelet.material}</span></div>
                        <div class="flex justify-between items-center"><span class="text-gray-600">ขนาด:</span> <span class="font-semibold">${bracelet.sizes.join(', ')}</span></div>
                    </div>
                    <div class="border-t pt-3 mt-3">
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold text-gray-800">ราคา:</span>
                            <span class="text-2xl font-bold text-purple-600">฿${parseFloat(bracelet.price).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onclick="switchToNewOrder('bracelet')" class="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">ไม่จำจัด จำนวน</button>
                </div>
            </div>`;
        }
        if (shirt) {
             html += `
             <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 class="text-2xl font-bold text-blue-800 mb-6 text-center">👕 ${shirt.name}</h3>
                <div class="bg-white rounded-lg p-6 shadow-md">
                    <div class="text-center mb-4">
                        <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center"><span class="text-4xl">👕</span></div>
                        <h4 class="text-xl font-semibold text-gray-800">${shirt.name}</h4>
                        <p class="text-gray-600 text-sm mt-2">${shirt.description}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center"><span class="text-gray-600">วัสดุ:</span> <span class="font-semibold">${shirt.material}</span></div>
                        <div class="flex justify-between items-center"><span class="text-gray-600">ขนาด:</span> <span class="font-semibold">${shirt.sizes.join(', ')}</span></div>
                    </div>
                    <div class="border-t pt-3 mt-3">
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold text-gray-800">ราคา:</span>
                            <span class="text-2xl font-bold text-blue-600">฿${parseFloat(shirt.price).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onclick="switchToNewOrder('shirt')" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">ไม่จำจัด จำนวน</button>
                </div>
            </div>`;
        }
        html += '</div>'; // End grid

        // Combo offer
        if (combo && bracelet && shirt) {
            const originalPrice = parseFloat(bracelet.price) + parseFloat(shirt.price);
            const discount = combo.discount_amount ? parseFloat(combo.discount_amount) : originalPrice - parseFloat(combo.price);
            html += `
            <div class="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-xl p-8 border-2 border-purple-200 mb-8">
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-purple-800 mb-4">🎁 ${combo.name}</h3>
                    <div class="bg-white rounded-lg p-6 shadow-lg inline-block">
                        <div class="text-3xl mb-4">📿 + 👕</div>
                        <h4 class="text-xl font-semibold text-gray-800 mb-2">คอมโบพิเศษ</h4>
                        <p class="text-gray-600 mb-4">${combo.description}</p>
                        <div class="flex items-center justify-center space-x-4 mb-4">
                            <span class="text-lg text-gray-500 line-through">฿${originalPrice.toLocaleString()}</span>
                            <span class="text-3xl font-bold text-purple-600">฿${parseFloat(combo.price).toLocaleString()}</span>
                        </div>
                        <div class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">ประหยัด ฿${discount.toLocaleString()}!</div>
                    </div>
                    <div class="mt-6">
                        <button onclick="switchToNewOrder('combo')" class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">ไม่จำจัด จำนวน</button>
                    </div>
                </div>
            </div>`;
        }

        container.innerHTML = html;
    };

    const updateNewOrderView = (products) => {
        const bracelet = products.find(p => p.category === 'bracelet');
        const shirt = products.find(p => p.category === 'shirt');
        const combo = products.find(p => p.category === 'combo');

        if(bracelet && braceletCheckbox) {
            const braceletLabel = braceletCheckbox.closest('label');
            if (braceletLabel) {
                braceletLabel.querySelector('.font-medium').textContent = bracelet.name;
                braceletLabel.querySelector('.text-sm').textContent = bracelet.description;
                braceletLabel.querySelector('.text-purple-600').textContent = `฿${parseFloat(bracelet.price)} / ชิ้น`;
            }
        }
        if(shirt && shirtCheckbox) {
            const shirtLabel = shirtCheckbox.closest('label');
            if (shirtLabel) {
                shirtLabel.querySelector('.font-medium').textContent = shirt.name;
                shirtLabel.querySelector('.text-sm').textContent = shirt.description;
                shirtLabel.querySelector('.text-purple-600').textContent = `฿${parseFloat(shirt.price)} / ตัว`;
                
                const sizeContainer = document.querySelector('#sizeSelection .flex');
                if(sizeContainer) {
                    sizeContainer.innerHTML = shirt.sizes.map(size => `
                        <label class="flex items-center justify-center w-16 h-16 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                            <input type="radio" name="size" value="${size}" class="sr-only">
                            <span class="font-semibold">${size}</span>
                        </label>`).join('');
                }
            }
        }
        if(combo && bracelet && shirt) {
            const discount = (parseFloat(bracelet.price) + parseFloat(shirt.price)) - parseFloat(combo.price);
            if(comboSavingsSpan) comboSavingsSpan.textContent = `ประหยัด ฿${discount}`;
            const comboDesc = comboOptionCheckbox.parentElement.querySelector('.text-sm');
            if(comboDesc) comboDesc.textContent = `เลือกทั้งสองอย่างเพื่อรับราคาพิเศษ ${parseFloat(combo.price)} บาท/ชุด! (ลด ${discount} บาท/ชุด)`;
        }
    };

    const loadProductsAndRender = async () => {
        const container = document.getElementById('product-list-container');
        try {
            const response = await fetch('api/get_products.php');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data.success && data.products.length > 0) {
                state.productList = data.products;
                renderProducts(data.products);
                updateNewOrderView(data.products);
            } else {
                container.innerHTML = `<p class="text-center text-red-500">Error: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Failed to load products:', error);
            container.innerHTML = `<p class="text-center text-red-500">ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบการเชื่อมต่อและลองอีกครั้ง</p>`;
        }
    };

    const updatePrice = () => {
        const bracelet = state.productList.find(p => p.category === 'bracelet');
        const shirt = state.productList.find(p => p.category === 'shirt');
        const combo = state.productList.find(p => p.category === 'combo');

        if (!bracelet || !shirt) return;

        let total = 0;
        let breakdown = '';
        let items = [];
        
        const braceletQty = parseInt(braceletQtyInput.value);
        const shirtQty = parseInt(shirtQtyInput.value);

        const isBraceletSelected = braceletCheckbox.checked;
        const isShirtSelected = shirtCheckbox.checked;
        const isCombo = isBraceletSelected && isShirtSelected && combo;

        let comboQty = 0;
        let regularBraceletQty = 0;
        let regularShirtQty = 0;
        let discount = 0;

        if (isCombo) {
            const discountPerCombo = (parseFloat(bracelet.price) + parseFloat(shirt.price)) - parseFloat(combo.price);
            comboQty = Math.min(braceletQty, shirtQty);
            regularBraceletQty = braceletQty - comboQty;
            regularShirtQty = shirtQty - comboQty;
            discount = comboQty * discountPerCombo;

            if (comboQty > 0) {
                const comboFinalPrice = parseFloat(combo.price) * comboQty;
                total += comboFinalPrice;
                breakdown += `<div>🎁 ${combo.name} x${comboQty}: <span class="font-semibold">฿${comboFinalPrice.toLocaleString()}</span></div>`;
                items.push({ product_id: combo.id, product_name: combo.name, quantity: comboQty, unit_price: parseFloat(combo.price), subtotal: comboFinalPrice });
            }
        } else {
            regularBraceletQty = isBraceletSelected ? braceletQty : 0;
            regularShirtQty = isShirtSelected ? shirtQty : 0;
        }

        if (regularBraceletQty > 0) {
            const braceletPrice = parseFloat(bracelet.price) * regularBraceletQty;
            total += braceletPrice;
            breakdown += `<div>📿 ${bracelet.name} x${regularBraceletQty}: <span class="font-semibold">฿${braceletPrice.toLocaleString()}</span></div>`;
            items.push({ product_id: bracelet.id, product_name: bracelet.name, quantity: regularBraceletQty, unit_price: parseFloat(bracelet.price), subtotal: braceletPrice });
        }

        if (regularShirtQty > 0) {
            const shirtPrice = parseFloat(shirt.price) * regularShirtQty;
            total += shirtPrice;
            breakdown += `<div>👕 ${shirt.name} x${regularShirtQty}: <span class="font-semibold">฿${shirtPrice.toLocaleString()}</span></div>`;
            items.push({ product_id: shirt.id, product_name: shirt.name, quantity: regularShirtQty, unit_price: parseFloat(shirt.price), subtotal: shirtPrice });
        }

        if (!isBraceletSelected && !isShirtSelected) {
            breakdown = '<div>กรุณาเลือกสินค้า</div>';
        }

        priceBreakdownDiv.innerHTML = breakdown;
        totalPriceSpan.textContent = `฿${total.toLocaleString()}`;

        state.order.items = items;
        state.order.total_amount = total + discount;
        state.order.discount_amount = discount;
        state.order.final_amount = total;

        nextStep1Btn.disabled = total <= 0;
    };

    const updateTabs = (activeTab) => {
        allTabs.forEach(tab => {
            tab.classList.remove('bg-purple-600', 'text-white');
            tab.classList.add('text-purple-600', 'hover:bg-purple-50');
        });
        activeTab.classList.add('bg-purple-600', 'text-white');
        activeTab.classList.remove('text-purple-600', 'hover:bg-purple-50');
    };

    const showView = (viewToShow) => {
        allViews.forEach(view => view.classList.add('hidden'));
        viewToShow.classList.remove('hidden');
    };

    const showStep = (stepNumber) => {
        steps.forEach((step, index) => {
            step.classList.toggle('hidden', index + 1 !== stepNumber);
        });
    };

    window.switchToProductsView = () => {
        state.currentView = 'products';
        updateTabs(productsTab);
        showView(productsView);
    };

    window.switchToNewOrder = (preselect = null) => {
        state.currentView = 'newOrder';
        updateTabs(newOrderTab);
        showView(newOrderView);
        showStep(1);

        state.order = { items: [], customer: {}, payment: {}, total_amount: 0, discount_amount: 0, final_amount: 0 };
        if(braceletCheckbox) braceletCheckbox.checked = false;
        if(shirtCheckbox) shirtCheckbox.checked = false;
        
        if (preselect === 'bracelet') if(braceletCheckbox) braceletCheckbox.checked = true;
        if (preselect === 'shirt') if(shirtCheckbox) shirtCheckbox.checked = true;
        if (preselect === 'combo') {
            if(braceletCheckbox) braceletCheckbox.checked = true;
            if(shirtCheckbox) shirtCheckbox.checked = true;
        }
        
        handleProductSelection();
        updatePrice();
    };

    window.switchToOrdersView = () => {
        state.currentView = 'viewOrders';
        updateTabs(viewOrdersTab);
        showView(ordersView);
    };

    window.goBackToStep1 = () => showStep(1);
    window.goBackToStep2 = () => showStep(2);
    window.goBackToStep3 = () => showStep(3);

    const handleProductSelection = () => {
        if(!braceletCheckbox || !shirtCheckbox) return;
        braceletQuantityDiv.classList.toggle('hidden', !braceletCheckbox.checked);
        shirtQuantityDiv.classList.toggle('hidden', !shirtCheckbox.checked);
        sizeSelectionDiv.classList.toggle('hidden', !shirtCheckbox.checked);
        
        const isCombo = braceletCheckbox.checked && shirtCheckbox.checked;
        comboOptionCheckbox.checked = isCombo;
        comboOptionCheckbox.disabled = !isCombo;

        updatePrice();
    };

    window.updateQuantity = (product, change) => {
        const input = product === 'bracelet' ? braceletQtyInput : shirtQtyInput;
        let currentValue = parseInt(input.value);
        currentValue += change;
        if (currentValue < 1) currentValue = 1;
        input.value = currentValue;
        updatePrice();
    };

    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedSize = document.querySelector('input[name="size"]:checked');

        if (shirtCheckbox.checked && !selectedSize) {
            alert('กรุณาเลือกไซส์เสื้อ');
            return;
        }

        state.order.customer = { first_name: firstNameInput.value, last_name: lastNameInput.value, phone: phoneInput.value };
        
        if (selectedSize) {
            const shirt = state.productList.find(p => p.category === 'shirt');
            const combo = state.productList.find(p => p.category === 'combo');
            const shirtItem = state.order.items.find(item => shirt && item.product_id === shirt.id);
            const comboItem = state.order.items.find(item => combo && item.product_id === combo.id);
            if(shirtItem) shirtItem.size = selectedSize.value;
            if(comboItem) comboItem.size = selectedSize.value;
        }

        let summaryHtml = `<div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-gray-600">ลูกค้า:</span> <span class="font-semibold">${state.order.customer.first_name} ${state.order.customer.last_name}</span></div>
                <div class="flex justify-between"><span class="text-gray-600">เบอร์โทร:</span> <span class="font-semibold">${state.order.customer.phone}</span></div>
                <div class="border-t my-2"></div>`;
        state.order.items.forEach(item => {
            summaryHtml += `<div class="flex justify-between">
                <span>${item.product_name} x${item.quantity} ${item.size ? `(ไซส์ ${item.size})` : ''}</span>
                <span class="font-semibold">฿${item.subtotal.toLocaleString()}</span>
            </div>`;
        });
        summaryHtml += `<div class="border-t my-2"></div>
                <div class="flex justify-between text-lg font-bold text-purple-600">
                    <span>ยอดรวมสุทธิ:</span>
                    <span>฿${state.order.final_amount.toLocaleString()}</span>
                </div></div>`;
        finalOrderDetailsDiv.innerHTML = summaryHtml;
        confirmationOrderDetailsDiv.innerHTML = summaryHtml;

        showStep(3);
    });

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            bankTransferDetails.classList.toggle('hidden', radio.value !== 'bank-transfer');
            promptpayDetails.classList.toggle('hidden', radio.value !== 'promptpay');
        });
    });

    processPaymentBtn.addEventListener('click', () => {
        state.order.payment_method = document.querySelector('input[name="payment"]:checked').value;
        showStep(4);
    });

    paymentSlipInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImage.src = event.target.result;
                fileNameSpan.textContent = file.name;
                uploadArea.classList.add('hidden');
                uploadPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    window.clearUpload = () => {
        paymentSlipInput.value = '';
        uploadArea.classList.remove('hidden');
        uploadPreview.classList.add('hidden');
    };

    paymentConfirmationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.order.payment_confirmation = { transfer_amount: document.getElementById('transferAmount').value, transfer_date: document.getElementById('transferDate').value, transfer_time: document.getElementById('transferTime').value, from_bank: document.getElementById('fromBank').value, from_account_name: document.getElementById('fromAccountName').value, slip_file: paymentSlipInput.files[0] };
        const finalFormData = new FormData();
        finalFormData.append('order_data', JSON.stringify({ items: state.order.items, customer: state.order.customer, payment_method: state.order.payment_method, total_amount: state.order.total_amount, discount_amount: state.order.discount_amount, final_amount: state.order.final_amount }));
        finalFormData.append('payment_confirmation_data', JSON.stringify({ transfer_amount: state.order.payment_confirmation.transfer_amount, transfer_date: state.order.payment_confirmation.transfer_date, transfer_time: state.order.payment_confirmation.transfer_time, from_bank: state.order.payment_confirmation.from_bank, from_account_name: state.order.payment_confirmation.from_account_name }));
        if (state.order.payment_confirmation.slip_file) {
            finalFormData.append('slip_file', state.order.payment_confirmation.slip_file);
        }
        fetch('api/create_order.php', { method: 'POST', body: finalFormData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                finalOrderNumberSpan.textContent = data.order_id;
                showStep(5);
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert('เกิดข้อผิดพลาดร้ายแรง ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        });
    });

    const init = () => {
        productsTab.addEventListener('click', switchToProductsView);
        newOrderTab.addEventListener('click', () => switchToNewOrder());
        viewOrdersTab.addEventListener('click', switchToOrdersView);
        if(braceletCheckbox) braceletCheckbox.addEventListener('change', handleProductSelection);
        if(shirtCheckbox) shirtCheckbox.addEventListener('change', handleProductSelection);
        braceletQtyInput.addEventListener('change', () => updateQuantity('bracelet', 0));
        shirtQtyInput.addEventListener('change', () => updateQuantity('shirt', 0));
        document.body.addEventListener('change', (e) => {
            if (e.target.matches('input[name="size"]')) {
                document.querySelectorAll('#sizeSelection label').forEach(label => {
                    label.classList.remove('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-300');
                    label.classList.add('border-gray-200');
                });
                const selectedLabel = e.target.parentElement;
                if (selectedLabel) {
                    selectedLabel.classList.add('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-300');
                    selectedLabel.classList.remove('border-gray-200');
                }
                updatePrice();
            }
        });
        nextStep1Btn.addEventListener('click', () => {
            const isShirtSelected = shirtCheckbox.checked;
            const selectedSize = document.querySelector('input[name="size"]:checked');
            if (isShirtSelected && !selectedSize) {
                alert('กรุณาเลือกไซส์เสื้อก่อนดำเนินการต่อครับ');
                return;
            }
            showStep(2);
        });
        switchToProductsView();
        bankTransferDetails.classList.remove('hidden');
        promptpayDetails.classList.add('hidden');
        document.getElementById('transferDate').valueAsDate = new Date();
        loadProductsAndRender(); // Load products on initial start
    };

    init();
});
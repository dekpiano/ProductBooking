document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentView: 'products',
        productList: [],
        order: {
            items: [],
            customer: {},
            payment: {},
            payment_method_id: null,
            total_amount: 0,
            discount_amount: 0,
            final_amount: 0,
        },
        ordersDebounceTimeout: null,
        paymentMethods: [],
    };

    // --- DOM Elements ---
    const productsView = document.getElementById('productsView');
    const newOrderView = document.getElementById('newOrderView');
    const ordersView = document.getElementById('ordersView');
    const contactView = document.getElementById('contactView');
    const allViews = [productsView, newOrderView, ordersView, contactView];

    const productsTab = document.getElementById('productsTab');
    const newOrderTab = document.getElementById('newOrderTab');
    const viewOrdersTab = document.getElementById('viewOrdersTab');
    const contactTab = document.getElementById('contactTab');
    const allTabs = [productsTab, newOrderTab, viewOrdersTab, contactTab];

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
    const genderSelectionDiv = document.getElementById('genderSelection');
    const sizeSelectionDiv = document.getElementById('sizeSelection');
    const comboOptionCheckbox = document.getElementById('comboOption');
    const comboSavingsSpan = document.getElementById('comboSavings');
    const priceBreakdownDiv = document.getElementById('priceBreakdown');
    const totalPriceSpan = document.getElementById('totalPrice');
    const nextStep1Btn = document.getElementById('nextStep1');

    // View Orders Elements
    const searchOrderInput = document.getElementById('searchOrder');
    const statusFilterSelect = document.getElementById('statusFilter');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const emptyStateDiv = document.getElementById('emptyState');
    const lastUpdateSpan = document.getElementById('lastUpdate');

    // Contact View Elements
    const contactListContainer = document.getElementById('contact-list-container');

    // Other elements
    const customerForm = document.getElementById('customerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneInput = document.getElementById('phone');
    const finalOrderDetailsDiv = document.getElementById('finalOrderDetails');
    const paymentConfirmationForm = document.getElementById('paymentConfirmationForm');
    const confirmationOrderDetailsDiv = document.getElementById('confirmationOrderDetails');
    const finalOrderNumberSpan = document.getElementById('finalOrderNumber');
    const processPaymentBtn = document.getElementById('processPayment');
    const paymentSlipInput = document.getElementById('paymentSlip');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const fileNameSpan = document.getElementById('fileName');

    // --- Dynamic Rendering ---
    const renderProducts = (products) => {
        const container = document.getElementById('product-list-container');
        const bracelet = products.find(p => p.category === 'bracelet');
        const shirt = products.find(p => p.category === 'shirt');
        const combo = products.find(p => p.category === 'combo');
        let html = '';
        html += '<div class="grid md:grid-cols-2 gap-8 mb-8">';
        if (bracelet) {
            html += `
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 flex flex-col">
                <h3 class="text-2xl font-bold text-purple-800 mb-6 text-center">📿 ${bracelet.name}</h3>
                <div class="bg-white rounded-lg p-6 shadow-md flex-grow flex flex-col">
                    <div class="text-center mb-4 flex-grow">
                        ${bracelet.image_url ? `<img src="${bracelet.image_url}" alt="${bracelet.name}" class="w-64 h-64 object-cover rounded-lg mx-auto mb-4 product-thumbnail">` : `<div class="w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mx-auto mb-4 flex items-center justify-center"><span class="text-5xl">📿</span></div>`}
                        <h4 class="text-xl font-semibold text-gray-800 mt-4">${bracelet.name}</h4>
                        <p class="text-gray-600 text-sm mt-2">${bracelet.description}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center"><span class="text-gray-600">ขนาด:</span> <span class="font-semibold sm:text-right break-all">${bracelet.sizes}</span></div>
                    </div>
                    <div class="border-t pt-3 mt-3">
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold text-gray-800">ราคา:</span>
                            <span class="text-2xl font-bold text-purple-600">฿${parseFloat(bracelet.price).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onclick="switchToNewOrder('bracelet')" class="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">สั่งจอง</button>
                </div>
            </div>`;
        }
        if (shirt) {
             html += `
             <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 flex flex-col">
                <h3 class="text-2xl font-bold text-blue-800 mb-6 text-center">👕 ${shirt.name}</h3>
                <div class="bg-white rounded-lg p-6 shadow-md flex-grow flex flex-col">
                    <div class="text-center mb-4 flex-grow">
                        ${shirt.image_url ? `<img src="${shirt.image_url}" alt="${shirt.name}" class="w-64 h-64 object-cover rounded-lg mx-auto mb-4 product-thumbnail">` : `<div class="w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center"><span class="text-5xl">👕</span></div>`}
                        <h4 class="text-xl font-semibold text-gray-800 mt-4">${shirt.name}</h4>
                        <p class="text-gray-600 text-sm mt-2">${shirt.description}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center"><span class="text-gray-600">ขนาด:</span> <span class="font-semibold sm:text-right break-all">${shirt.sizes}</span></div>
                    </div>
                    <div class="border-t pt-3 mt-3">
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold text-gray-800">ราคา:</span>
                            <span class="text-2xl font-bold text-blue-600">฿${parseFloat(shirt.price).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onclick="switchToNewOrder('shirt')" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">สั่งจอง</button>
                </div>
            </div>`;
        }
        html += '</div>';
       
        if (combo && bracelet && shirt) {
            const originalPrice = parseFloat(bracelet.price) + parseFloat(shirt.price);
            const discount = combo.discount_amount ? parseFloat(combo.discount_amount) : originalPrice - parseFloat(combo.price);
            html += `
            <div class="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-xl p-8 border-2 border-purple-200 mb-8">
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-purple-800 mb-4">🎁 ${combo.name}</h3>
                    <div class="bg-white rounded-lg p-6 shadow-lg inline-block">
                        ${combo.image_url ? `<img src="${combo.image_url}" alt="${combo.name}" class="w-64 h-64 object-cover rounded-lg mx-auto mb-4 product-thumbnail">` : `<div class="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center"><span class="text-5xl">📿+👕</span></div>`}

                        <h4 class="text-xl font-semibold text-gray-800 mb-2 mt-4">คอมโบพิเศษ</h4>
                        <p class="text-gray-600 mb-4">${combo.description}</p>
                        <div class="flex items-center justify-center space-x-4 mb-4">
                            <span class="text-lg text-gray-500 line-through">฿${originalPrice.toLocaleString()}</span>
                            <span class="text-3xl font-bold text-purple-600">฿${parseFloat(combo.price).toLocaleString()}</span>
                        </div>
                        <div class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">ประหยัด ฿${discount.toLocaleString()}!</div>
                    </div>
                    <div class="mt-6">
                        <button onclick="switchToNewOrder('combo')" class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">สั่งจอง</button>
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
                const braceletImage = document.getElementById('braceletImage');
                if (bracelet.image_url && braceletImage) {
                    braceletImage.src = bracelet.image_url;
                    braceletImage.classList.remove('hidden');
                } else if (braceletImage) {
                    braceletImage.classList.add('hidden');
                }
            }
        }
        if(shirt && shirtCheckbox) {
            const shirtLabel = shirtCheckbox.closest('label');
            if (shirtLabel) {
                shirtLabel.querySelector('.font-medium').textContent = shirt.name;
                shirtLabel.querySelector('.text-sm').textContent = shirt.description;
                shirtLabel.querySelector('.text-purple-600').textContent = `฿${parseFloat(shirt.price)} / ตัว`;
                const shirtImage = document.getElementById('shirtImage');
                if (shirt.image_url && shirtImage) {
                    shirtImage.src = shirt.image_url;
                    shirtImage.classList.remove('hidden');
                } else if (shirtImage) {
                    shirtImage.classList.add('hidden');
                }
                const sizeContainer = document.querySelector('#sizeSelection .flex');
                if(sizeContainer) {
                    const sizesArray = shirt.sizes ? shirt.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
                    sizeContainer.innerHTML = sizesArray.map(size => `
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
            const comboImage = document.getElementById('comboImage');
            if (combo.image_url && comboImage) {
                comboImage.src = combo.image_url;
                comboImage.classList.remove('hidden');
            } else if (comboImage) {
                comboImage.classList.add('hidden');
            }
        }
    };

    const loadProductsAndRender = async () => {
        const container = document.getElementById('product-list-container');
        try {
            const response = await fetch('api/public/get_products.php');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.success && data.products.length > 0) {
                state.productList = data.products;
                renderProducts(data.products);
                updateNewOrderView(data.products);
            } else {
                container.innerHTML = `<p class="text-center text-red-500">Error: ${data.message || 'Could not load products.'}</p>`;
            }
        } catch (error) {
            console.error('Failed to load products:', error);
            container.innerHTML = `<p class="text-center text-red-500">ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบการเชื่อมต่อและลองอีกครั้ง</p>`;
        }
    };

    const loadAndRenderOrders = async () => {
        const query = searchOrderInput.value;
        const status = statusFilterSelect.value;
        ordersTableBody.innerHTML = '<tr><td colspan="7" class="text-center p-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>';

        try {
            const response = await fetch(`api/public/get_orders.php?q=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`);
            const data = await response.json();

            if (data.success) {
                lastUpdateSpan.textContent = new Date().toLocaleTimeString();
                if (data.orders.length > 0) {
                    ordersTableBody.parentElement.classList.remove('hidden');
                    emptyStateDiv.classList.add('hidden');
                    let rowsHtml = data.orders.map(order => {
                        const createdDate = new Date(order.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
                        let statusClass = '';
                        switch(order.status) {
                            case 'รอชำระเงิน': statusClass = 'bg-yellow-100 text-yellow-800'; break;
                            case 'รอตรวจสอบการชำระเงิน': statusClass = 'bg-blue-100 text-blue-800'; break;
                            case 'ชำระเงินแล้ว': statusClass = 'bg-green-100 text-green-800'; break;
                            default: statusClass = 'bg-gray-100 text-gray-800';
                        }
                        return `
                            <tr class="hover:bg-gray-50">
                                <td class="border-b border-gray-200 px-4 py-3 font-mono text-sm text-purple-700 break-all">${order.id}</td>
                                <td class="border-b border-gray-200 px-4 py-3">${order.first_name} ${order.last_name}</td>
                                <td class="border-b border-gray-200 px-4 py-3">${order.phone}</td>
                                <td class="border-b border-gray-200 px-4 py-3 text-sm text-gray-600 whitespace-normal">${order.items_summary || 'N/A'}</td>
                                <td class="border-b border-gray-200 px-4 py-3 font-semibold">฿${parseFloat(order.final_amount).toLocaleString()}</td>
                                <td class="border-b border-gray-200 px-4 py-3"><span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${order.status}</span></td>
                                <td class="border-b border-gray-200 px-4 py-3 text-sm text-gray-500">${createdDate}</td>
                            </tr>
                        `;
                    }).join('');
                    ordersTableBody.innerHTML = rowsHtml;
                } else {
                    ordersTableBody.parentElement.classList.add('hidden');
                    emptyStateDiv.classList.remove('hidden');
                }
            } else {
                ordersTableBody.innerHTML = `<tr><td colspan="7" class="text-center p-8 text-red-500">เกิดข้อผิดพลาด: ${data.message}</td></tr>`;
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
            ordersTableBody.innerHTML = `<tr><td colspan="7" class="text-center p-8 text-red-500">ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้</td></tr>`;
        }
    };

    const fetchContacts = async () => {
        contactListContainer.innerHTML = '<p class="text-center text-gray-500 py-8 col-span-full">กำลังโหลดข้อมูลการติดต่อ...</p>';
        try {
            const response = await fetch('api/public/get_contacts.php');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.success && data.contacts.length > 0) {
                renderContacts(data.contacts);
            } else {
                contactListContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">ไม่พบข้อมูลการติดต่อ</p>`;
            }
        } catch (error) {
            console.error('Failed to load contacts:', error);
            contactListContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">ไม่สามารถโหลดข้อมูลการติดต่อได้ กรุณาตรวจสอบการเชื่อมต่อและลองอีกครั้ง</p>`;
        }
    };

    const renderContacts = (contacts) => {
        let html = '';
        contacts.forEach(contact => {
            html += `
                <div class="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 shadow-sm">
                    <div class="text-2xl text-purple-600"><i class="${contact.icon}"></i></div>
                    <div>
                        <div class="font-semibold text-gray-800">${contact.name}</div>
                        <div class="text-gray-600">${contact.value}</div>
                    </div>
                </div>
            `;
        });
        contactListContainer.innerHTML = html;
    };

    // --- Core Logic & Event Listeners ---
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

    const showStep = (stepNumber) => { steps.forEach((step, index) => { step.classList.toggle('hidden', index + 1 !== stepNumber); }); };

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
        loadAndRenderOrders();
    };

    window.switchToContactView = () => {
        state.currentView = 'contact';
        updateTabs(contactTab);
        showView(contactView);
        fetchContacts();
    };

    window.goBackToStep1 = () => showStep(1);
    window.goBackToStep2 = () => showStep(2);
    window.goBackToStep3 = () => showStep(3);

    const handleProductSelection = () => {
        if(!braceletCheckbox || !shirtCheckbox) return;
        braceletQuantityDiv.classList.toggle('hidden', !braceletCheckbox.checked);
        shirtQuantityDiv.classList.toggle('hidden', !shirtCheckbox.checked);
        
        const isShirtSelected = shirtCheckbox.checked;
        genderSelectionDiv.classList.toggle('hidden', !isShirtSelected);
        sizeSelectionDiv.classList.toggle('hidden', !isShirtSelected);

        if (!isShirtSelected) {
            document.querySelectorAll('input[name="gender"]:checked').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="size"]:checked').forEach(radio => radio.checked = false);
        }

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
        if (breakdown === '') { 
            breakdown = '<div>กรุณาเลือกสินค้า</div>'; 
            nextStep1Btn.disabled = true; 
        } else { 
            nextStep1Btn.disabled = false; 
        } 
        priceBreakdownDiv.innerHTML = breakdown; 
        totalPriceSpan.textContent = `฿${total.toLocaleString()}`; 
        state.order.items = items; 
        state.order.total_amount = total + discount; 
        state.order.discount_amount = discount; 
        state.order.final_amount = total; 
    }; 
    
    const paymentOptionsContainer = document.getElementById('paymentOptionsContainer');
    const paymentDetailsContainer = document.getElementById('paymentDetailsContainer');

    const loadPaymentMethods = async () => {
        if (state.paymentMethods && state.paymentMethods.length > 0) {
            if (state.paymentMethods.length > 0) {
                const firstPaymentMethodId = state.paymentMethods[0].id;
                const firstRadio = document.querySelector(`input[name="payment"][value="${firstPaymentMethodId}"]`);
                if (firstRadio) firstRadio.checked = true;
                showPaymentDetail(firstPaymentMethodId);
            }
            return;
        }

        paymentOptionsContainer.innerHTML = `<p class="text-center text-gray-500 py-4 col-span-full">กำลังโหลดวิธีชำระเงิน...</p>`;
        try {
            const response = await fetch('api/public/get_payment_methods.php');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                state.paymentMethods = data.data;
                renderPaymentOptions(data.data);
                renderPaymentDetails(data.data);
                if (data.data.length > 0) {
                    const firstPaymentMethodId = data.data[0].id;
                    document.querySelector(`input[name="payment"][value="${firstPaymentMethodId}"]`).checked = true;
                    showPaymentDetail(firstPaymentMethodId);
                }
            } else {
                paymentOptionsContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">${data.message || 'ไม่พบช่องทางการชำระเงิน'}</p>`;
            }
        } catch (error) {
            console.error('Failed to load payment methods:', error);
            paymentOptionsContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">ไม่สามารถโหลดข้อมูลการชำระเงินได้</p>`;
        }
    };

    const renderPaymentOptions = (paymentMethods) => {
        const html = paymentMethods.map((method, index) => `
            <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input type="radio" name="payment" value="${method.id}" class="mr-3 text-purple-500" data-name="${method.name}">
                <div class="flex-1">
                    <div class="font-medium">${method.type === 'bank_transfer' ? '🏦' : '📱'} ${method.name}</div>
                </div>
            </label>
        `).join('');
        paymentOptionsContainer.innerHTML = html;

        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                showPaymentDetail(e.target.value);
            });
        });
    };

    const renderPaymentDetails = (paymentMethods) => {
        const html = paymentMethods.map(method => {
            if (method.type === 'bank_transfer') {
                return `
                    <div id="payment-detail-${method.id}" class="payment-detail-view hidden mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="text-lg font-semibold text-blue-800 mb-4">🏦 ข้อมูลการโอนเงิน: ${method.name}</h4>
                        <div class="space-y-3">
                            <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                                <span class="text-sm text-gray-600">ธนาคาร:</span>
                                <span class="font-semibold text-gray-800">${method.bank_name}</span>
                            </div>
                            <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                                <span class="text-sm text-gray-600">เลขที่บัญชี:</span>
                                <span class="font-mono text-lg font-semibold text-gray-800">${method.account_number}</span>
                            </div>
                            <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                                <span class="text-sm text-gray-600">ชื่อบัญชี:</span>
                                <span class="font-semibold text-gray-800">${method.account_name}</span>
                            </div>
                        </div>
                        <div class="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                            💡 <strong>หมายเหตุ:</strong> กรุณาโอนเงินตามจำนวนที่แสดง และเก็บหลักฐานการโอนไว้
                        </div>
                    </div>
                `;
            } else if (method.type === 'promptpay') {
                return `
                    <div id="payment-detail-${method.id}" class="payment-detail-view hidden mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="text-lg font-semibold text-blue-800 mb-4">💳 พร้อมเพย์: ${method.name}</h4>
                        <div class="text-center">
                            <div class="bg-white p-6 rounded-lg border inline-block">
                                ${method.qr_code_image ?
                                    `<img src="${method.qr_code_image}" alt="QR Code for ${method.name}" class="w-48 h-48 object-contain mx-auto mb-4">` :
                                    `<div class="w-48 h-48 bg-gray-200 flex items-center justify-center mx-auto mb-4 rounded-lg"><span class="text-gray-500">ไม่มี QR Code</span></div>`
                                }
                                <div class="text-sm text-gray-600">หมายเลขพร้อมเพย์</div>
                                <div class="font-mono text-lg font-semibold text-gray-800">${method.promptpay_id}</div>
                            </div>
                        </div>
                         <div class="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                            💡 <strong>หมายเหตุ:</strong> สแกน QR Code หรือโอนเงินไปยังหมายเลขพร้อมเพย์ข้างต้น
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('');
        paymentDetailsContainer.innerHTML = html;
    };

    const showPaymentDetail = (paymentMethodId) => {
        document.querySelectorAll('.payment-detail-view').forEach(view => view.classList.add('hidden'));
        const detailView = document.getElementById(`payment-detail-${paymentMethodId}`);
        if (detailView) {
            detailView.classList.remove('hidden');
        }
    };

    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        state.order.customer = { first_name: firstNameInput.value, last_name: lastNameInput.value, phone: phoneInput.value };
        
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const selectedSize = document.querySelector('input[name="size"]:checked');
        if (shirtCheckbox.checked && selectedGender && selectedSize) {
            const shirt = state.productList.find(p => p.category === 'shirt');
            const combo = state.productList.find(p => p.category === 'combo');
            const shirtItem = state.order.items.find(item => (shirt && item.product_id === shirt.id) || (combo && item.product_id === combo.id));
            
            if(shirtItem) {
                shirtItem.gender = selectedGender.value === 'male' ? 'ชาย' : 'หญิง';
                shirtItem.size = selectedSize.value;
            }
        }

        let summaryHtml = `<div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-600">ลูกค้า:</span> <span class="font-semibold">${state.order.customer.first_name} ${state.order.customer.last_name}</span></div><div class="flex justify-between"><span class="text-gray-600">เบอร์โทร:</span> <span class="font-semibold">${state.order.customer.phone}</span></div><div class="border-t my-2"></div>`;
        state.order.items.forEach(item => { 
            let details = '';
            if (item.gender) {
                details = ` (${item.gender}, ไซส์ ${item.size})`;
            } else if (item.size) {
                details = ` (ไซส์ ${item.size})`;
            }
            summaryHtml += `<div class="flex justify-between"><span>${item.product_name} x${item.quantity}${details}</span><span class="font-semibold">฿${item.subtotal.toLocaleString()}</span></div>`; 
        });
        summaryHtml += `<div class="border-t my-2"></div><div class="flex justify-between text-lg font-bold text-purple-600"><span>ยอดรวมสุทธิ:</span><span>฿${state.order.final_amount.toLocaleString()}</span></div></div>`;
        
        finalOrderDetailsDiv.innerHTML = summaryHtml;
        confirmationOrderDetailsDiv.innerHTML = summaryHtml;
        
        loadPaymentMethods();
        showStep(3);
    });

    processPaymentBtn.addEventListener('click', () => {
        const selectedRadio = document.querySelector('input[name="payment"]:checked');
        if (!selectedRadio) {
            Swal.fire({ icon: 'warning', title: 'โปรดทราบ', text: 'กรุณาเลือกวิธีชำระเงิน' });
            return;
        }

        Swal.fire({
            title: 'ยืนยันการชำระเงิน',
            text: "คุณได้ทำการโอนเงิน/ชำระเงินเรียบร้อยแล้วใช่หรือไม่?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4ade80',
            cancelButtonColor: '#f87171',
            confirmButtonText: 'ใช่, ชำระแล้ว',
            cancelButtonText: 'ยังไม่'
        }).then((result) => {
            if (result.isConfirmed) {
                state.order.payment_method_id = selectedRadio.value;
                showStep(4);
            }
        });
    });

    paymentSlipInput.addEventListener('change', (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => { previewImage.src = event.target.result; fileNameSpan.textContent = file.name; uploadArea.classList.add('hidden'); uploadPreview.classList.remove('hidden'); }; reader.readAsDataURL(file); } });
    window.clearUpload = () => { paymentSlipInput.value = ''; uploadArea.classList.remove('hidden'); uploadPreview.classList.add('hidden'); };
    
    paymentConfirmationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const slipFile = paymentSlipInput.files[0];
        const transferAmount = document.getElementById('transferAmount').value.trim();
        const transferDate = document.getElementById('transferDate').value.trim();
        const transferTime = document.getElementById('transferTime').value.trim();

        const otherFieldsEmpty = !transferAmount || !transferDate || !transferTime;

        if (!slipFile && otherFieldsEmpty) {
            Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลและแนบสลิปการโอนเงินให้ครบถ้วนครับ' });
            return;
        } else if (!slipFile) {
            Swal.fire({ icon: 'warning', title: 'ยังไม่ได้แนบสลิป', text: 'กรุณาแนบสลิปการโอนเงินเพื่อใช้ในการยืนยันครับ' });
            return;
        } else if (otherFieldsEmpty) {
            Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกจำนวนเงิน, วันที่, และเวลาที่โอนให้ครบถ้วนครับ' });
            return;
        }

        state.order.payment_confirmation = { transfer_amount: transferAmount, transfer_date: transferDate, transfer_time: transferTime, from_bank: document.getElementById('fromBank').value, from_account_name: document.getElementById('fromAccountName').value, slip_file: slipFile };
        const finalFormData = new FormData();
        finalFormData.append('order_data', JSON.stringify({ items: state.order.items, customer: state.order.customer, payment_method_id: state.order.payment_method_id, total_amount: state.order.total_amount, discount_amount: state.order.discount_amount, final_amount: state.order.final_amount }));
        finalFormData.append('payment_confirmation_data', JSON.stringify({ transfer_amount: state.order.payment_confirmation.transfer_amount, transfer_date: state.order.payment_confirmation.transfer_date, transfer_time: state.order.payment_confirmation.transfer_time, from_bank: state.order.payment_confirmation.from_bank, from_account_name: state.order.payment_confirmation.from_account_name }));
        if (state.order.payment_confirmation.slip_file) { finalFormData.append('slip_file', state.order.payment_confirmation.slip_file); }
        
        fetch('api/public/create_order.php', { method: 'POST', body: finalFormData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                finalOrderNumberSpan.textContent = data.order_id;
                showStep(5);
            } else {
                Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: data.message });
            }
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            Swal.fire({ icon: 'error', title: 'การเชื่อมต่อล้มเหลว', text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
        });
    });

    nextStep1Btn.addEventListener('click', () => {
        const isShirtSelected = shirtCheckbox.checked;
        if (isShirtSelected) {
            const selectedGender = document.querySelector('input[name="gender"]:checked');
            if (!selectedGender) {
                Swal.fire({ icon: 'warning', title: 'โปรดทราบ', text: 'กรุณาเลือกเพศสำหรับเสื้อ' });
                return;
            }
            const selectedSize = document.querySelector('input[name="size"]:checked');
            if (!selectedSize) {
                Swal.fire({ icon: 'warning', title: 'โปรดทราบ', text: 'กรุณาเลือกไซส์เสื้อ' });
                return;
            }
        }
        showStep(2);
    });

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
        if (e.target.matches('input[name="gender"]')) { 
             document.querySelectorAll('input[name="gender"] + span').forEach(span => {
                span.parentElement.classList.remove('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-300');
                span.parentElement.classList.add('border-gray-200');
            });
            const selectedLabel = e.target.parentElement;
            if (selectedLabel) {
                selectedLabel.classList.add('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-300');
                selectedLabel.classList.remove('border-gray-200');
            }
        }
    });
    document.getElementById('transferDate').valueAsDate = new Date();

    const init = () => {
        productsTab.addEventListener('click', switchToProductsView);
        newOrderTab.addEventListener('click', () => switchToNewOrder());
        viewOrdersTab.addEventListener('click', switchToOrdersView);
        contactTab.addEventListener('click', switchToContactView);
        statusFilterSelect.addEventListener('change', loadAndRenderOrders);
        searchOrderInput.addEventListener('keyup', () => {
            clearTimeout(state.ordersDebounceTimeout);
            state.ordersDebounceTimeout = setTimeout(loadAndRenderOrders, 500);
        });
        if(braceletCheckbox) braceletCheckbox.addEventListener('change', handleProductSelection);
        if(shirtCheckbox) shirtCheckbox.addEventListener('change', handleProductSelection);

        const showSizeChartLink = document.getElementById('show-size-chart');
        if (showSizeChartLink) {
            showSizeChartLink.addEventListener('click', (e) => {
                e.preventDefault();
                Swal.fire({
                    imageUrl: 'uploads/728125.jpg', // Placeholder, replace with your actual image URL
                    imageAlt: 'ตารางขนาดเสื้อ',
                    imageWidth: 400,
                    width: '50%'
                });
            });
        }

        switchToProductsView();
        loadProductsAndRender();
    };

    init();
});
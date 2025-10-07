document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentView: 'products',
        productList: [],
        order: {
            items: [], // This is now the shopping cart
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

    // Step 1 Elements (New)
    const braceletCheckbox = document.getElementById('braceletCheckbox');
    const braceletQuantityDiv = document.getElementById('braceletQuantity');
    const braceletQtyInput = document.getElementById('braceletQty');
    
    const shirtQtyInput = document.getElementById('shirtQty');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartItemsContainer = document.getElementById('cartItems');

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
                    <button onclick="switchToNewOrder()" class="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">สั่งจอง</button>
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
                    <button onclick="switchToNewOrder()" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">สั่งจอง</button>
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
                        ${combo.image_url ? `<img src="${combo.image_url}" alt="${combo.name}" class="w-64 h-64 object-contain mx-auto mb-4">` : `<div class="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center"><span class="text-5xl">📿+👕</span></div>`}

                        <h4 class="text-xl font-semibold text-gray-800 mb-2 mt-4">คอมโบพิเศษ</h4>
                        <p class="text-gray-600 mb-4">${combo.description}</p>
                        <div class="flex items-center justify-center space-x-4 mb-4">
                            <span class="text-lg text-gray-500 line-through">฿${originalPrice.toLocaleString()}</span>
                            <span class="text-3xl font-bold text-purple-600">฿${parseFloat(combo.price).toLocaleString()}</span>
                        </div>
                        <div class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">ประหยัด ฿${discount.toLocaleString()}!</div>
                    </div>
                    <div class="mt-6">
                        <button onclick="switchToNewOrder()" class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">สั่งจอง</button>
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

        // Update Bracelet Info
        if(bracelet) {
            const braceletLabel = document.getElementById('braceletCheckbox').closest('label');
            if (braceletLabel) {
                braceletLabel.querySelector('.font-medium').textContent = bracelet.name;
                braceletLabel.querySelector('.text-sm').textContent = bracelet.description;
                document.getElementById('braceletPrice').textContent = `฿${parseFloat(bracelet.price)} / ชิ้น`;
                const braceletImage = document.getElementById('braceletImage');
                if (bracelet.image_url && braceletImage) {
                    braceletImage.src = bracelet.image_url;
                    braceletImage.classList.remove('hidden');
                }
            }
        }

        // Update Shirt Info
        if(shirt) {
            const shirtInfoDiv = document.getElementById('shirtInfo');
            if (shirtInfoDiv) {
                shirtInfoDiv.querySelector('.font-medium').textContent = shirt.name;
                shirtInfoDiv.querySelector('.text-sm').textContent = shirt.description;
                document.getElementById('shirtPrice').textContent = `฿${parseFloat(shirt.price)} / ตัว`;
                const shirtImage = document.getElementById('shirtImage');
                if (shirt.image_url && shirtImage) {
                    shirtImage.src = shirt.image_url;
                    shirtImage.classList.remove('hidden');
                }
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
        
        // Update Combo Info
        if(combo && bracelet && shirt) {
            const discount = (parseFloat(bracelet.price) + parseFloat(shirt.price)) - parseFloat(combo.price);
            if(comboSavingsSpan) comboSavingsSpan.textContent = `ประหยัด ฿${discount}`;
            const comboDesc = document.getElementById('comboOption').parentElement.querySelector('.text-sm');
            if(comboDesc) comboDesc.textContent = `เลือกทั้งสองอย่างเพื่อรับราคาพิเศษ ${parseFloat(combo.price)} บาท/ชุด! (ลด ${discount} บาท/ชุด)`;
            const comboImage = document.getElementById('comboImage');
            if (combo.image_url && comboImage) {
                comboImage.src = combo.image_url;
                comboImage.classList.remove('hidden');
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

    let ordersDataTable = null; // Declare outside the function

    const loadAndRenderOrders = async () => {
        const query = searchOrderInput.value;
        const status = statusFilterSelect.value;

        // Show loading indicator
        if (ordersDataTable) {
            ordersDataTable.clear().draw(); // Clear existing data

        } else {
            ordersTableBody.innerHTML = '<tr><td colspan="7" class="text-center p-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>';
        }


        try {
            const response = await fetch(`api/public/get_orders.php?q=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`);
            const data = await response.json();

            if (data.success) {
                lastUpdateSpan.textContent = new Date().toLocaleTimeString();

                if (!ordersDataTable) {
                    // Initialize DataTables if not already initialized
                    ordersDataTable = $('#ordersTable').DataTable({
                        "data": data.orders,
                        "columns": [
                            { "data": "id", "className": "px-6 py-4 whitespace-nowrap font-mono text-sm text-purple-700 break-all" },
                            { "data": null, "render": function(data, type, row) { return row.first_name + ' ' + row.last_name; }, "className": "px-6 py-4 whitespace-nowrap text-sm text-gray-800" },
                            { "data": "phone", "className": "px-6 py-4 whitespace-nowrap text-sm text-gray-800" },
                            { "data": "items_summary", "className": "px-6 py-4 whitespace-normal text-sm text-gray-600", "width": "30%" },
                            { "data": "final_amount", "render": function(data, type, row) { return '฿' + parseFloat(data).toLocaleString(); }, "className": "px-6 py-4 whitespace-nowrap font-semibold text-sm text-gray-800" },
                            { "data": "status", "render": function(data, type, row) {
                                let statusClass = '';
                                switch(data) {
                                    case 'รอชำระเงิน': statusClass = 'bg-yellow-100 text-yellow-800'; break;
                                    case 'รอตรวจสอบการชำระเงิน': statusClass = 'bg-blue-100 text-blue-800'; break;
                                    case 'ชำระเงินแล้ว': statusClass = 'bg-green-100 text-green-800'; break;
                                    default: statusClass = 'bg-gray-100 text-gray-800';
                                }
                                return `<span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${data}</span>`;
                            }, "className": "px-6 py-4 whitespace-nowrap text-sm text-gray-800" },
                            { "data": "created_at", "render": function(data, type, row) {
                                return new Date(data).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
                            }, "className": "px-6 py-4 whitespace-nowrap text-sm text-gray-500" }
                        ],
                        "order": [[ 6, "desc" ]],
                        "paging": true,
                        "searching": false,
                        "info": true,
                        "language": { "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Thai.json" },
                        "destroy": true
                    });
                } else {
                    ordersDataTable.clear().rows.add(data.orders).draw();
                }
                if (data.orders.length > 0) {
                    ordersTableBody.parentElement.classList.remove('hidden');
                    emptyStateDiv.classList.add('hidden');
                } else {
                    ordersTableBody.parentElement.classList.add('hidden');
                    emptyStateDiv.classList.remove('hidden');
                }
            } else {
                if (ordersDataTable) { ordersDataTable.clear().draw(); }
                ordersTableBody.parentElement.classList.add('hidden');
                emptyStateDiv.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
            if (ordersDataTable) { ordersDataTable.clear().draw(); }
            ordersTableBody.parentElement.classList.add('hidden');
            emptyStateDiv.classList.remove('hidden');
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

    // --- Cart Logic ---
    const addToCart = () => {
        const shirt = state.productList.find(p => p.category === 'shirt');
        if (!shirt) return;

        const selectedGenderEl = document.querySelector('input[name="gender"]:checked');
        const selectedSizeEl = document.querySelector('input[name="size"]:checked');
        const quantity = parseInt(shirtQtyInput.value);

        if (!selectedGenderEl) {
            Swal.fire({ icon: 'warning', title: 'โปรดทราบ', text: 'กรุณาเลือกเพศสำหรับเสื้อ' });
            return;
        }
        if (!selectedSizeEl) {
            Swal.fire({ icon: 'warning', title: 'โปรดทราบ', text: 'กรุณาเลือกไซส์เสื้อ' });
            return;
        }
        if (isNaN(quantity) || quantity < 1) {
            Swal.fire({ icon: 'warning', title: 'โปรดทราบ', text: 'กรุณาระบุจำนวนที่ถูกต้อง' });
            return;
        }

        const gender = selectedGenderEl.value === 'male' ? 'ชาย' : 'หญิง';
        const size = selectedSizeEl.value;
        
        const cartItemId = `shirt-${gender}-${size}`;

        const existingItem = state.order.items.find(item => item.cartItemId === cartItemId);
        const unit_price = parseFloat(shirt.price);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * unit_price;
        } else {
            state.order.items.push({
                cartItemId: cartItemId,
                product_id: shirt.id,
                product_name: shirt.name,
                quantity: quantity,
                unit_price: unit_price,
                subtotal: quantity * unit_price,
                gender: gender,
                size: size,
                category: 'shirt'
            });
        }
        
        renderCart();
        updatePrice();
    };

    const updateBraceletInCart = () => {
        const bracelet = state.productList.find(p => p.category === 'bracelet');
        if (!bracelet) return;

        const isSelected = braceletCheckbox.checked;
        const braceletIndex = state.order.items.findIndex(item => item.category === 'bracelet');
        const unit_price = parseFloat(bracelet.price);

        if (isSelected) {
            const quantity = parseInt(braceletQtyInput.value);
            if (braceletIndex > -1) {
                state.order.items[braceletIndex].quantity = quantity;
                state.order.items[braceletIndex].subtotal = quantity * unit_price;
            } else {
                state.order.items.push({
                    cartItemId: 'bracelet',
                    product_id: bracelet.id,
                    product_name: bracelet.name,
                    quantity: quantity,
                    unit_price: unit_price,
                    subtotal: quantity * unit_price,
                    category: 'bracelet'
                });
            }
        } else {
            if (braceletIndex > -1) {
                state.order.items.splice(braceletIndex, 1);
            }
        }
        
        renderCart();
        updatePrice();
    };
    
    window.removeFromCart = (cartItemId) => {
        const itemIndex = state.order.items.findIndex(item => item.cartItemId === cartItemId);
        if (itemIndex > -1) {
            state.order.items.splice(itemIndex, 1);
            renderCart();
            updatePrice();
        }
    };

    const renderCart = () => {
        if (state.order.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 py-4">ตะกร้าของคุณว่างเปล่า</p>';
            return;
        }

        let cartHtml = state.order.items.map(item => {
            const details = item.size ? `(${item.gender}, ไซส์ ${item.size})` : '';
            const icon = item.category === 'shirt' ? '👕' : '📿';
            const subtotal = item.quantity * item.unit_price;
            return `
                <div class="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                    <div class="text-2xl">${icon}</div>
                    <div class="flex-grow">
                        <div class="font-semibold">${item.product_name} ${details}</div>
                        <div class="text-sm text-gray-600">จำนวน: ${item.quantity} x ฿${item.unit_price.toLocaleString()}</div>
                    </div>
                    <div class="font-semibold text-gray-800">฿${subtotal.toLocaleString()}</div>
                    <button onclick="removeFromCart('${item.cartItemId}')" class="text-red-500 hover:text-red-700 font-bold text-xl">
                        &times;
                    </button>
                </div>
            `;
        }).join('');

        cartItemsContainer.innerHTML = cartHtml;
    };

    const updatePrice = () => {
        const braceletInfo = state.productList.find(p => p.category === 'bracelet');
        const shirtInfo = state.productList.find(p => p.category === 'shirt');
        const comboInfo = state.productList.find(p => p.category === 'combo');

        let total = 0;
        let subtotal = 0;
        let discount = 0;
        let breakdown = '';

        const totalBraceletQty = state.order.items
            .filter(i => i.category === 'bracelet')
            .reduce((sum, i) => sum + i.quantity, 0);
        
        const totalShirtQty = state.order.items
            .filter(i => i.category === 'shirt')
            .reduce((sum, i) => sum + i.quantity, 0);

        let comboQty = 0;
        if (comboInfo && braceletInfo && shirtInfo) {
            const discountPerCombo = (parseFloat(braceletInfo.price) + parseFloat(shirtInfo.price)) - parseFloat(comboInfo.price);
            comboQty = Math.min(totalBraceletQty, totalShirtQty);
            discount = comboQty * discountPerCombo;

            if (comboQty > 0) {
                const comboSubtotal = comboQty * parseFloat(comboInfo.price);
                breakdown += `<div>🎁 ${comboInfo.name} x${comboQty}: <span class="font-semibold">฿${comboSubtotal.toLocaleString()}</span></div>`;
            }
        }

        const remainingBraceletQty = totalBraceletQty - comboQty;
        if (remainingBraceletQty > 0 && braceletInfo) {
            const braceletSubtotal = remainingBraceletQty * parseFloat(braceletInfo.price);
            breakdown += `<div>📿 ${braceletInfo.name} x${remainingBraceletQty}: <span class="font-semibold">฿${braceletSubtotal.toLocaleString()}</span></div>`;
        }

        const remainingShirtQty = totalShirtQty - comboQty;
        if (remainingShirtQty > 0 && shirtInfo) {
            // This part is tricky as we lose the size/gender detail in the summary.
            // We'll just show a summary line. The cart has the details.
            const shirtSubtotal = remainingShirtQty * parseFloat(shirtInfo.price);
            breakdown += `<div>👕 ${shirtInfo.name} (ส่วนที่เหลือ) x${remainingShirtQty}: <span class="font-semibold">฿${shirtSubtotal.toLocaleString()}</span></div>`;
        }
        
        // Recalculate total from items
        subtotal = state.order.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        total = subtotal - discount;

        if (state.order.items.length === 0) {
            breakdown = '<div>กรุณาเพิ่มสินค้าลงในตะกร้า</div>';
            nextStep1Btn.disabled = true;
        } else {
            nextStep1Btn.disabled = false;
        }

        priceBreakdownDiv.innerHTML = breakdown;
        totalPriceSpan.textContent = `฿${total.toLocaleString()}`;
        comboOptionCheckbox.checked = comboQty > 0;
        comboSavingsSpan.textContent = discount > 0 ? `ประหยัด ฿${discount.toLocaleString()}` : '';

        state.order.total_amount = subtotal;
        state.order.discount_amount = discount;
        state.order.final_amount = total;
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

    window.switchToNewOrder = () => {
        state.currentView = 'newOrder';
        updateTabs(newOrderTab);
        showView(newOrderView);
        showStep(1);
        // Reset order
        state.order = { items: [], customer: {}, payment: {}, total_amount: 0, discount_amount: 0, final_amount: 0 };
        if(braceletCheckbox) braceletCheckbox.checked = false;
        braceletQuantityDiv.classList.add('hidden');
        braceletQtyInput.value = 1;
        shirtQtyInput.value = 1;
        document.querySelectorAll('input[name="gender"]:checked').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="size"]:checked').forEach(radio => radio.checked = false);
        
        renderCart();
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

    window.updateBraceletQuantity = (change) => {
        let currentValue = parseInt(braceletQtyInput.value);
        currentValue += change;
        if (currentValue < 1) currentValue = 1;
        braceletQtyInput.value = currentValue;
        updateBraceletInCart();
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

        let summaryHtml = `<div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-600">ลูกค้า:</span> <span class="font-semibold">${state.order.customer.first_name} ${state.order.customer.last_name}</span></div><div class="flex justify-between"><span class="text-gray-600">เบอร์โทร:</span> <span class="font-semibold">${state.order.customer.phone}</span></div><div class="border-t my-2"></div>`;
        
        state.order.items.forEach(item => { 
            let details = '';
            if (item.gender) {
                details = ` (${item.gender}, ไซส์ ${item.size})`;
            }
            const subtotal = item.quantity * item.unit_price;
            summaryHtml += `<div class="flex justify-between"><span>${item.product_name} x${item.quantity}${details}</span><span class="font-semibold">฿${subtotal.toLocaleString()}</span></div>`; 
        });

        if (state.order.discount_amount > 0) {
            summaryHtml += `<div class="flex justify-between text-sm"><span class="text-green-600">ส่วนลดคอมโบ:</span><span class="font-semibold text-green-600">-฿${state.order.discount_amount.toLocaleString()}</span></div>`;
        }

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

        if (!slipFile || !transferAmount || !transferDate || !transferTime) {
            Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลและแนบสลิปการโอนเงินให้ครบถ้วนครับ' });
            return;
        }

        Swal.fire({
            title: 'ยืนยันการส่งข้อมูล',
            text: "คุณตรวจสอบข้อมูลการชำระเงินเรียบร้อยแล้วใช่หรือไม่?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'ใช่, ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingSwal = Swal.fire({
                    title: 'กำลังบันทึกข้อมูล...', 
                    text: 'กรุณารอสักครู่',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                const finalFormData = new FormData();
                finalFormData.append('order_data', JSON.stringify({ items: state.order.items, customer: state.order.customer, payment_method_id: state.order.payment_method_id, total_amount: state.order.total_amount, discount_amount: state.order.discount_amount, final_amount: state.order.final_amount }));
                finalFormData.append('payment_confirmation_data', JSON.stringify({ transfer_amount: transferAmount, transfer_date: transferDate, transfer_time: transferTime, from_bank: document.getElementById('fromBank').value, from_account_name: document.getElementById('fromAccountName').value }));
                if (slipFile) { finalFormData.append('slip_file', slipFile); }
                
                fetch('api/public/create_order.php', { method: 'POST', body: finalFormData })
                .then(response => response.json())
                .then(data => {
                    loadingSwal.close();
                    if (data.success) {
                        finalOrderNumberSpan.textContent = data.order_id;
                        showStep(5);
                    } else {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: data.message });
                    }
                })
                .catch(error => {
                    loadingSwal.close();
                    console.error('Error submitting order:', error);
                    Swal.fire({ icon: 'error', title: 'การเชื่อมต่อล้มเหลว', text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
                });
            }
        });
    });

    nextStep1Btn.addEventListener('click', () => {
        if (state.order.items.length === 0) {
            Swal.fire({ icon: 'warning', title: 'ตะกร้าว่างเปล่า', text: 'กรุณาเพิ่มสินค้าลงในตะกร้าก่อนดำเนินการต่อ' });
            return;
        }
        showStep(2);
    });

    document.body.addEventListener('change', (e) => { 
        if (e.target.matches('input[name="size"]') || e.target.matches('input[name="gender"]')) {
            const parentSelector = e.target.matches('input[name="size"]') ? '#sizeSelection' : '#genderSelection';
            document.querySelectorAll(`${parentSelector} label`).forEach(label => { 
                label.classList.remove('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-300'); 
                label.classList.add('border-gray-200'); 
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

        // New Listeners
        braceletCheckbox.addEventListener('change', () => {
            braceletQuantityDiv.classList.toggle('hidden', !braceletCheckbox.checked);
            updateBraceletInCart();
        });
        braceletQtyInput.addEventListener('change', () => updateBraceletInCart());

        addToCartBtn.addEventListener('click', addToCart);

        document.getElementById('shirt-qty-minus').addEventListener('click', () => {
            let val = parseInt(shirtQtyInput.value);
            if (val > 1) shirtQtyInput.value = val - 1;
        });
        document.getElementById('shirt-qty-plus').addEventListener('click', () => {
            shirtQtyInput.value = parseInt(shirtQtyInput.value) + 1;
        });


        const showSizeChartLink = document.getElementById('show-size-chart');
        if (showSizeChartLink) {
            showSizeChartLink.addEventListener('click', (e) => {
                e.preventDefault();
                Swal.fire({
                    imageUrl: 'uploads/728125.jpg',
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
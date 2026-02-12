
        let inventory = [
            { id: 1, name: 'Wireless Mouse Pro', sku: 'WM-001', category: 'Electronics', quantity: 45, price: 29.99 },
            { id: 2, name: 'Mechanical Keyboard RGB', sku: 'MK-002', category: 'Electronics', quantity: 8, price: 89.99 },
            { id: 3, name: 'USB-C Cable Premium', sku: 'UC-003', category: 'Accessories', quantity: 120, price: 12.99 },
            { id: 4, name: 'Laptop Stand Aluminum', sku: 'LS-004', category: 'Furniture', quantity: 15, price: 45.00 },
            { id: 5, name: 'Webcam HD 1080p', sku: 'WC-005', category: 'Electronics', quantity: 3, price: 79.99 },
            { id: 6, name: 'Monitor 27" 4K', sku: 'MN-006', category: 'Electronics', quantity: 0, price: 299.99 },
        ];

        let editingId = null;

        function renderInventory(items = inventory) {
            const tbody = document.getElementById('inventoryBody');
            
            if (items.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 60px 20px;">
                            <div style="font-size: 4em; margin-bottom: 20px; opacity: 0.5;">📭</div>
                            <h3 style="font-size: 1.5em; margin-bottom: 10px;">No products found</h3>
                            <p style="opacity: 0.7;">Try adjusting your filters or add a new product</p>
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = items.map((item, index) => {
                const status = getStatus(item.quantity);
                return `
                    <tr style="animation-delay: ${index * 0.1}s">
                        <td class="product-name">${item.name}</td>
                        <td>${item.sku}</td>
                        <td>${item.category}</td>
                        <td><strong>${item.quantity}</strong></td>
                        <td class="price-tag">$${item.price.toFixed(2)}</td>
                        <td><span class="status-badge status-${status.class}">${status.text}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-warning" onclick="editProduct(${item.id})"><span>✏️ Edit</span></button>
                                <button class="btn btn-danger" onclick="deleteProduct(${item.id})"><span>🗑️ Delete</span></button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function getStatus(quantity) {
            if (quantity === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
            if (quantity <= 10) return { class: 'low-stock', text: 'Low Stock' };
            return { class: 'in-stock', text: 'In Stock' };
        }

        function updateStats() {
            const totalProducts = inventory.length;
            const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const lowStock = inventory.filter(item => item.quantity > 0 && item.quantity <= 10).length;
            const categories = [...new Set(inventory.map(item => item.category))].length;

            document.getElementById('totalProducts').textContent = totalProducts;
            document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            document.getElementById('lowStock').textContent = lowStock;
            document.getElementById('totalCategories').textContent = categories;

            const categoryFilter = document.getElementById('categoryFilter');
            const currentValue = categoryFilter.value;
            const uniqueCategories = [...new Set(inventory.map(item => item.category))];
            categoryFilter.innerHTML = '<option value="">All Categories</option>' +
                uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
            categoryFilter.value = currentValue;
        }

        function filterInventory() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const categoryFilter = document.getElementById('categoryFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;

            const filtered = inventory.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                    item.sku.toLowerCase().includes(searchTerm);
                const matchesCategory = !categoryFilter || item.category === categoryFilter;
                const matchesStatus = !statusFilter || getStatus(item.quantity).class === statusFilter;

                return matchesSearch && matchesCategory && matchesStatus;
            });

            renderInventory(filtered);
        }

        function openAddModal() {
            editingId = null;
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('productForm').reset();
            document.getElementById('productModal').classList.add('active');
        }

        function editProduct(id) {
            const product = inventory.find(item => item.id === id);
            if (!product) return;

            editingId = id;
            document.getElementById('modalTitle').textContent = 'Edit Product';
            document.getElementById('productName').value = product.name;
            document.getElementById('productSKU').value = product.sku;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productModal').classList.add('active');
        }

        function deleteProduct(id) {
            if (confirm('🗑️ Are you sure you want to delete this product?')) {
                inventory = inventory.filter(item => item.id !== id);
                updateStats();
                renderInventory();
            }
        }

        function closeModal() {
            document.getElementById('productModal').classList.remove('active');
        }

        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const product = {
                name: document.getElementById('productName').value,
                sku: document.getElementById('productSKU').value,
                category: document.getElementById('productCategory').value,
                quantity: parseInt(document.getElementById('productQuantity').value),
                price: parseFloat(document.getElementById('productPrice').value)
            };

            if (editingId) {
                const index = inventory.findIndex(item => item.id === editingId);
                inventory[index] = { ...inventory[index], ...product };
            } else {
                product.id = Math.max(...inventory.map(i => i.id), 0) + 1;
                inventory.push(product);
            }

            updateStats();
            renderInventory();
            closeModal();
        });

        document.getElementById('productModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Initialize
        updateStats();
        renderInventory();

    // Get vendor ID from localStorage
    const VENDOR_ID = localStorage.getItem('vendorId');
    if (!VENDOR_ID) {
        showError("Vendor ID not found. Please log in again.");
    }
    
    // API base URL - update this to match your backend URL
    const API_BASE_URL = 'https://sosika-backend.onrender.com/api';  // e.g., 'https://your-api.com/api' or leave empty for same-domain
    
    document.addEventListener('DOMContentLoaded', function() {
        // Set vendor name by fetching from backend
        fetchVendorInfo();
        
        // Fetch initial orders
        fetchOrders();
        
        // Set up filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentFilterStatus = this.dataset.status !== 'all' ? this.dataset.status : null;
                fetchOrders(currentFilterStatus);
            });
        });
        
        // Set up modal close button
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside of it
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('orderModal');
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Set up action buttons in modal
        document.getElementById('progress-order-btn').addEventListener('click', function() {
            updateOrderStatus(currentOrderId, 'in_progress');
        });
        
        document.getElementById('complete-order-btn').addEventListener('click', function() {
            updateOrderStatus(currentOrderId, 'completed');
        });
        
        document.getElementById('cancel-order-btn').addEventListener('click', function() {
            updateOrderStatus(currentOrderId, 'cancelled');
        });
    });
    
    let currentOrderId = null;
    let currentFilterStatus = null; // Track active filter
    
    function fetchVendorInfo() {
        // Replace with actual endpoint to get vendor info
        fetch(`${API_BASE_URL}/vendor/${VENDOR_ID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch vendor info: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('vendor-name').textContent = data.name || `Vendor #${VENDOR_ID}`;
            })
            .catch(error => {
                console.error('Error fetching vendor info:', error);
                document.getElementById('vendor-name').textContent = `Vendor #${VENDOR_ID}`;
            });
    }
    
    function fetchOrders(status = null) {
        showLoader();
        hideError();
    
        let endpoint = `${API_BASE_URL}/orders/vendor/${VENDOR_ID}`;
        // Fix URL parameter construction
        if (status) {
            endpoint += `?status=${status}`;
        }
    
        fetch(endpoint)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Sort orders by datetime descending
                const sortedOrders = data.sort((a, b) => 
                    new Date(b.order_datetime) - new Date(a.order_datetime)
                );
                displayOrders(sortedOrders);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                hideLoader();
                showError(`Failed to load orders: ${error.message}`);
                showEmptyState('Could not load orders. Please try again.');
            });
    }
    
    // Update interval to use current filter
    setInterval(() => {
        fetchOrders(currentFilterStatus);
    }, 20000);
    
    const menuItemsCache = {};

    async function getItemName(menu_item_id) {
        if (menuItemsCache[menu_item_id]) {
            return menuItemsCache[menu_item_id]; // Use cached name
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/menuItems/item/${menu_item_id}`);
            const data = await response.json();
            menuItemsCache[menu_item_id] = data.name;
            return data.name;
        } catch (error) {
            console.error("Error fetching item name:", error);
            return `Item #${menu_item_id}`;
        }
    }
    
    function displayOrders(orders) {
        hideLoader();
        
        const container = document.getElementById('orders-container');
        container.innerHTML = '';
        
        if (!orders || orders.length === 0) {
            showEmptyState();
            return;
        }
        
        hideEmptyState();
        
        orders.forEach(order => {
            const orderCard = createOrderCard(order);
            container.appendChild(orderCard);
        });
    }
    
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        
        const timeAgo = getTimeAgo(new Date(order.order_datetime));
        const itemCount = getItemCount(order.items);
        
        card.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status status-${order.order_status}">${formatStatus(order.order_status)}</span>
            </div>
            <div class="order-info">
                <p>Ordered: <span>${timeAgo}</span></p>
                <p>Items: <span>${itemCount}</span></p>
                <p>Total: <span>$${order.total_amount}</span></p>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary view-details-btn" data-id="${order.id}">View Details</button>
                ${order.order_status === 'pending' ? 
                  `<button class="btn btn-success accept-btn" data-id="${order.id}">Accept Order</button>` : ''}
            </div>
        `;
        
        // Add event listeners to buttons
        setTimeout(() => {
            const viewDetailsBtn = card.querySelector('.view-details-btn');
            viewDetailsBtn.addEventListener('click', function() {
                openOrderModal(order.id);
            });
            
            const acceptBtn = card.querySelector('.accept-btn');
            if (acceptBtn) {
                acceptBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    updateOrderStatus(order.id, 'in_progress');
                });
            }
        }, 0);
        
        return card;
    }
    
    function openOrderModal(orderId) {
        currentOrderId = orderId;
        document.getElementById('modal-body').innerHTML = '<div class="spinner"></div><p>Loading order details...</p>';
        document.getElementById('orderModal').style.display = 'block';
        
        fetch(`${API_BASE_URL}/orders/${orderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch order details: ${response.status}`);
                }
                return response.json();
            })
            .then(order => {
                populateOrderModal(order);
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
                document.getElementById('modal-body').innerHTML = `
                    <div class="error-message">
                        Failed to load order details: ${error.message}
                    </div>
                `;
            });
    }
    
    async function populateOrderModal(order) {
        // Fetch item names asynchronously
        const itemsWithNames = await Promise.all(order.items.map(async (item) => {
            const name = item.name || await getItemName(item.menu_item_id);
            return { ...item, name }; // Return new object with updated name
        }));
    
        // Update modal content
        document.getElementById('modal-body').innerHTML = `
            <h3>Order #${order.id}</h3>
            <div class="order-info">
                <p>Status: <span class="order-status status-${order.order_status}">${formatStatus(order.order_status)}</span></p>
                <p>Ordered on: <span>${new Date(order.order_datetime).toLocaleString()}</span></p>
                <p>${order.requested_asap ? 'Requested ASAP' : `Requested for: <span>${new Date(order.requested_datetime).toLocaleString()}</span>`}</p>
            </div>
            <h4>Items:</h4>
            <div class="order-items">
                ${itemsWithNames.map(item => `
                    <div class="item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>$${item.total_amount}</span>
                    </div>
                `).join('')}
                <div class="order-total">
                    <p>Delivery Fee: $${order.delivery_fee}</p>
                    <p>Total: $${order.total_amount}</p>
                </div>
            </div>
        `;
    
        // Show/hide action buttons based on current status
        const progressBtn = document.getElementById('progress-order-btn');
        const completeBtn = document.getElementById('complete-order-btn');
        const cancelBtn = document.getElementById('cancel-order-btn');
    
        // Reset visibility
        progressBtn.style.display = 'block';
        completeBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
    
        // Adjust based on order status
        if (order.order_status === 'in_progress' || order.order_status === 'completed') {
            progressBtn.style.display = 'none';
        }
        if (order.order_status === 'completed' || order.order_status === 'cancelled') {
            progressBtn.style.display = 'none';
            completeBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }
    }
     
    function closeModal() {
        document.getElementById('orderModal').style.display = 'none';
        currentOrderId = null;
    }
    
    function updateOrderStatus(orderId, newStatus) {
        fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_status: newStatus })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update order status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            showNotification(`Order #${orderId} status updated to ${formatStatus(newStatus)}`);
            closeModal();
            fetchOrders(); // Refresh order list
        })
        .catch(error => {
            console.error('Error updating order status:', error);
            showNotification(`Failed to update order status: ${error.message}`, 'error');
        });
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.borderLeftColor = type === 'success' ? '#2ecc71' : '#e74c3c';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function showLoader() {
        document.querySelector('.loader').style.display = 'block';
        document.getElementById('orders-container').style.display = 'none';
        hideEmptyState();
    }
    
    function hideLoader() {
        document.querySelector('.loader').style.display = 'none';
        document.getElementById('orders-container').style.display = 'grid';
    }
    
    function showEmptyState(message) {
        const emptyState = document.querySelector('.empty-state');
        if (message) {
            emptyState.querySelector('p').textContent = message;
        }
        emptyState.style.display = 'block';
    }
    
    function hideEmptyState() {
        document.querySelector('.empty-state').style.display = 'none';
    }
    
    function showError(message) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
    
    function hideError() {
        document.getElementById('error-container').style.display = 'none';
    }
    
    function formatStatus(status) {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    function getItemCount(items) {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + (item.quantity || 0), 0);
    }
    
    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + " years ago";
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " months ago";
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + " days ago";
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + " hours ago";
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + " minutes ago";
        
        return "just now";
    }


   

    
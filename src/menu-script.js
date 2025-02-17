document.addEventListener('DOMContentLoaded', function () {
    const vendorId = localStorage.getItem('vendorId');
    const menuItemsContainer = document.getElementById('menu-items-container');

    if (!vendorId) {
        alert('Vendor ID not found. Please log in again.');
        window.location.href = '/login.html';
        return;
    }

    const parsedVendorId = parseInt(vendorId, 10);

    fetch(`http://localhost:3000/api/menuItems/${parsedVendorId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderMenuItems(data.menuItems);
            } else {
                alert('Failed to fetch menu items: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching the menu items.');
        });

        function renderMenuItems(menuItems) {
menuItemsContainer.innerHTML = '';

menuItems.forEach(item => {
const itemElement = document.createElement('div');
itemElement.classList.add('menu-item');

const statusClass = item.is_available ? "status available" : "status unavailable";
const statusText = item.is_available ? "Available" : "Unavailable";

itemElement.innerHTML = `
    <img src="${item.image_url}" alt="${item.name}" />
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>Price: $<span class="item-price" data-id="${item.id}">${item.price}</span></p>
    <input type="number" class="price-input" data-id="${item.id}" placeholder="New Price" min="0" step="0.01">
    <button class="update-price-button" data-id="${item.id}">Update Price</button>
    <p class="${statusClass}">Status: ${statusText}</p>
    <button class="update-status-button" data-id="${item.id}" data-available="${item.is_available}">Toggle Status</button>
    <button class="delete-button" data-id="${item.id}">Delete</button>
`;

menuItemsContainer.appendChild(itemElement);
});

// Toggle status event
document.querySelectorAll('.update-status-button').forEach(button => {
button.addEventListener('click', function () {
    const itemId = this.getAttribute('data-id');
    const currentStatus = this.getAttribute('data-available') === 'true';
    const newStatus = !currentStatus;

    fetch(`http://localhost:3000/api/menuItems/${itemId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            this.setAttribute('data-available', newStatus);
            const statusElement = this.previousElementSibling;
            statusElement.textContent = newStatus ? "Status: Available" : "Status: Unavailable";
            statusElement.className = newStatus ? "status available" : "status unavailable";
        } else {
            alert('Failed to update status: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the status.');
    });
});
});

// Update price event
document.querySelectorAll('.update-price-button').forEach(button => {
button.addEventListener('click', function () {
    const itemId = this.getAttribute('data-id');
    const priceInput = document.querySelector(`.price-input[data-id="${itemId}"]`);
    const newPrice = parseFloat(priceInput.value);

    if (isNaN(newPrice) || newPrice <= 0) {
        alert('Please enter a valid price');
        return;
    }

    fetch(`http://localhost:3000/api/menuItems/${itemId}/price`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Price updated successfully!');
            document.querySelector(`.item-price[data-id="${itemId}"]`).textContent = newPrice;
            priceInput.value = '';
        } else {
            alert('Failed to update price: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the price.');
    });
});
});

// Delete event
document.querySelectorAll('.delete-button').forEach(button => {
button.addEventListener('click', function () {
    const itemId = this.getAttribute('data-id');

    if (!confirm('Are you sure you want to delete this menu item?')) return;

    fetch(`http://localhost:3000/api/menuItems/item/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Menu item deleted successfully!');
            renderMenuItems(menuItems.filter(item => item.id !== parseInt(itemId)));
        } else {
            alert('Failed to delete menu item: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the menu item.');
    });
});
});
}

});
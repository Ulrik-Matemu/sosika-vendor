const vendorId = localStorage.getItem('vendorId'); // Replace with actual vendor ID
const API_URL = `http://localhost:3000/api/vendor/${vendorId}`; // Replace with your actual backend URL

async function fetchVendorDetails() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch vendor details");
        }
        const vendor = await response.json();

        // Fill the form with existing details
        document.getElementById("name").value = vendor.name;
        document.getElementById("ownerName").value = vendor.owner_name;
        document.getElementById("collegeId").value = vendor.college_id;
       

        // Show form and hide loading text
        document.getElementById("loading-text").style.display = "none";
        document.querySelector(".login-container").classList.remove("hidden");

        // Initialize map
        initMap(vendor.geolocation);
    } catch (error) {
        document.getElementById("loading-text").textContent = "Error loading vendor details.";
        console.error(error);
    }
}



document.getElementById("vendor-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedData = {};
    const fields = ["name", "ownerName", "collegeId", "password"];

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input.value.trim() !== "") {
            updatedData[field] = input.value.trim();
        }
    });

    if (Object.keys(updatedData).length === 0) {
        document.getElementById("message").textContent = "No changes to update.";
        document.getElementById("message").style.color = "red";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").textContent = "Profile updated successfully!";
            document.getElementById("message").style.color = "green";
        } else {
            throw new Error(result.error || "Failed to update profile");
        }
    } catch (error) {
        document.getElementById("message").textContent = error.message;
        document.getElementById("message").style.color = "red";
    }
});

// Fetch vendor details on page load
fetchVendorDetails();


function navigateAddItem() {
    window.location.href = 'add-menu.html';
}

function navigateMenuItems() {
    window.location.href = 'menu-items.html';
}

function navigateOrders() {
    window.location.href = 'orders.html';
}
function navigateProfile() {
    window.location.href = 'profile.html';
}
function navigateHome() {
    window.location.href = 'dashboard.html';
}
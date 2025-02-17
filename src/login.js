document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            password: document.getElementById('password').value
        };

        fetch('http://localhost:3000/api/vendor/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Vendor login successful") {
                localStorage.setItem('vendorName', data.vendorName);
                localStorage.setItem('vendorId', data.vendorId);
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });
    });
});
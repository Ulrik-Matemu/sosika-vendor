document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            ownerName: document.getElementById('owner-name').value,
            collegeId: document.getElementById('college').value,
            geolocation: document.getElementById('geolocation').value,
            password: document.getElementById('password').value
        };

        fetch('https://sosika-backend.onrender.com/api/vendor/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Vendor registered successfully") {
                alert('Registration successful!');
                window.location.href = '/vendor/index.html';
            } else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during registration.');
        });
    });
});
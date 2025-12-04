// External Google Apps Script URL removed for security
// const SCRIPT_URL = 'REMOVED_EXTERNAL_LINK'; // Replace with your deployed script URL

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactUsForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('button-loader');
            submitBtn.disabled = true;
            submitBtn.value = 'Sending...';
            
            const formData = {
                first_name: form.querySelector('[name="first_name"]').value,
                last_name: form.querySelector('[name="last_name"]').value,
                email: form.querySelector('[name="email"]').value,
                contact_number: form.querySelector('[name="contact_number"]').value,
                city: form.querySelector('[name="city"]').value,
                country: form.querySelector('[name="country_id"] option:checked').text,
                company_name: form.querySelector('[name="company_name"]').value,
                looking_for: form.querySelector('[name="looking_for"] option:checked').text,
                message: form.querySelector('[name="message"]').value
            };
            
            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                
                // Show success modal
                document.getElementById('modal-formSuccess').classList.add('show-modal');
                form.reset();
                
            } catch (error) {
                // Show error modal
                document.getElementById('modal-formError').classList.add('show-modal');
            } finally {
                submitBtn.disabled = false;
                submitBtn.value = "Let's Get Started";
            }
        });
    }
});

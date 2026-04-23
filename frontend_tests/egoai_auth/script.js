document.addEventListener('DOMContentLoaded', function() {
    // Function to handle button click for loading simulation
    function handleButtonClick(event) {
        const button = event.target;
        const originalText = button.textContent; // Store original text
        button.textContent = 'Loading...';
        button.disabled = true;

        // Simulate login/registration process with a timeout
        setTimeout(function() {
            button.textContent = originalText; // Reset to original text
            button.disabled = false;
        }, 2000); // 2 seconds timeout
    }

    // Function to validate password and confirm password match for registration
    function validatePassword() {
        const password = document.getElementById('reg-password'); // Updated ID as per plan
        const confirmPassword = document.getElementById('reg-confirmpassword'); // Updated ID
        if (password && confirmPassword) {
            if (password.value !== confirmPassword.value) {
                alert('Passwords do not match');
                return false;
            }
        }
        return true;
    }

    // Function to switch to registration form
    function showRegistrationForm() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('registration-form').classList.remove('hidden');
    }

    // Function to switch back to login form
    function showLoginForm() {
        document.getElementById('registration-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    }

    // Add event listener for sign-in button
    const signinBtn = document.getElementById('signin-btn');
    if (signinBtn) {
        signinBtn.addEventListener('click', handleButtonClick);
    }

    // Add event listener for register button to switch to registration form
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegistrationForm); // Changed as per plan
    }

    // Add event listener for submit registration button
    const submitRegisterBtn = document.getElementById('submit-register-btn');
    if (submitRegisterBtn) {
        submitRegisterBtn.addEventListener('click', function(event) {
            if (validatePassword()) {
                handleButtonClick(event);
                // Additional registration logic can go here
            }
        });
    }

    // Add event listener for cancel button to switch back to login form
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', showLoginForm); // Changed as per plan
    }
});
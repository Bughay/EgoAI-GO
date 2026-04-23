let isLoginMode = true;

document.getElementById('toggle-btn').addEventListener('click', function() {
  isLoginMode = !isLoginMode;
  const formTitle = document.getElementById('form-title');
  const toggleBtn = document.getElementById('toggle-btn');
  const registrationFields = document.getElementById('registration-fields');
  const formContainer = document.querySelector('.form-container');
  
  if (isLoginMode) {
    formTitle.textContent = 'Login';
    toggleBtn.textContent = 'Switch to Register';
    registrationFields.style.display = 'none';
    formContainer.classList.remove('register-mode');
  } else {
    formTitle.textContent = 'Register';
    toggleBtn.textContent = 'Switch to Login';
    registrationFields.style.display = 'block';
    formContainer.classList.add('register-mode');
  }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const submitBtn = document.getElementById('submit-btn');
  
  // Store original button text
  const originalText = submitBtn.textContent;
  
  // Change button to loading state
  submitBtn.textContent = 'LOADING...';
  submitBtn.style.background = 'linear-gradient(90deg, #333, #666)';
  submitBtn.style.boxShadow = '0 0 20px #00d9ff';
  submitBtn.disabled = true;
  
  // Simulate network request/processing
  setTimeout(() => {
    if (!isLoginMode) {
      // Registration mode
      const firstname = document.getElementById('firstname').value;
      const lastname = document.getElementById('lastname').value;
      const email = document.getElementById('email').value;
      const dateofbirth = document.getElementById('dateofbirth').value;
      const confirmpassword = document.getElementById('confirmpassword').value;
      
      // Validation
      if (!firstname || !lastname || !email || !dateofbirth || !confirmpassword) {
        alert('Please fill in all required fields');
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.style.background = 'linear-gradient(90deg, #00d9ff, #ff00ff)';
        submitBtn.style.boxShadow = '0 5px 15px rgba(0, 217, 255, 0.4)';
        submitBtn.disabled = false;
        return;
      }
      
      if (password !== confirmpassword) {
        alert('Passwords do not match');
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.style.background = 'linear-gradient(90deg, #00d9ff, #ff00ff)';
        submitBtn.style.boxShadow = '0 5px 15px rgba(0, 217, 255, 0.4)';
        submitBtn.disabled = false;
        return;
      }
      
      console.log('Registration Data:', { 
        username, password, firstname, lastname, email, dateofbirth, confirmpassword 
      });
    } else {
      // Login mode
      console.log('Login Data:', { username, password });
    }
    
    // Reset button after 2 seconds
    submitBtn.textContent = originalText;
    submitBtn.style.background = 'linear-gradient(90deg, #00d9ff, #ff00ff)';
    submitBtn.style.boxShadow = '0 5px 15px rgba(0, 217, 255, 0.4)';
    submitBtn.disabled = false;
  }, 2000);
});
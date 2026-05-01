let isLoginMode = true;

document.getElementById('toggle-btn').addEventListener('click', function() {
  isLoginMode = !isLoginMode;
  const formTitle = document.getElementById('form-title');
  const toggleBtn = document.getElementById('toggle-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (isLoginMode) {
    formTitle.textContent = 'Login';
    toggleBtn.textContent = 'Switch to Register';
    submitBtn.textContent = 'Login';
  } else {
    formTitle.textContent = 'Register';
    toggleBtn.textContent = 'Switch to Login';
    submitBtn.textContent = 'Register';
  }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const submitBtn = document.getElementById('submit-btn');

  // Store original button text
  const originalText = submitBtn.textContent;

  // Change button to loading state
  submitBtn.textContent = 'LOADING...';
  submitBtn.style.background = 'linear-gradient(90deg, #333, #666)';
  submitBtn.style.boxShadow = '0 0 20px #00d9ff';
  submitBtn.disabled = true;

  const url = isLoginMode ? 'http://localhost:8080/api/v1/auth/login' : 'http://localhost:8080/api/v1/auth/register';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    // Optional: handle successful response (redirect, show message, etc.)
  })
  .catch(error => {
    console.error('Error:', error);
    // Optional: handle error (show alert, etc.)
  })
  .finally(() => {
    // Reset button to original state
    submitBtn.textContent = originalText;
    submitBtn.style.background = 'linear-gradient(90deg, #00d9ff, #ff00ff)';
    submitBtn.style.boxShadow = '0 5px 15px rgba(0, 217, 255, 0.4)';
    submitBtn.disabled = false;
  });
});
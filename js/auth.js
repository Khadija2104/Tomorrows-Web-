// ============================================
// js/auth.js - Authentication with Backend API
// ============================================

const API_BASE_URL = 'http://localhost:8000/api';

// Check login status on page load
window.onload = function () {
  checkAuthStatus();
};

// Check if user is authenticated
function checkAuthStatus() {
  const token = localStorage.getItem("auth_token");
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  const loginLink = document.querySelector('a[href="login.html"]');
  const signupLink = document.querySelector('a[href="signup.html"]');
  const logoutLink = document.querySelector('a[onclick="logout()"]');

  if (token && user.name) {
    // User is logged in
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) {
      signupLink.textContent = `Hi, ${user.name}`;
      signupLink.style.cursor = 'default';
      signupLink.onclick = (e) => e.preventDefault();
    }
  } else {
    // User not logged in
    if (logoutLink) logoutLink.style.display = "none";
  }
}

// ============================================
// SIGNUP FUNCTION
// ============================================
async function signup() {
  const name = document.getElementById("signupName")?.value;
  const email = document.getElementById("signupEmail")?.value;
  const password = document.getElementById("signupPassword")?.value;

  hideError();

  // Validation
  if (!name || !email || !password) {
    showError("Please fill all fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("Please enter a valid email");
    return;
  }

  // Password validation
  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    return;
  }

  try {
    // Backend API Call
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Save token and user
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      alert('Signup successful! You are now logged in.');
      window.location.href = 'index.html';
    } else {
      showError(result.message || 'Signup failed');
    }

  } catch (error) {
    console.error('Signup error:', error);
    showError('Network error. Please try again.');
  }
}

// ============================================
// LOGIN FUNCTION (BACKEND ENABLED)
// ============================================
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  hideError();

  // Validation
  if (!email || !password) {
    showError("Please fill all fields");
    return;
  }

  try {
    // Backend API Call
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Save token and user
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      alert('Login successful!');

      // Redirect based on role
      if (result.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      showError(result.message || 'Invalid credentials');
    }

  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please try again. Make sure backend is running.');
  }
}

// ============================================
// LOGOUT FUNCTION
// ============================================
async function logout() {
  const token = localStorage.getItem('auth_token');

  try {
    // Call logout API
    if (token && !token.startsWith('demo-token')) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Clear local storage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  
  alert('Logged out successfully!');
  window.location.href = 'index.html';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Show error message
function showError(message) {
  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
  } else {
    alert(message);
  }
}

// Hide error message
function hideError() {
  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }
}

// Check if user is authenticated (for protected pages)
function isAuthenticated() {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}

// Get auth token
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

// Check if current user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user.role === 'admin';
}
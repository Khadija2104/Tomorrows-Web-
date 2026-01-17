
// ============================================
// js/config.js - API Configuration
// Create this file: js/config.js
// ============================================
const API_BASE_URL = 'http://localhost:8000/api';

// ============================================
// js/auth.js - Complete Authentication
// Replace your existing js/auth.js with this
// ============================================

// Check login status on page load
window.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('auth_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const loginLink = document.querySelector('a[href="login.html"]');
  const signupLink = document.querySelector('a[href="signup.html"]');
  const logoutLink = document.querySelector('a[onclick="logout()"]');

  if (token && user.name) {
    // User is logged in
    if (loginLink) loginLink.style.display = 'none';
    if (signupLink) {
      signupLink.textContent = `Hi, ${user.name}`;
      signupLink.style.cursor = 'default';
      signupLink.onclick = (e) => e.preventDefault();
    }
  } else {
    // User not logged in
    if (logoutLink) logoutLink.style.display = 'none';
  }
  
  // Handle Google OAuth callback
  handleGoogleCallback();
});

// Handle Google OAuth callback
function handleGoogleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');
  
  if (token) {
    localStorage.setItem('auth_token', token);
    if (userStr) {
      try {
        localStorage.setItem('user', decodeURIComponent(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    // Redirect to clean URL
    window.location.href = 'index.html';
  }
}

// Google Login
function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`;
}

// Regular signup
function signup() {
  const name = document.getElementById('signupName')?.value;
  const email = document.getElementById('signupEmail')?.value;
  const password = document.getElementById('signupPassword')?.value;

  if (!name || !email || !password) {
    alert('Please fill all fields');
    return;
  }

  // For demo - store locally
  const user = { name, email, role: 'user' };
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('auth_token', 'demo-token-' + Date.now());
  
  alert('Signup successful! For full features, use Google Login.');
  window.location.href = 'index.html';
}

// Regular login
function login() {
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }

  // For demo - store locally
  const user = { name: email.split('@')[0], email, role: 'user' };
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('auth_token', 'demo-token-' + Date.now());
  
  alert('Login successful!');
  window.location.href = 'index.html';
}

// Logout
async function logout() {
  const token = localStorage.getItem('auth_token');
  
  if (token && !token.startsWith('demo-token')) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  alert('Logged out successfully!');
  window.location.href = 'index.html';
}

// ============================================
// js/menu.js - Menu Click Handler
// Replace your existing js/menu.js with this
// ============================================

function handleMenuClick(category) {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    alert('Please login first to view dishes.');
    window.location.href = 'login.html';
  } else {
    window.location.href = `pages/${category}.html`;
  }
}

// ============================================
// js/api.js - NEW FILE - API Functions
// Create this file: js/api.js
// ============================================

// Load food items from API
async function loadFoodImages(category) {
  try {
    showLoading();
    
    const response = await fetch(`${API_BASE_URL}/food-items/category/${category}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load food items');
    }

    const result = await response.json();
    
    hideLoading();
    
    if (result.success && result.data && result.data.length > 0) {
      displayFoodItems(result.data, category);
    } else {
      showEmptyState();
    }
  } catch (error) {
    console.error('Error loading food items:', error);
    hideLoading();
    showErrorState(error.message);
  }
}

// Display food items in gallery
function displayFoodItems(items, category) {
  // Find the gallery container based on category
  const containerIds = {
    'korean': 'foodImages',
    'japanese': 'japaneseImages',
    'thai': 'thaiImages',
    'mexican': 'mexicanImages',
    'sweets': 'foodImages',
    'drinks': 'drinksImages'
  };
  
  const containerId = containerIds[category] || 'foodImages';
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  // Clear existing static images
  container.innerHTML = '';
  
  // Add items from API
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'food-item';
    itemDiv.innerHTML = `
      <img src="${item.image_url || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(item.name)}" 
           alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(item.name)}'">
      <div class="food-info">
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
        <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

// Show loading state
function showLoading() {
  const containers = ['foodImages', 'japaneseImages', 'thaiImages', 'mexicanImages', 'drinksImages'];
  containers.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = '<p style="text-align:center; padding:40px; color:#fff;">Loading...</p>';
    }
  });
}

// Hide loading state
function hideLoading() {
  // Loading will be replaced by actual content or error message
}

// Show empty state
function showEmptyState() {
  const container = document.querySelector('.gallery-grid');
  if (container) {
    container.innerHTML = '<p style="text-align:center; padding:40px; color:#fff;">No items found in this category.</p>';
  }
}

// Show error state
function showErrorState(message) {
  const container = document.querySelector('.gallery-grid');
  if (container) {
    container.innerHTML = `<p style="text-align:center; padding:40px; color:#fff;">Error: ${message}</p>`;
  }
}

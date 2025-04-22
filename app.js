// ZYLOX Agency Dashboard - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initApp();
});

// Current user data (will be set after login)
let currentUser = null;

// Page states
const AppState = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard'
};

// Current application state
let currentState = AppState.LOGIN;

// App initialization
function initApp() {
  // Register service workers if needed
  // registerServiceWorkers();

  // Load initial state (check if user is logged in)
  checkAuthStatus();
  
  // Register event listeners
  registerEventListeners();

  // Initialize date display
  updateDateDisplay();
}

// Check authentication status
function checkAuthStatus() {
  // For this simple implementation, we'll check if there's a stored user in localStorage
  const storedUser = localStorage.getItem('zylox_user');
  
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      navigateTo(AppState.DASHBOARD);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      navigateTo(AppState.LOGIN);
    }
  } else {
    navigateTo(AppState.LOGIN);
  }
}

// Register global event listeners
function registerEventListeners() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Handle navigation based on URL hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Listen for login form submission
  document.addEventListener('submit', function(e) {
    const loginForm = document.getElementById('login-form');
    if (e.target === loginForm) {
      e.preventDefault();
      handleLogin();
    }
  });

  // Initialize logout buttons
  document.addEventListener('click', function(e) {
    if (e.target.closest('#logout-btn') || e.target.closest('#dropdown-logout')) {
      e.preventDefault();
      handleLogout();
    }
  });

  // Toggle password visibility
  document.addEventListener('click', function(e) {
    if (e.target.closest('.toggle-password')) {
      togglePasswordVisibility(e);
    }
  });

  // Initialize dropdowns
  const dropdownTriggers = ['notification-bell', 'messages-icon', 'user-menu-toggle'];
  dropdownTriggers.forEach(id => {
    const trigger = document.getElementById(id);
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(this);
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', closeAllDropdowns);

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// Navigate to a specific app state
function navigateTo(state) {
  currentState = state;
  
  // Clear the app container
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = '';
  
  // Load the appropriate template
  let template;
  switch (state) {
    case AppState.LOGIN:
      template = document.getElementById('login-template');
      break;
    case AppState.DASHBOARD:
      template = document.getElementById('dashboard-template');
      break;
    default:
      template = document.getElementById('login-template');
  }
  
  // Clone and append the template content
  const content = template.content.cloneNode(true);
  appContainer.appendChild(content);
  
  // Initialize the new view
  if (state === AppState.DASHBOARD) {
    initDashboard();
  } else if (state === AppState.LOGIN) {
    initLogin();
  }

  // Initialize GSAP animations
  initAnimations(state);
}

// Initialize login page
function initLogin() {
  // Reset form fields if needed
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.reset();
  }
}

// Initialize dashboard
function initDashboard() {
  // Update user profile information
  updateUserProfile();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize performance chart
  initPerformanceChart();
  
  // Update date display
  updateDateDisplay();
}

// Initialize GSAP animations
function initAnimations(state) {
  if (state === AppState.LOGIN) {
    // Animate login card
    gsap.from('.auth-card', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Animate form elements
    gsap.from('.form-group', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.3,
      ease: 'power2.out'
    });
    
    // Animate login button
    gsap.from('.login-btn', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.6,
      ease: 'power2.out'
    });
    
    // Animate hero content
    gsap.from('.hero-content', {
      x: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power2.out'
    });
    
    // Animate feature items
    gsap.from('.feature-item', {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      delay: 0.7,
      ease: 'power2.out'
    });
  } else if (state === AppState.DASHBOARD) {
    // Animate sidebar
    gsap.from('.sidebar', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Animate sidebar navigation items
    gsap.from('.nav-item', {
      x: -20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.out'
    });
    
    // Animate header
    gsap.from('.header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
    
    // Animate header elements
    gsap.from('.action-item', {
      y: -10,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      delay: 0.4,
      ease: 'power2.out'
    });
    
    // Animate stats cards
    gsap.from('.stat-card', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.6,
      ease: 'power2.out'
    });
    
    // Animate dashboard cards
    gsap.from('.dashboard-card', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      delay: 0.8,
      ease: 'power2.out'
    });
  }
}

// Handle login form submission
function handleLogin() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.querySelector('.login-btn');
  
  if (!usernameInput || !passwordInput) return;
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username || !password) {
    showNotification('Please enter both username and password', 'error');
    return;
  }
  
  // Show loading state
  loginBtn.querySelector('span').textContent = 'Signing In';
  loginBtn.disabled = true;
  loginBtn.querySelector('.spinner').classList.remove('hidden');
  
  // Simulate API request with setTimeout
  setTimeout(() => {
    // Validate against the passwords.js data
    const user = validateUser(username, password);
    
    if (user) {
      // Store user in localStorage (in a real app, you'd use a token-based approach)
      localStorage.setItem('zylox_user', JSON.stringify(user));
      currentUser = user;
      
      // Navigate to dashboard
      navigateTo(AppState.DASHBOARD);
    } else {
      // Show error
      showNotification('Invalid username or password', 'error');
      
      // Reset loading state
      loginBtn.querySelector('span').textContent = 'Sign In';
      loginBtn.disabled = false;
      loginBtn.querySelector('.spinner').classList.add('hidden');
    }
  }, 1000);
}

// Validate user credentials against stored users
function validateUser(username, password) {
  // Using the users array from passwords.js
  if (typeof users !== 'undefined' && Array.isArray(users)) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // Don't return the password to the client
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  return null;
}

// Handle user logout
function handleLogout() {
  // Clear user data
  localStorage.removeItem('zylox_user');
  currentUser = null;
  
  // Navigate to login
  navigateTo(AppState.LOGIN);
}

// Toggle password visibility
function togglePasswordVisibility(e) {
  const button = e.target.closest('.toggle-password');
  const passwordInput = button.closest('.input-wrapper').querySelector('input');
  const icon = button.querySelector('i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.className = 'ri-eye-off-line';
  } else {
    passwordInput.type = 'password';
    icon.className = 'ri-eye-line';
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  document.body.classList.toggle('sidebar-open');
  
  const menuButton = document.getElementById('mobile-menu-toggle');
  if (menuButton) {
    const icon = menuButton.querySelector('i');
    
    if (document.body.classList.contains('sidebar-open')) {
      icon.className = 'ri-close-line';
      // Create overlay if it doesn't exist
      if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', toggleMobileMenu);
        document.body.appendChild(overlay);
      }
    } else {
      icon.className = 'ri-menu-line';
      // Remove overlay
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.remove();
      }
    }
  }
}

// Toggle dropdown menus
function toggleDropdown(element) {
  const dropdown = element.querySelector('.dropdown');
  
  // Close all other dropdowns first
  closeAllDropdowns();
  
  // Toggle the clicked dropdown
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

// Close all dropdown menus
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active');
  });
}

// Toggle dark/light theme
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  
  const themeIcon = document.querySelector('#theme-toggle i');
  if (themeIcon) {
    if (document.body.classList.contains('dark-mode')) {
      themeIcon.className = 'ri-sun-line';
    } else {
      themeIcon.className = 'ri-moon-line';
    }
  }
}

// Update user profile information
function updateUserProfile() {
  if (!currentUser) return;
  
  // Update sidebar user profile
  const userName = document.getElementById('user-name');
  const userRole = document.getElementById('user-role');
  const userAvatar = document.getElementById('user-avatar');
  const userInitials = document.getElementById('user-initials');
  
  // Update header user avatar
  const headerUserAvatar = document.getElementById('header-user-avatar');
  const headerUserInitials = document.getElementById('header-user-initials');
  
  if (userName) userName.textContent = currentUser.name;
  if (userRole) userRole.textContent = currentUser.role;
  
  // Handle avatar or initials
  const initials = getInitials(currentUser.name);
  
  if (userAvatar && headerUserAvatar) {
    if (currentUser.avatar) {
      userAvatar.src = currentUser.avatar;
      userAvatar.style.display = 'block';
      userInitials.style.display = 'none';
      
      headerUserAvatar.src = currentUser.avatar;
      headerUserAvatar.style.display = 'block';
      headerUserInitials.style.display = 'none';
    } else {
      userAvatar.style.display = 'none';
      userInitials.style.display = 'flex';
      userInitials.textContent = initials;
      
      headerUserAvatar.style.display = 'none';
      headerUserInitials.style.display = 'flex';
      headerUserInitials.textContent = initials;
    }
  }
}

// Get initials from name
function getInitials(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Initialize navigation
function initNavigation() {
  // Get current hash from URL
  const currentHash = window.location.hash.substring(1) || 'dashboard';
  
  // Update active navigation item
  updateActiveNavItem(currentHash);
  
  // Update page title and content
  updatePageContent(currentHash);
}

// Handle hash change for navigation
function handleHashChange() {
  // Get current hash from URL
  const currentHash = window.location.hash.substring(1) || 'dashboard';
  
  // Update active navigation item
  updateActiveNavItem(currentHash);
  
  // Update page title and content
  updatePageContent(currentHash);
}

// Update active navigation item
function updateActiveNavItem(hash) {
  // Remove active class from all items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to current item
  const currentItem = document.querySelector(`.nav-item[data-page="${hash}"]`);
  if (currentItem) {
    currentItem.classList.add('active');
  }
}

// Update page title and content based on current hash
function updatePageContent(hash) {
  // Get page title element
  const pageTitle = document.getElementById('page-title');
  if (!pageTitle) return;
  
  // Set page title based on hash
  switch (hash) {
    case 'dashboard':
      pageTitle.textContent = 'Dashboard';
      break;
    case 'projects':
      pageTitle.textContent = 'Projects';
      break;
    case 'team':
      pageTitle.textContent = 'Team Members';
      break;
    case 'messages':
      pageTitle.textContent = 'Messages';
      break;
    case 'social-media':
      pageTitle.textContent = 'Social Media';
      break;
    case 'settings':
      pageTitle.textContent = 'Settings';
      break;
    default:
      pageTitle.textContent = 'Dashboard';
  }
  
  // In a more complex app, we would load content for each page here
  // For this demo, we'll just keep the dashboard content visible
}

// Initialize performance chart
function initPerformanceChart() {
  const chartContainer = document.getElementById('performance-chart');
  if (!chartContainer) return;
  
  // For this demo, we'll create a simple bar chart using CSS
  const teamData = [
    { name: 'Moeed', performance: 85 },
    { name: 'Ahmad', performance: 75 },
    { name: 'Hasnain', performance: 90 },
    { name: 'Amaima', performance: 80 },
    { name: 'Shahram', performance: 70 }
  ];
  
  let chartHTML = `<div class="performance-chart-container">`;
  
  teamData.forEach((member, index) => {
    chartHTML += `
      <div class="performance-bar-container">
        <div class="performance-bar-label">${member.name}</div>
        <div class="performance-bar-wrapper">
          <div class="performance-bar-background"></div>
          <div class="performance-bar-fill" style="width: ${member.performance}%" data-index="${index}"></div>
        </div>
        <div class="performance-bar-value">${member.performance}%</div>
      </div>
    `;
  });
  
  chartHTML += `</div>`;
  chartContainer.innerHTML = chartHTML;
  
  // Animate the bars with GSAP
  gsap.from('.performance-bar-fill', {
    width: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.5
  });
}

// Update date display
function updateDateDisplay() {
  const dateDisplay = document.getElementById('date-display');
  if (!dateDisplay) return;
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const today = new Date();
  dateDisplay.textContent = today.toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${message}
    </div>
  `;
  
  // Append to body
  document.body.appendChild(notification);
  
  // Animate in
  gsap.fromTo(notification, 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3 }
  );
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    gsap.to(notification, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        notification.remove();
      }
    });
  }, 3000);
}
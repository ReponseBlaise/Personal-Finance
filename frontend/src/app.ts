import { store } from './store';
import { setupLoginPage } from './pages/login';
import { setupRegisterPage } from './pages/register';
import { setupDashboard } from './pages/dashboard';
import { setDisplay, getText, setText } from './dom';

function initializeApp(): void {
  // Check if user is already authenticated
  if (store.isAuthenticated()) {
    showDashboard();
  } else {
    showLoginPage();
  }

  // Subscribe to auth state changes
  store.subscribe(() => {
    const state = store.getState();
    if (state.auth.token && state.auth.user) {
      showDashboard();
    } else {
      showLoginPage();
    }
  });
}

function showLoginPage(): void {
  const loginPage = document.getElementById('loginPage');
  const registerPage = document.getElementById('registerPage');
  const dashboard = document.getElementById('dashboard');

  if (loginPage) setDisplay(loginPage, 'flex');
  if (registerPage) setDisplay(registerPage, 'none');
  if (dashboard) setDisplay(dashboard, 'none');

  setupLoginPage();
  setupRegisterPage();
}

async function showDashboard(): Promise<void> {
  const loginPage = document.getElementById('loginPage');
  const registerPage = document.getElementById('registerPage');
  const dashboard = document.getElementById('dashboard');
  const userEmail = document.getElementById('userEmail');

  if (loginPage) setDisplay(loginPage, 'none');
  if (registerPage) setDisplay(registerPage, 'none');
  if (dashboard) setDisplay(dashboard, 'flex');

  const state = store.getState();
  if (userEmail && state.auth.user) {
    setText(userEmail, state.auth.user.email);
  }

  await setupDashboard();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

import './styles.css';
import { store } from './store';
import { setupLoginPage } from './pages/login';
import { setupRegisterPage } from './pages/register';
import { setupOverviewPage } from './pages/overview';
import { setupTransactionsPage } from './pages/transactions';
import { setupBudgetsPage } from './pages/budgets';
import { setupPotsPage } from './pages/pots';
import { setDisplay } from './dom';

let dashboardInitialized = false;

function initializeApp(): void {
  setupLoginPage();
  setupRegisterPage();

  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  if (token && userJson) {
    try {
      const user = JSON.parse(userJson) as import('./types').User;
      store.setAuthResponse({ token, user });
    } catch {
      showLoginPage();
    }
  } else {
    showLoginPage();
  }

  store.subscribe(() => {
    const state = store.getState();
    if (state.auth.token && state.auth.user) {
      showDashboard();
    } else {
      dashboardInitialized = false;
      showLoginPage();
    }
  });
}

function showLoginPage(): void {
  const loginPage = document.getElementById('loginPage');
  const registerPage = document.getElementById('registerPage');
  const dashboardContainer = document.getElementById('dashboardContainer');

  if (loginPage) setDisplay(loginPage, 'flex');
  if (registerPage) setDisplay(registerPage, 'none');
  if (dashboardContainer) setDisplay(dashboardContainer, 'none');
}

async function showDashboard(): Promise<void> {
  const loginPage = document.getElementById('loginPage');
  const registerPage = document.getElementById('registerPage');
  const dashboardContainer = document.getElementById('dashboardContainer');
  const userEmail = document.getElementById('userEmail');

  if (loginPage) setDisplay(loginPage, 'none');
  if (registerPage) setDisplay(registerPage, 'none');
  if (dashboardContainer) {
    setDisplay(dashboardContainer, 'flex');
    const app = document.getElementById('app');
    if (app) {
      app.style.alignItems = 'stretch';
      app.style.justifyContent = 'stretch';
      app.style.padding = '0';
    }
  }

  const state = store.getState();
  if (userEmail && state.auth.user) {
    userEmail.textContent = state.auth.user.email;
  }

  if (!dashboardInitialized) {
    dashboardInitialized = true;

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', () => {
      store.clearAuth();
    });

    setupNavigation();
    setupMenuToggle();
    await navigateToPage('overview');
  }
}

function setupNavigation(): void {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const page = (e.currentTarget as HTMLElement).getAttribute('data-page');
      if (page) {
        await navigateToPage(page as 'overview' | 'transactions' | 'budgets' | 'pots' | 'recurring-bills');
      }
    });
  });
}

function setupMenuToggle(): void {
  const minimizeBtn = document.getElementById('minimizeBtn');
  const sidebar = document.querySelector('.sidebar');

  if (!minimizeBtn || !sidebar) return;

  // Load minimized state from localStorage
  const isMinimized = localStorage.getItem('sidebarMinimized') === 'true';
  if (isMinimized) {
    sidebar.classList.add('minimized');
    minimizeBtn.textContent = 'Expand Menu';
  }

  // Toggle minimize state on button click
  minimizeBtn.addEventListener('click', () => {
    sidebar.classList.toggle('minimized');
    const minimized = sidebar.classList.contains('minimized');
    localStorage.setItem('sidebarMinimized', String(minimized));
    minimizeBtn.textContent = minimized ? 'Expand Menu' : 'Minimize Menu';
  });
}

async function navigateToPage(pageName: 'overview' | 'transactions' | 'budgets' | 'pots' | 'recurring-bills'): Promise<void> {
  // Update active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`[data-page="${pageName}"]`);
  activeLink?.classList.add('active');

  // Hide all pages
  const pages = document.querySelectorAll('.pages-container .page');
  pages.forEach(page => page.classList.remove('active'));

  // Update page title
  const titles: Record<string, string> = {
    overview: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets',
    pots: 'Pots',
    'recurring-bills': 'Recurring Bills',
  };

  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = titles[pageName];
  }

  // Show selected page
  const pageIds: Record<string, string> = {
    overview: 'overviewPage',
    transactions: 'transactionsPage',
    budgets: 'budgetsPage',
    pots: 'potsPage',
    'recurring-bills': 'recurringPage',
  };

  const page = document.getElementById(pageIds[pageName]);
  if (page) {
    page.classList.add('active');
  }

  // Load page-specific content
  try {
    switch (pageName) {
      case 'overview':
        await setupOverviewPage();
        break;
      case 'transactions':
        await setupTransactionsPage();
        break;
      case 'budgets':
        await setupBudgetsPage();
        break;
      case 'pots':
        await setupPotsPage();
        break;
      case 'recurring-bills':
        // No setup needed for recurring bills yet
        break;
    }
  } catch (error) {
    console.error(`Failed to load page ${pageName}:`, error);
  }

  store.setCurrentPage(pageName);
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

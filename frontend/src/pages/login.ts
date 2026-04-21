import { ApiClient } from '../api';
import { store } from '../store';
import { validateEmail, validatePassword, getInputValue, clearInput, setDisplay } from '../dom';
import { LoginRequest } from '../types';

export function setupLoginPage(): void {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  const loginError = document.getElementById('loginError') as HTMLDivElement | null;
  const signupLink = document.getElementById('signupLink') as HTMLAnchorElement | null;

  if (!loginForm || !emailInput || !passwordInput || !loginError) {
    console.error('Login form elements not found');
    return;
  }

  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = getInputValue('#email');
    const password = getInputValue('#password');

    // Validation
    if (!email || !validateEmail(email)) {
      loginError.textContent = 'Please enter a valid email';
      return;
    }

    if (!password || !validatePassword(password)) {
      loginError.textContent = 'Password must be at least 8 characters';
      return;
    }

    store.setAuthLoading(true);

    const request: LoginRequest = { email, password };
    const response = await ApiClient.login(request);

    if (response.success) {
      ApiClient.setToken(response.data.token);
      store.setAuthResponse(response.data);
      clearInput('#email');
      clearInput('#password');
      // Navigation will be handled by the main app
    } else {
      loginError.textContent = response.error;
    }

    store.setAuthLoading(false);
  });

  if (signupLink) {
    signupLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      setDisplay(document.getElementById('loginPage') as HTMLElement, 'none');
      setDisplay(document.getElementById('registerPage') as HTMLElement, 'flex');
    });
  }
}

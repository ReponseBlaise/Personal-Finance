import { ApiClient } from '../api';
import { store } from '../store';
import { validateEmail, validatePassword, getInputValue, clearInput, setDisplay } from '../dom';
import { RegisterRequest } from '../types';

export function setupRegisterPage(): void {
  const registerForm = document.getElementById('registerForm') as HTMLFormElement | null;
  const emailInput = document.getElementById('registerEmail') as HTMLInputElement | null;
  const passwordInput = document.getElementById('registerPassword') as HTMLInputElement | null;
  const confirmPasswordInput = document.getElementById(
    'confirmPassword'
  ) as HTMLInputElement | null;
  const registerError = document.getElementById('registerError') as HTMLDivElement | null;
  const loginLink = document.getElementById('loginLink') as HTMLAnchorElement | null;

  if (!registerForm || !emailInput || !passwordInput || !confirmPasswordInput || !registerError) {
    console.error('Register form elements not found');
    return;
  }

  registerForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    registerError.textContent = '';

    const email = getInputValue('#registerEmail');
    const password = getInputValue('#registerPassword');
    const confirmPassword = getInputValue('#confirmPassword');

    // Validation
    if (!email || !validateEmail(email)) {
      registerError.textContent = 'Please enter a valid email';
      return;
    }

    if (!password || !validatePassword(password)) {
      registerError.textContent = 'Password must be at least 8 characters';
      return;
    }

    if (password !== confirmPassword) {
      registerError.textContent = 'Passwords do not match';
      return;
    }

    store.setAuthLoading(true);

    const request: RegisterRequest = { email, password };
    const response = await ApiClient.register(request);

    if (response.success) {
      ApiClient.setToken(response.data.token);
      store.setAuthResponse(response.data);
      clearInput('#registerEmail');
      clearInput('#registerPassword');
      clearInput('#confirmPassword');
      // Navigation will be handled by the main app
    } else {
      registerError.textContent = response.error;
    }

    store.setAuthLoading(false);
  });

  if (loginLink) {
    loginLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      setDisplay(document.getElementById('registerPage') as HTMLElement, 'none');
      setDisplay(document.getElementById('loginPage') as HTMLElement, 'flex');
    });
  }
}

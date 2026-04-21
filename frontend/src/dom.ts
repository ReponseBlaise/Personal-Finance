// Safe DOM element selection with type guards
export function getElement<T extends HTMLElement>(
  selector: string,
  expectedType?: new () => T
): T {
  const element = document.querySelector(selector);
  
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  if (expectedType && !(element instanceof expectedType)) {
    throw new Error(
      `Element "${selector}" is not of expected type ${expectedType.name}`
    );
  }

  return element as T;
}

export function getElements<T extends HTMLElement>(
  selector: string,
  expectedType?: new () => T
): T[] {
  const elements = Array.from(document.querySelectorAll(selector));

  if (expectedType) {
    elements.forEach((element) => {
      if (!(element instanceof expectedType)) {
        throw new Error(
          `Element "${selector}" is not of expected type ${expectedType.name}`
        );
      }
    });
  }

  return elements as T[];
}

// Form input helpers with type safety
export function getInputValue(selector: string): string {
  const element = getElement<HTMLInputElement>(selector, HTMLInputElement);
  return element.value;
}

export function setInputValue(selector: string, value: string): void {
  const element = getElement<HTMLInputElement>(selector, HTMLInputElement);
  element.value = value;
}

export function getSelectValue(selector: string): string {
  const element = getElement<HTMLSelectElement>(selector, HTMLSelectElement);
  return element.value;
}

export function clearInput(selector: string): void {
  const element = getElement<HTMLInputElement>(selector, HTMLInputElement);
  element.value = '';
}

// Class manipulation
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

// Visibility helpers
export function show(element: HTMLElement): void {
  element.style.display = '';
}

export function hide(element: HTMLElement): void {
  element.style.display = 'none';
}

export function setDisplay(element: HTMLElement, display: string): void {
  element.style.display = display;
}

// Event helpers
export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void
): () => void {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

// HTML content
export function setHTML(element: HTMLElement, html: string): void {
  element.innerHTML = html;
}

export function getText(element: HTMLElement): string {
  return element.textContent || '';
}

export function setText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

// Number formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

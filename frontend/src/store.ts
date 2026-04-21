import { AppState, AuthState, AuthResponse, Transaction, FinancialSummary, User } from './types';

export class Store {
  private state: AppState = {
    auth: {
      token: localStorage.getItem('token'),
      user: this.loadUser(),
      isLoading: false,
      error: null,
    },
    transactions: [],
    summary: null,
    isLoading: false,
    error: null,
  };

  private listeners: Set<() => void> = new Set();

  private loadUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }

  getState(): Readonly<AppState> {
    return Object.freeze({ ...this.state });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  setAuthLoading(isLoading: boolean): void {
    this.state.auth.isLoading = isLoading;
    this.notify();
  }

  setAuthError(error: string | null): void {
    this.state.auth.error = error;
    this.notify();
  }

  setAuthResponse(response: AuthResponse): void {
    this.state.auth.token = response.token;
    this.state.auth.user = response.user;
    this.state.auth.error = null;
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.notify();
  }

  clearAuth(): void {
    this.state.auth.token = null;
    this.state.auth.user = null;
    this.state.auth.error = null;
    this.state.transactions = [];
    this.state.summary = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.notify();
  }

  setTransactions(transactions: Transaction[]): void {
    this.state.transactions = transactions;
    this.notify();
  }

  addTransaction(transaction: Transaction): void {
    this.state.transactions.unshift(transaction);
    this.notify();
  }

  removeTransaction(id: string): void {
    this.state.transactions = this.state.transactions.filter((t) => t.id !== id);
    this.notify();
  }

  setSummary(summary: FinancialSummary): void {
    this.state.summary = summary;
    this.notify();
  }

  setLoading(isLoading: boolean): void {
    this.state.isLoading = isLoading;
    this.notify();
  }

  setError(error: string | null): void {
    this.state.error = error;
    this.notify();
  }

  isAuthenticated(): boolean {
    return this.state.auth.token !== null && this.state.auth.user !== null;
  }
}

// Export singleton store
export const store = new Store();

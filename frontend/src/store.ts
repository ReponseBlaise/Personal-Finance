import { AppState, AuthResponse, Transaction, FinancialSummary, User, Pot, Budget } from './types';

export class Store {
  private state: AppState = {
    auth: {
      token: null, // Always start fresh (development)
      user: null,  // Always start fresh (development)
      isLoading: false,
      error: null,
    },
    transactions: [],
    pots: [],
    budgets: [],
    summary: null,
    isLoading: false,
    error: null,
    currentPage: 'overview',
  };

  private listeners: Set<() => void> = new Set();

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

  setPots(pots: Pot[]): void {
    this.state.pots = pots;
    this.notify();
  }

  addPot(pot: Pot): void {
    this.state.pots.push(pot);
    this.notify();
  }

  removePot(potId: string): void {
    this.state.pots = this.state.pots.filter(p => p.id !== potId);
    this.notify();
  }

  setBudgets(budgets: Budget[]): void {
    this.state.budgets = budgets;
    this.notify();
  }

  addBudget(budget: Budget): void {
    this.state.budgets.push(budget);
    this.notify();
  }

  removeBudget(budgetId: string): void {
    this.state.budgets = this.state.budgets.filter(b => b.id !== budgetId);
    this.notify();
  }

  setCurrentPage(page: 'overview' | 'transactions' | 'budgets' | 'pots' | 'recurring-bills'): void {
    this.state.currentPage = page;
    this.notify();
  }

  isAuthenticated(): boolean {
    return this.state.auth.token !== null && this.state.auth.user !== null;
  }
}

// Export singleton store
export const store = new Store();

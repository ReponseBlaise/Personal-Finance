// User-related types
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  createdAt: string;
}

// Pot types
export interface Pot {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  color: string;
  createdAt: string;
}

// Budget types
export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  createdAt: string;
}

// Request types
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TransactionRequest {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface PotRequest {
  name: string;
  target: number;
  color: string;
}

export interface BudgetRequest {
  category: string;
  limit: number;
}

// Response types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

// API Response type using discriminated union
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// App state types
export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  transactions: Transaction[];
  pots: Pot[];
  budgets: Budget[];
  summary: FinancialSummary | null;
  isLoading: boolean;
  error: string | null;
  currentPage: 'overview' | 'transactions' | 'budgets' | 'pots' | 'recurring-bills';
}

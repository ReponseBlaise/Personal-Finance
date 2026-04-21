// User-related types
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  createdAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  createdAt: Date;
}

// Pot types (savings pots)
export interface Pot {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  color: string;
  createdAt: Date;
}

// Budget types
export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  createdAt: Date;
}

// Request/Response types
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserWithoutPassword;
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

// API Response types using discriminated union
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

// JWT Payload type
export interface JWTPayload {
  userId: string;
  email: string;
}

import { User, Transaction, Pot, Budget } from './types';

class Database {
  private users: Map<string, User> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private pots: Map<string, Pot> = new Map();
  private budgets: Map<string, Budget> = new Map();
  private userCounter: number = 0;
  private transactionCounter: number = 0;
  private potCounter: number = 0;
  private budgetCounter: number = 0;

  // User operations
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  createUser(email: string, passwordHash: string): User {
    const id = `user_${++this.userCounter}`;
    const user: User = {
      id,
      email,
      passwordHash,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Transaction operations
  getTransactionsByUserId(userId: string): Transaction[] {
    const userTransactions: Transaction[] = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.userId === userId) {
        userTransactions.push(transaction);
      }
    }
    // Sort by date descending (newest first)
    return userTransactions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  createTransaction(
    userId: string,
    description: string,
    amount: number,
    type: 'income' | 'expense',
    category: string,
    date: Date
  ): Transaction {
    const id = `trans_${++this.transactionCounter}`;
    const transaction: Transaction = {
      id,
      userId,
      description,
      amount,
      type,
      category,
      date,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  deleteTransaction(id: string): boolean {
    return this.transactions.delete(id);
  }

  // Pot operations
  getPotsByUserId(userId: string): Pot[] {
    const userPots: Pot[] = [];
    for (const pot of this.pots.values()) {
      if (pot.userId === userId) {
        userPots.push(pot);
      }
    }
    return userPots;
  }

  createPot(userId: string, name: string, target: number, color: string): Pot {
    const id = `pot_${++this.potCounter}`;
    const pot: Pot = {
      id,
      userId,
      name,
      target,
      current: 0,
      color,
      createdAt: new Date(),
    };
    this.pots.set(id, pot);
    return pot;
  }

  getPotById(id: string): Pot | undefined {
    return this.pots.get(id);
  }

  updatePot(id: string, updates: Partial<Pot>): Pot | undefined {
    const pot = this.pots.get(id);
    if (!pot) return undefined;
    const updated = { ...pot, ...updates };
    this.pots.set(id, updated);
    return updated;
  }

  deletePot(id: string): boolean {
    return this.pots.delete(id);
  }

  // Budget operations
  getBudgetsByUserId(userId: string): Budget[] {
    const userBudgets: Budget[] = [];
    for (const budget of this.budgets.values()) {
      if (budget.userId === userId) {
        userBudgets.push(budget);
      }
    }
    return userBudgets;
  }

  createBudget(userId: string, category: string, limit: number): Budget {
    const id = `budget_${++this.budgetCounter}`;
    const budget: Budget = {
      id,
      userId,
      category,
      limit,
      spent: 0,
      createdAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  getBudgetById(id: string): Budget | undefined {
    return this.budgets.get(id);
  }

  updateBudget(id: string, updates: Partial<Budget>): Budget | undefined {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    const updated = { ...budget, ...updates };
    this.budgets.set(id, updated);
    return updated;
  }

  deleteBudget(id: string): boolean {
    return this.budgets.delete(id);
  }

  // Utility methods
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }
}

// Export singleton instance
export const db = new Database();

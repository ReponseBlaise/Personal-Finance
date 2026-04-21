import { User, Transaction } from './types';

class Database {
  private users: Map<string, User> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private userCounter: number = 0;
  private transactionCounter: number = 0;

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

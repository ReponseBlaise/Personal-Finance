import { db } from './database';
import { Transaction, FinancialSummary } from './types';

export class TransactionService {
  static createTransaction(
    userId: string,
    description: string,
    amount: number,
    type: 'income' | 'expense',
    category: string,
    date: string
  ): Transaction {
    const transactionDate = new Date(date);
    
    // Validate amount is positive
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Validate date is not in the future
    if (transactionDate > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }

    return db.createTransaction(
      userId,
      description,
      amount,
      type,
      category,
      transactionDate
    );
  }

  static getTransactions(userId: string): Transaction[] {
    return db.getTransactionsByUserId(userId);
  }

  static getFinancialSummary(userId: string): FinancialSummary {
    const transactions = db.getTransactionsByUserId(userId);
    
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
    };
  }

  static deleteTransaction(transactionId: string, userId: string): boolean {
    const transaction = db.getTransactionById(transactionId);
    
    // Ensure transaction belongs to the user
    if (!transaction || transaction.userId !== userId) {
      throw new Error('Transaction not found or does not belong to user');
    }

    return db.deleteTransaction(transactionId);
  }
}

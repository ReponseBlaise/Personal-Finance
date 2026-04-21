import { db } from './database';
import { Budget } from './types';

export class BudgetService {
  static createBudget(userId: string, category: string, limit: number): Budget {
    if (limit <= 0) {
      throw new Error('Budget limit must be greater than 0');
    }

    if (!category || category.trim().length === 0) {
      throw new Error('Category is required');
    }

    return db.createBudget(userId, category, limit);
  }

  static getBudgets(userId: string): Budget[] {
    const budgets = db.getBudgetsByUserId(userId);
    
    // Calculate spent amount for each budget
    const transactions = db.getAllTransactions()
      .filter(t => t.userId === userId && t.type === 'expense');

    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.category.toLowerCase() === budget.category.toLowerCase())
        .reduce((sum, t) => sum + t.amount, 0);

      return { ...budget, spent };
    });
  }

  static getBudgetProgress(userId: string, category: string): { spent: number; limit: number; percentage: number } {
    const budget = db.getBudgetsByUserId(userId).find(
      b => b.category.toLowerCase() === category.toLowerCase()
    );

    if (!budget) {
      throw new Error('Budget not found');
    }

    const transactions = db.getAllTransactions()
      .filter(t => t.userId === userId && t.type === 'expense' && t.category.toLowerCase() === category.toLowerCase());

    const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = (spent / budget.limit) * 100;

    return { spent, limit: budget.limit, percentage };
  }

  static deleteBudget(budgetId: string, userId: string): boolean {
    const budget = db.getBudgetById(budgetId);

    if (!budget || budget.userId !== userId) {
      throw new Error('Budget not found or does not belong to user');
    }

    return db.deleteBudget(budgetId);
  }
}

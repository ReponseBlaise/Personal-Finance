import { Router, Request, Response } from 'express';
import { AuthService } from './authService';
import { TransactionService } from './transactionService';
import { PotService } from './potService';
import { BudgetService } from './budgetService';
import { authMiddleware } from './middleware';
import { RegisterRequest, LoginRequest, TransactionRequest, PotRequest, BudgetRequest, ApiResponse } from './types';

const router = Router();

// Type guard for RegisterRequest
function isValidRegisterRequest(data: unknown): data is RegisterRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'email' in data &&
    'password' in data &&
    typeof (data as Record<string, unknown>).email === 'string' &&
    typeof (data as Record<string, unknown>).password === 'string'
  );
}

// Type guard for LoginRequest
function isValidLoginRequest(data: unknown): data is LoginRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'email' in data &&
    'password' in data &&
    typeof (data as Record<string, unknown>).email === 'string' &&
    typeof (data as Record<string, unknown>).password === 'string'
  );
}

// Type guard for TransactionRequest
function isValidTransactionRequest(data: unknown): data is TransactionRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'description' in data &&
    'amount' in data &&
    'type' in data &&
    'category' in data &&
    'date' in data &&
    typeof (data as Record<string, unknown>).description === 'string' &&
    typeof (data as Record<string, unknown>).amount === 'number' &&
    ((data as Record<string, unknown>).type === 'income' ||
      (data as Record<string, unknown>).type === 'expense') &&
    typeof (data as Record<string, unknown>).category === 'string' &&
    typeof (data as Record<string, unknown>).date === 'string'
  );
}

// Type guard for PotRequest
function isValidPotRequest(data: unknown): data is PotRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'target' in data &&
    'color' in data &&
    typeof (data as Record<string, unknown>).name === 'string' &&
    typeof (data as Record<string, unknown>).target === 'number' &&
    typeof (data as Record<string, unknown>).color === 'string'
  );
}

// Type guard for BudgetRequest
function isValidBudgetRequest(data: unknown): data is BudgetRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'category' in data &&
    'limit' in data &&
    typeof (data as Record<string, unknown>).category === 'string' &&
    typeof (data as Record<string, unknown>).limit === 'number'
  );
}

// Authentication Routes
router.post('/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isValidRegisterRequest(req.body)) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body. Email and password are required.',
      } as ApiResponse<never>);
      return;
    }

    const { email, password } = req.body;

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      } as ApiResponse<never>);
      return;
    }

    const result = await AuthService.register(email, password);
    res.status(201).json({ success: true, data: result } as ApiResponse<typeof result>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isValidLoginRequest(req.body)) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body. Email and password are required.',
      } as ApiResponse<never>);
      return;
    }

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(200).json({ success: true, data: result } as ApiResponse<typeof result>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

// Transaction Routes (Protected)
router.post('/transactions', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    if (!isValidTransactionRequest(req.body)) {
      res.status(400).json({
        success: false,
        error:
          'Invalid request body. Description, amount, type, category, and date are required.',
      } as ApiResponse<never>);
      return;
    }

    const { description, amount, type, category, date } = req.body;
    const transaction = TransactionService.createTransaction(
      userId,
      description,
      amount,
      type,
      category,
      date
    );

    res.status(201).json({ success: true, data: transaction } as ApiResponse<typeof transaction>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create transaction';
    res.status(400).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.get('/transactions', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const transactions = TransactionService.getTransactions(userId);
    res.status(200).json({ success: true, data: transactions } as ApiResponse<typeof transactions>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
    res.status(500).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.get('/summary', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const summary = TransactionService.getFinancialSummary(userId);
    res.status(200).json({ success: true, data: summary } as ApiResponse<typeof summary>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch summary';
    res.status(500).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.delete('/transactions/:id', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const { id } = req.params;
    TransactionService.deleteTransaction(id, userId);
    res.status(200).json({ success: true, data: { message: 'Transaction deleted successfully' } } as ApiResponse<{ message: string }>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete transaction';
    res.status(404).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

// Pot Routes (Protected)
router.post('/pots', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    if (!isValidPotRequest(req.body)) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body. Name, target, and color are required.',
      } as ApiResponse<never>);
      return;
    }

    const { name, target, color } = req.body;
    const pot = PotService.createPot(userId, name, target, color);
    res.status(201).json({ success: true, data: pot } as ApiResponse<typeof pot>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create pot';
    res.status(400).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.get('/pots', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const pots = PotService.getPots(userId);
    res.status(200).json({ success: true, data: pots } as ApiResponse<typeof pots>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pots';
    res.status(500).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.post('/pots/:id/add', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const { id } = req.params;
    const { amount } = req.body as { amount: number };

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid amount',
      } as ApiResponse<never>);
      return;
    }

    const pot = PotService.addToPot(id, userId, amount);
    res.status(200).json({ success: true, data: pot } as ApiResponse<typeof pot>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add to pot';
    res.status(400).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.delete('/pots/:id', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const { id } = req.params;
    PotService.deletePot(id, userId);
    res.status(200).json({ success: true, data: { message: 'Pot deleted successfully' } } as ApiResponse<{ message: string }>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete pot';
    res.status(404).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

// Budget Routes (Protected)
router.post('/budgets', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    if (!isValidBudgetRequest(req.body)) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body. Category and limit are required.',
      } as ApiResponse<never>);
      return;
    }

    const { category, limit } = req.body;
    const budget = BudgetService.createBudget(userId, category, limit);
    res.status(201).json({ success: true, data: budget } as ApiResponse<typeof budget>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create budget';
    res.status(400).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.get('/budgets', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const budgets = BudgetService.getBudgets(userId);
    res.status(200).json({ success: true, data: budgets } as ApiResponse<typeof budgets>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch budgets';
    res.status(500).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

router.delete('/budgets/:id', authMiddleware, (req: Request, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User ID not found in token' } as ApiResponse<never>);
      return;
    }

    const { id } = req.params;
    BudgetService.deleteBudget(id, userId);
    res.status(200).json({ success: true, data: { message: 'Budget deleted successfully' } } as ApiResponse<{ message: string }>);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete budget';
    res.status(404).json({
      success: false,
      error: message,
    } as ApiResponse<never>);
  }
});

export default router;

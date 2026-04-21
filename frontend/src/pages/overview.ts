import { ApiClient } from '../api';
import { store } from '../store';
import { formatCurrency, formatDate } from '../dom';
import { Transaction, Pot, Budget } from '../types';

export async function setupOverviewPage(): Promise<void> {
  try {
    // Load data
    await loadSummary();
    await loadPots();
    await loadBudgets();
    await loadRecentTransactions();

    // Setup event listeners
    const addPotBtn = document.getElementById('addPotBtn');
    const addBudgetBtn = document.getElementById('addBudgetBtn');

    addPotBtn?.addEventListener('click', () => {
      document.querySelector<HTMLElement>('[data-page="pots"]')?.click();
    });

    addBudgetBtn?.addEventListener('click', () => {
      document.querySelector<HTMLElement>('[data-page="budgets"]')?.click();
    });
  } catch (error) {
    console.error('Failed to setup overview page:', error);
  }
}

async function loadSummary(): Promise<void> {
  try {
    const response = await ApiClient.getFinancialSummary();
    if (response.success) {
      store.setSummary(response.data);
      renderSummaryCards(response.data);
    }
  } catch (error) {
    console.error('Failed to load summary:', error);
  }
}

async function loadPots(): Promise<void> {
  try {
    const response = await ApiClient.getPots();
    if (response.success) {
      store.setPots(response.data);
      renderPotsPreview(response.data);
    }
  } catch (error) {
    console.error('Failed to load pots:', error);
  }
}

async function loadBudgets(): Promise<void> {
  try {
    const response = await ApiClient.getBudgets();
    if (response.success) {
      store.setBudgets(response.data);
      renderBudgetsPreview(response.data);
    }
  } catch (error) {
    console.error('Failed to load budgets:', error);
  }
}

async function loadRecentTransactions(): Promise<void> {
  try {
    const response = await ApiClient.getTransactions();
    if (response.success) {
      store.setTransactions(response.data);
      renderRecentTransactions(response.data.slice(0, 5));
    }
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
}

function renderSummaryCards(summary: { totalIncome: number; totalExpenses: number; netBalance: number }): void {
  const currentBalance = document.getElementById('currentBalance');
  const totalIncome = document.getElementById('totalIncome');
  const totalExpenses = document.getElementById('totalExpenses');

  if (currentBalance) {
    currentBalance.textContent = formatCurrency(summary.netBalance);
  }
  if (totalIncome) {
    totalIncome.textContent = formatCurrency(summary.totalIncome);
  }
  if (totalExpenses) {
    totalExpenses.textContent = formatCurrency(summary.totalExpenses);
  }
}

function renderPotsPreview(pots: Pot[]): void {
  const container = document.getElementById('potsContainer');
  if (!container) return;

  if (pots.length === 0) {
    container.innerHTML = '<p class="empty-state">No pots yet. Create one to start saving!</p>';
    return;
  }

  container.innerHTML = pots.slice(0, 2).map(pot => {
    const percentage = (pot.current / pot.target) * 100;
    return `
      <div class="pot-item">
        <div class="pot-header">
          <div class="pot-color-indicator" style="background-color: ${pot.color};"></div>
          <div class="pot-info">
            <h4>${pot.name}</h4>
            <div class="pot-progress">${formatCurrency(pot.current)} of ${formatCurrency(pot.target)}</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentage}%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderBudgetsPreview(budgets: Budget[]): void {
  const container = document.getElementById('budgetsContainer');
  if (!container) return;

  if (budgets.length === 0) {
    container.innerHTML = '<p class="empty-state">No budgets yet. Create one to track spending!</p>';
    return;
  }

  container.innerHTML = budgets.slice(0, 2).map(budget => {
    const percentage = (budget.spent / budget.limit) * 100;
    return `
      <div class="budget-item">
        <div class="budget-info">
          <h4>${budget.category}</h4>
          <div class="budget-status">${formatCurrency(budget.spent)} of ${formatCurrency(budget.limit)}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecentTransactions(transactions: Transaction[]): void {
  const container = document.getElementById('recentTransactionsContainer');
  if (!container) return;

  if (transactions.length === 0) {
    container.innerHTML = '<p class="empty-state">No transactions yet</p>';
    return;
  }

  container.innerHTML = transactions.map(trans => `
    <div class="transaction-item">
      <div class="transaction-details">
        <div class="transaction-desc">${trans.description}</div>
        <div class="transaction-meta">${formatDate(trans.date)} • ${trans.category}</div>
      </div>
      <div class="transaction-amount" style="color: ${trans.type === 'income' ? '#22c55e' : '#ef4444'};">
        ${trans.type === 'income' ? '+' : '-'}${formatCurrency(trans.amount)}
      </div>
    </div>
  `).join('');
}


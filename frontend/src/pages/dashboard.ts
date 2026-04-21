import { ApiClient } from './api';
import { store } from './store';
import {
  getInputValue,
  getSelectValue,
  clearInput,
  formatCurrency,
  formatDate,
  setText,
  setHTML,
} from './dom';
import { Transaction, TransactionRequest } from './types';

export async function setupDashboard(): Promise<void> {
  await loadTransactions();
  await loadSummary();
  setupTransactionForm();
  setupLogout();
}

async function loadTransactions(): Promise<void> {
  store.setLoading(true);
  const response = await ApiClient.getTransactions();

  if (response.success) {
    store.setTransactions(response.data);
    renderTransactionList(response.data);
  } else {
    store.setError(response.error);
  }

  store.setLoading(false);
}

async function loadSummary(): Promise<void> {
  const response = await ApiClient.getFinancialSummary();

  if (response.success) {
    store.setSummary(response.data);
    renderSummary(response.data);
  }
}

function renderSummary(summary: typeof store.getState().summary): void {
  if (!summary) return;

  const incomeElement = document.getElementById('totalIncome');
  const expensesElement = document.getElementById('totalExpenses');
  const balanceElement = document.getElementById('netBalance');

  if (incomeElement) setText(incomeElement, formatCurrency(summary.totalIncome));
  if (expensesElement) setText(expensesElement, formatCurrency(summary.totalExpenses));
  if (balanceElement) {
    setText(balanceElement, formatCurrency(summary.netBalance));
    // Color code the balance
    const balanceCard = balanceElement.closest('.balance-card');
    if (balanceCard) {
      if (summary.netBalance >= 0) {
        balanceCard.classList.remove('negative');
        balanceCard.classList.add('positive');
      } else {
        balanceCard.classList.remove('positive');
        balanceCard.classList.add('negative');
      }
    }
  }
}

function renderTransactionList(transactions: Transaction[]): void {
  const listContainer = document.getElementById('transactionList');

  if (!listContainer) {
    console.error('Transaction list container not found');
    return;
  }

  if (transactions.length === 0) {
    setHTML(listContainer, '<p class="empty-message">No transactions yet. Add one to get started!</p>');
    return;
  }

  let html = '';

  for (const transaction of transactions) {
    const isIncome = transaction.type === 'income';
    const amountClass = isIncome ? 'amount-income' : 'amount-expense';
    const amountSign = isIncome ? '+' : '-';

    html += `
      <div class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-header">
            <h3 class="transaction-description">${escapeHtml(transaction.description)}</h3>
            <span class="transaction-category">${escapeHtml(transaction.category)}</span>
          </div>
          <p class="transaction-date">${formatDate(transaction.date)}</p>
        </div>
        <div class="transaction-right">
          <span class="transaction-amount ${amountClass}">
            ${amountSign}${formatCurrency(transaction.amount)}
          </span>
          <button class="btn-delete" data-transaction-id="${transaction.id}" title="Delete transaction">
            ✕
          </button>
        </div>
      </div>
    `;
  }

  setHTML(listContainer, html);

  // Attach delete handlers
  const deleteButtons = document.querySelectorAll('.btn-delete');
  for (const button of deleteButtons) {
    button.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement;
      const transactionId = target.getAttribute('data-transaction-id');
      if (transactionId) {
        await deleteTransaction(transactionId);
      }
    });
  }
}

async function deleteTransaction(id: string): Promise<void> {
  const response = await ApiClient.deleteTransaction(id);

  if (response.success) {
    store.removeTransaction(id);
    // Reload summary after deletion
    await loadSummary();
    // Re-render with new data
    const state = store.getState();
    renderTransactionList(state.transactions);
  } else {
    store.setError(response.error);
  }
}

function setupTransactionForm(): void {
  const form = document.getElementById('transactionForm') as HTMLFormElement | null;

  if (!form) {
    console.error('Transaction form not found');
    return;
  }

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const description = getInputValue('#description');
    const amount = parseFloat(getInputValue('#amount'));
    const type = getSelectValue('#type') as 'income' | 'expense';
    const category = getInputValue('#category');
    const date = getInputValue('#date');

    // Validation
    if (!description) {
      store.setError('Description is required');
      return;
    }

    if (!amount || amount <= 0) {
      store.setError('Amount must be greater than 0');
      return;
    }

    if (!category) {
      store.setError('Category is required');
      return;
    }

    if (!date) {
      store.setError('Date is required');
      return;
    }

    store.setLoading(true);

    const request: TransactionRequest = {
      description,
      amount,
      type,
      category,
      date: new Date(date).toISOString(),
    };

    const response = await ApiClient.createTransaction(request);

    if (response.success) {
      store.addTransaction(response.data);
      await loadSummary();
      renderTransactionList(store.getState().transactions);
      clearInput('#description');
      clearInput('#amount');
      clearInput('#category');
      clearInput('#date');
      store.setError(null);
    } else {
      store.setError(response.error);
    }

    store.setLoading(false);
  });
}

function setupLogout(): void {
  const logoutButton = document.getElementById('logoutBtn');

  if (logoutButton) {
    logoutButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      ApiClient.clearToken();
      store.clearAuth();
    });
  }
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char: string) => map[char]);
}

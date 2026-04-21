import { ApiClient } from '../api';
import { store } from '../store';
import { formatCurrency, formatDate } from '../dom';

export async function setupTransactionsPage(): Promise<void> {
  try {
    await loadAllTransactions();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to setup transactions page:', error);
  }
}

async function loadAllTransactions(): Promise<void> {
  try {
    const response = await ApiClient.getTransactions();
    if (response.success) {
      store.setTransactions(response.data);
      renderTransactions(response.data);
    }
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
}

function renderTransactions(transactions: any[]): void {
  const container = document.getElementById('transactionsListContainer');
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
      <button class="delete-btn" data-id="${trans.id}">Delete</button>
    </div>
  `).join('');

  // Add delete listeners
  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = (e.target as HTMLElement).getAttribute('data-id');
      if (id) {
        await deleteTransaction(id);
      }
    });
  });
}

async function deleteTransaction(id: string): Promise<void> {
  try {
    const response = await ApiClient.deleteTransaction(id);
    if (response.success) {
      store.removeTransaction(id);
      await loadAllTransactions();
    }
  } catch (error) {
    console.error('Failed to delete transaction:', error);
  }
}

function setupEventListeners(): void {
  const addBtn = document.getElementById('addTransactionBtn');
  const formContainer = document.getElementById('transactionFormContainer');
  const form = document.getElementById('transactionForm');
  const cancelBtn = document.getElementById('cancelTransBtn');

  addBtn?.addEventListener('click', () => {
    formContainer?.style.setProperty('display', 'block');
  });

  cancelBtn?.addEventListener('click', () => {
    formContainer?.style.setProperty('display', 'none');
    (form as HTMLFormElement)?.reset();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleAddTransaction();
  });
}

async function handleAddTransaction(): Promise<void> {
  try {
    const description = (document.getElementById('transDescription') as HTMLInputElement)?.value;
    const amount = parseFloat((document.getElementById('transAmount') as HTMLInputElement)?.value);
    const type = (document.getElementById('transType') as HTMLSelectElement)?.value as 'income' | 'expense';
    const category = (document.getElementById('transCategory') as HTMLInputElement)?.value;
    const date = (document.getElementById('transDate') as HTMLInputElement)?.value;

    if (!description || !amount || !type || !category || !date) {
      alert('Please fill all fields');
      return;
    }

    const response = await ApiClient.createTransaction({
      description,
      amount,
      type,
      category,
      date,
    });

    if (response.success) {
      store.addTransaction(response.data);
      (document.getElementById('transactionForm') as HTMLFormElement)?.reset();
      document.getElementById('transactionFormContainer')?.style.setProperty('display', 'none');
      await loadAllTransactions();
    }
  } catch (error) {
    console.error('Failed to add transaction:', error);
    alert('Failed to add transaction');
  }
}
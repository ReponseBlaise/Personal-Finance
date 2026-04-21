import { ApiClient } from '../api';
import { store } from '../store';
import { formatCurrency } from '../dom';
import { Budget } from '../types';

export async function setupBudgetsPage(): Promise<void> {
  try {
    await loadBudgets();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to setup budgets page:', error);
  }
}

async function loadBudgets(): Promise<void> {
  try {
    const response = await ApiClient.getBudgets();
    if (response.success) {
      store.setBudgets(response.data);
      renderBudgets(response.data);
    }
  } catch (error) {
    console.error('Failed to load budgets:', error);
  }
}

function renderBudgets(budgets: Budget[]): void {
  const container = document.getElementById('budgetsPageContainer');
  if (!container) return;

  if (budgets.length === 0) {
    container.innerHTML = '<p class="empty-state">No budgets yet. Create one to track spending!</p>';
    return;
  }

  container.innerHTML = budgets.map(budget => {
    const percentage = (budget.spent / budget.limit) * 100;
    const remaining = budget.limit - budget.spent;
    const isOverBudget = budget.spent > budget.limit;

    return `
      <div class="budget-item">
        <div class="budget-info">
          <h4>${budget.category}</h4>
          <div class="budget-status">
            ${formatCurrency(budget.spent)} of ${formatCurrency(budget.limit)}
            ${isOverBudget ? `<span style="color:#000;font-weight:600;"> (Over by ${formatCurrency(budget.spent - budget.limit)})</span>` : `<span style="color:#555;"> (${formatCurrency(remaining)} remaining)</span>`}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;"></div>
          </div>
        </div>
        <button class="delete-btn" data-id="${budget.id}">Delete</button>
      </div>
    `;
  }).join('');

  // Add delete listeners
  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = (e.target as HTMLElement).getAttribute('data-id');
      if (id && confirm('Are you sure you want to delete this budget?')) {
        await deleteBudget(id);
      }
    });
  });
}

async function deleteBudget(id: string): Promise<void> {
  try {
    const response = await ApiClient.deleteBudget(id);
    if (response.success) {
      store.removeBudget(id);
      await loadBudgets();
    }
  } catch (error) {
    console.error('Failed to delete budget:', error);
    alert('Failed to delete budget');
  }
}

function openModal(formId: string): void {
  const overlay = document.getElementById('modalOverlay');
  const form = document.getElementById(formId);
  if (overlay && form) {
    overlay.style.display = 'flex';
    form.style.display = 'block';
  }
}

function closeModal(formId: string): void {
  const overlay = document.getElementById('modalOverlay');
  const form = document.getElementById(formId);
  if (overlay && form) {
    form.style.display = 'none';
    overlay.style.display = 'none';
  }
}

function setupEventListeners(): void {
  const addBtn = document.getElementById('addBudgetPageBtn');
  const cancelBtn = document.getElementById('cancelBudgetBtn');
  const form = document.getElementById('budgetForm');

  addBtn?.addEventListener('click', () => openModal('budgetFormContainer'));
  cancelBtn?.addEventListener('click', () => {
    closeModal('budgetFormContainer');
    (form as HTMLFormElement)?.reset();
  });
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'modalOverlay') {
      closeModal('budgetFormContainer');
      (form as HTMLFormElement)?.reset();
    }
  });
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleAddBudget();
  });
}

async function handleAddBudget(): Promise<void> {
  try {
    const category = (document.getElementById('budgetCategory') as HTMLInputElement)?.value;
    const limit = parseFloat((document.getElementById('budgetLimit') as HTMLInputElement)?.value);

    if (!category || !limit) {
      alert('Please fill all fields');
      return;
    }

    const response = await ApiClient.createBudget({
      category,
      limit,
    });

    if (response.success) {
      store.addBudget(response.data);
      (document.getElementById('budgetForm') as HTMLFormElement)?.reset();
      closeModal('budgetFormContainer');
      await loadBudgets();
    }
  } catch (error) {
    console.error('Failed to add budget:', error);
    alert('Failed to add budget');
  }
}
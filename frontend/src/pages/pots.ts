import { ApiClient } from '../api';
import { store } from '../store';
import { formatCurrency } from '../dom';
import { Pot } from '../types';

export async function setupPotsPage(): Promise<void> {
  try {
    await loadPots();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to setup pots page:', error);
  }
}

async function loadPots(): Promise<void> {
  try {
    const response = await ApiClient.getPots();
    if (response.success) {
      store.setPots(response.data);
      renderPots(response.data);
    }
  } catch (error) {
    console.error('Failed to load pots:', error);
  }
}

function renderPots(pots: Pot[]): void {
  const container = document.getElementById('potsPageContainer');
  if (!container) return;

  if (pots.length === 0) {
    container.innerHTML = '<p class="empty-state">No pots yet. Create one to start saving!</p>';
    return;
  }

  container.innerHTML = pots.map(pot => {
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
        <button class="delete-btn" data-id="${pot.id}">Delete</button>
      </div>
    `;
  }).join('');

  // Add delete listeners
  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = (e.target as HTMLElement).getAttribute('data-id');
      if (id && confirm('Are you sure you want to delete this pot?')) {
        await deletePot(id);
      }
    });
  });
}

async function deletePot(id: string): Promise<void> {
  try {
    const response = await ApiClient.deletePot(id);
    if (response.success) {
      store.removePot(id);
      await loadPots();
    }
  } catch (error) {
    console.error('Failed to delete pot:', error);
    alert('Failed to delete pot');
  }
}

function setupEventListeners(): void {
  const addBtn = document.getElementById('addPotPageBtn');
  const formContainer = document.getElementById('potFormContainer');
  const form = document.getElementById('potForm');
  const cancelBtn = document.getElementById('cancelPotBtn');

  addBtn?.addEventListener('click', () => {
    formContainer?.style.setProperty('display', 'block');
  });

  cancelBtn?.addEventListener('click', () => {
    formContainer?.style.setProperty('display', 'none');
    (form as HTMLFormElement)?.reset();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleAddPot();
  });
}

async function handleAddPot(): Promise<void> {
  try {
    const name = (document.getElementById('potName') as HTMLInputElement)?.value;
    const target = parseFloat((document.getElementById('potTarget') as HTMLInputElement)?.value);
    const color = (document.getElementById('potColor') as HTMLSelectElement)?.value;

    if (!name || !target || !color) {
      alert('Please fill all fields');
      return;
    }

    const response = await ApiClient.createPot({
      name,
      target,
      color,
    });

    if (response.success) {
      store.addPot(response.data);
      (document.getElementById('potForm') as HTMLFormElement)?.reset();
      document.getElementById('potFormContainer')?.style.setProperty('display', 'none');
      await loadPots();
    }
  } catch (error) {
    console.error('Failed to add pot:', error);
    alert('Failed to add pot');
  }
}
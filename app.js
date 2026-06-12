/**
 * AuraSpend — Daily Expense Tracker Core Application Logic
 * Upgraded with Multi-segment SVG Donut Chart, CSV Export, Custom Confirm Overlays, and Query Highlighting.
 */

// Application State
let state = {
  transactions: [],
  theme: 'dark',
  activeChart: 'cashflow'
};

// Category Colors & SVG Icons Map
const categoryConfig = {
  Salary: { color: '#10b981', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>` },
  Investment: { color: '#06b6d4', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><line x1="12" x2="12" y1="20" y2="12"/><line x1="12" x2="12" y1="8" y2="4"/><path d="m8 16 4-4 4 4"/><path d="m8 10 4-4 4 4"/></svg>` },
  Food: { color: '#f59e0b', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><path d="M3 12h18"/></svg>` },
  Transport: { color: '#3b82f6', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>` },
  Utilities: { color: '#f97316', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
  Entertainment: { color: '#8b5cf6', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 16V8a2 2 0 0 0-1.55-1.95L9 3.14a2 2 0 0 0-2.45 1.96v11.75a2 2 0 0 0 1.55 1.95l10.45 2.91A2 2 0 0 0 21 16z"/><circle cx="9" cy="18" r="2"/><circle cx="18" cy="16" r="2"/></svg>` },
  Shopping: { color: '#ec4899', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="m6 2 12 0a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4h12M6 10h12M8 14h8"/></svg>` },
  Housing: { color: '#b45309', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
  Other: { color: '#6b7280', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>` }
};

// DOM Elements
const bodyEl = document.body;
const htmlEl = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const balanceAmountEl = document.getElementById('balanceAmount');
const statIncomeEl = document.getElementById('statIncome');
const statExpenseEl = document.getElementById('statExpense');
const transactionsListEl = document.getElementById('transactionsList');
const categoryProgressListEl = document.getElementById('categoryProgressList');

// Modal Elements
const txModal = document.getElementById('txModal');
const txForm = document.getElementById('txForm');
const modalTitle = document.getElementById('modalTitle');
const txIdInput = document.getElementById('txId');
const typeIncomeRadio = document.getElementById('typeIncome');
const typeExpenseRadio = document.getElementById('typeExpense');
const txAmountInput = document.getElementById('txAmount');
const txDateInput = document.getElementById('txDate');
const txCategorySelect = document.getElementById('txCategory');
const txNotesInput = document.getElementById('txNotes');
const btnSubmitTx = document.getElementById('btnSubmitTx');

// Quick Action Buttons
const btnQuickIncome = document.getElementById('btnQuickIncome');
const btnQuickExpense = document.getElementById('btnQuickExpense');
const btnModalClose = document.getElementById('btnModalClose');

// Filters & Export Dropdowns
const txSearchInput = document.getElementById('txSearch');
const txFilterTypeSelect = document.getElementById('txFilterType');
const txFilterDateSelect = document.getElementById('txFilterDate');
const exportDropdown = document.getElementById('exportDropdown');
const btnExport = document.getElementById('btnExport');
const btnExportJSON = document.getElementById('btnExportJSON');
const btnExportCSV = document.getElementById('btnExportCSV');
const importFileInput = document.getElementById('importFile');
const toastContainer = document.getElementById('toastContainer');

// Custom Confirm Overlay Elements
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const btnConfirmCancel = document.getElementById('btnConfirmCancel');
const btnConfirmProceed = document.getElementById('btnConfirmProceed');

// SVG Donut Chart Elements
const donutChartSVG = document.getElementById('donutChartSVG');
const donutPercent = document.getElementById('donutPercent');

// Constants
const LOCAL_STORAGE_KEY = 'auraspend_transactions';
const THEME_KEY = 'auraspend_theme';

// Active Confirm Callback Tracker
let confirmResolve = null;

/* ==========================================================================
   Initialization and Event Listeners
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  setupEventListeners();
  updateUI();
});

function setupEventListeners() {
  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Modal actions
  btnQuickIncome.addEventListener('click', () => openModal('income'));
  btnQuickExpense.addEventListener('click', () => openModal('expense'));
  btnModalClose.addEventListener('click', closeModal);
  txModal.addEventListener('click', (e) => {
    if (e.target === txModal) closeModal();
  });

  // Modal Form Submit
  txForm.addEventListener('submit', handleFormSubmit);

  // Filters & Search
  txSearchInput.addEventListener('input', updateUI);
  txFilterTypeSelect.addEventListener('change', updateUI);
  txFilterDateSelect.addEventListener('change', updateUI);

  // Export Dropdown toggling
  btnExport.addEventListener('click', (e) => {
    e.stopPropagation();
    exportDropdown.classList.toggle('active');
    btnExport.setAttribute('aria-expanded', exportDropdown.classList.contains('active'));
  });
  
  document.addEventListener('click', () => {
    exportDropdown.classList.remove('active');
    btnExport.setAttribute('aria-expanded', 'false');
  });

  btnExportJSON.addEventListener('click', exportDataJSON);
  btnExportCSV.addEventListener('click', exportDataCSV);
  
  // Import
  importFileInput.addEventListener('change', importData);

  // Chart Controls Tabs
  const chartTabs = document.querySelectorAll('.btn-chart-tab');
  chartTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chartTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeChart = tab.getAttribute('data-chart');
      renderPlotlyAnalytics();
    });
  });
}

/* ==========================================================================
   Theme Management
   ========================================================================== */

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    state.theme = savedTheme;
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = prefersDark ? 'dark' : 'light';
  }
  htmlEl.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', state.theme);
  localStorage.setItem(THEME_KEY, state.theme);
  showToast(`Switched to ${state.theme} theme`, 'info');
  renderPlotlyAnalytics();
}

/* ==========================================================================
   Data Management & LocalStorage
   ========================================================================== */

function loadData() {
  const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    state.transactions = rawData ? JSON.parse(rawData) : getMockTransactions();
  } catch (e) {
    console.error('Error parsing localStorage transactions, initializing empty list.', e);
    state.transactions = [];
  }
}

function saveData() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.transactions));
}

function getMockTransactions() {
  const today = new Date();
  const formatOffsetDate = (offsetDays) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'mock-1',
      type: 'income',
      amount: 5200.00,
      category: 'Salary',
      date: formatOffsetDate(5),
      notes: 'Monthly company salary payment'
    },
    {
      id: 'mock-2',
      type: 'expense',
      amount: 145.20,
      category: 'Utilities',
      date: formatOffsetDate(3),
      notes: 'Electricity bill payment'
    },
    {
      id: 'mock-3',
      type: 'expense',
      amount: 68.50,
      category: 'Food',
      date: formatOffsetDate(2),
      notes: 'Weekend dinner with groceries shopping'
    },
    {
      id: 'mock-4',
      type: 'expense',
      amount: 110.00,
      category: 'Shopping',
      date: formatOffsetDate(1),
      notes: 'Casual jacket shopping'
    },
    {
      id: 'mock-5',
      type: 'income',
      amount: 320.00,
      category: 'Investment',
      date: formatOffsetDate(0),
      notes: 'Stock dividend return payout'
    }
  ];
}

/* ==========================================================================
   UI Rendering and Calculations
   ========================================================================== */

function updateUI() {
  const totals = calculateTotals();
  renderBalances(totals);
  
  const filtered = getFilteredTransactions();
  renderTransactionsFeed(filtered);
  renderCategoryBreakdown();
  renderPlotlyAnalytics();
}

function calculateTotals() {
  let totalIncome = 0;
  let totalExpenses = 0;
  
  // Calculate totals based on ALL records currently in database (independent of feed filters)
  state.transactions.forEach(tx => {
    const amt = parseFloat(tx.amount);
    if (tx.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpenses += amt;
    }
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  };
}

function renderBalances({ totalIncome, totalExpenses, balance }) {
  const formatCurrency = (val) => {
    const absVal = Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return val < 0 ? `-Rs.${absVal}` : `Rs.${absVal}`;
  };

  balanceAmountEl.textContent = formatCurrency(balance);
  statIncomeEl.textContent = formatCurrency(totalIncome);
  statExpenseEl.textContent = formatCurrency(totalExpenses);

  if (balance < 0) {
    balanceAmountEl.style.color = 'var(--expense)';
  } else {
    balanceAmountEl.style.color = 'var(--text-primary)';
  }
}

function getFilteredTransactions() {
  const searchQuery = txSearchInput.value.toLowerCase().trim();
  const filterType = txFilterTypeSelect.value;
  const filterDate = txFilterDateSelect.value;

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Start of current week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  };
  const weekStart = getStartOfWeek();
  weekStart.setHours(0,0,0,0);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  return state.transactions.filter(tx => {
    // 1. Note / Category Query matching
    const matchesSearch = tx.notes.toLowerCase().includes(searchQuery) || 
                          tx.category.toLowerCase().includes(searchQuery);
    
    // 2. Type matching
    const matchesType = filterType === 'all' || tx.type === filterType;
    
    // 3. Date boundary checking
    let matchesDate = true;
    const txDate = new Date(tx.date + 'T00:00:00'); // Prevent UTC shift issues
    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();

    if (filterDate === 'today') {
      matchesDate = tx.date === todayStr;
    } else if (filterDate === 'week') {
      matchesDate = txDate >= weekStart;
    } else if (filterDate === 'month') {
      matchesDate = txYear === currentYear && txMonth === currentMonth;
    } else if (filterDate === 'year') {
      matchesDate = txYear === currentYear;
    }

    return matchesSearch && matchesType && matchesDate;
  });
}

function renderTransactionsFeed(transactions) {
  transactionsListEl.innerHTML = '';

  if (transactions.length === 0) {
    transactionsListEl.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" style="width:40px;height:40px;margin-bottom:0.5rem;"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
        <p>No matching transactions found.</p>
      </div>
    `;
    return;
  }

  // Sort: descending by date, then descending by ID
  const sorted = [...transactions].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return b.id.localeCompare(a.id);
  });

  // Display only the latest 10 transactions in feed
  const latestTen = sorted.slice(0, 10);
  const searchQuery = txSearchInput.value.toLowerCase().trim();

  latestTen.forEach(tx => {
    const txItem = document.createElement('div');
    txItem.className = 'tx-item';
    txItem.setAttribute('data-id', tx.id);

    const isIncome = tx.type === 'income';
    const amountClass = isIncome ? 'amount-income' : 'amount-expense';
    const amountPrefix = isIncome ? '+' : '-';
    
    const config = categoryConfig[tx.category] || categoryConfig['Other'];
    const badgeClass = isIncome ? 'badge-income' : 'badge-expense';

    // Highlight text search queries
    const noteText = tx.notes || tx.category;
    const highlightedNote = highlightSearch(noteText, searchQuery);

    txItem.innerHTML = `
      <div class="tx-main">
        <div class="tx-type-badge ${badgeClass}" style="color: ${config.color}; background-color: ${config.color}20;">
          ${config.icon}
        </div>
        <div class="tx-details">
          <div class="tx-top-line">
            <span class="tx-category-tag" style="border-left: 2px solid ${config.color};">${tx.category}</span>
            <span class="tx-date">${formatFriendlyDate(tx.date)}</span>
          </div>
          <p class="tx-note" title="${escapeHtml(noteText)}">
            ${highlightedNote}
          </p>
        </div>
      </div>
      <div class="tx-right">
        <span class="tx-amount ${amountClass}">${amountPrefix}Rs.${parseFloat(tx.amount).toFixed(2)}</span>
        <div class="tx-actions">
          <button class="btn-action btn-edit" title="Edit entry" onclick="editTransaction('${tx.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" style="width:14px;height:14px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-action btn-delete" title="Delete entry" onclick="deleteTransaction('${tx.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" style="width:14px;height:14px;"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;

    transactionsListEl.appendChild(txItem);
  });
}

function renderCategoryBreakdown() {
  categoryProgressListEl.innerHTML = '';
  
  // Calculate expenses sums per category
  const categorySums = {};
  let totalExpenseAmt = 0;
  
  state.transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const amt = parseFloat(tx.amount);
      categorySums[tx.category] = (categorySums[tx.category] || 0) + amt;
      totalExpenseAmt += amt;
    }
  });

  // Clean dynamic segments from SVG donut chart (keep background circle)
  const existingDynamicCircles = donutChartSVG.querySelectorAll('.donut-segment-dynamic');
  existingDynamicCircles.forEach(circle => circle.remove());

  if (totalExpenseAmt === 0) {
    categoryProgressListEl.innerHTML = `<p class="empty-state-text">No expense records found yet.</p>`;
    donutPercent.textContent = '0%';
    return;
  }

  // Sort categories by expenditure size
  const sortedCategories = Object.entries(categorySums).sort((a, b) => b[1] - a[1]);

  let runningOffset = 0; // Cumulative offset for SVG segment positioning

  sortedCategories.forEach(([category, sum]) => {
    const percentage = (sum / totalExpenseAmt) * 100;
    const config = categoryConfig[category] || categoryConfig['Other'];
    
    // 1. Draw Donut Segment
    // Circumference = 100, Radius = 15.91549430918954
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'donut-segment-dynamic');
    circle.setAttribute('cx', '18');
    circle.setAttribute('cy', '18');
    circle.setAttribute('r', '15.91549430918954');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', config.color);
    circle.setAttribute('stroke-dasharray', `${percentage.toFixed(4)} ${(100 - percentage).toFixed(4)}`);
    circle.setAttribute('stroke-dashoffset', `${-runningOffset.toFixed(4)}`);
    circle.setAttribute('title', `${category}: Rs.${sum.toFixed(2)} (${percentage.toFixed(0)}%)`);
    
    // Hover animation triggers category progress list hover highlights
    circle.addEventListener('mouseenter', () => highlightProgressListItem(category, true));
    circle.addEventListener('mouseleave', () => highlightProgressListItem(category, false));

    donutChartSVG.appendChild(circle);
    runningOffset += percentage;

    // 2. Render Progress List Item
    const barItem = document.createElement('div');
    barItem.className = 'category-bar-item';
    barItem.setAttribute('data-category', category);
    
    barItem.innerHTML = `
      <div class="category-bar-label">
        <span class="category-name">
          <span class="category-dot" style="background-color: ${config.color};"></span>
          ${category}
        </span>
        <span class="category-sum">Rs.${sum.toFixed(2)} (${percentage.toFixed(0)}%)</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${percentage.toFixed(0)}%; background-color: ${config.color};"></div>
      </div>
    `;
    
    categoryProgressListEl.appendChild(barItem);
  });

  // Donut center display spent ratio (total expense / total income)
  const totals = calculateTotals();
  let spendRatio = 0;
  if (totals.totalIncome > 0) {
    spendRatio = Math.min(100, Math.round((totals.totalExpenses / totals.totalIncome) * 100));
  } else if (totals.totalExpenses > 0) {
    spendRatio = 100;
  }
  donutPercent.textContent = `${spendRatio}%`;
}

function highlightProgressListItem(category, isHighlighted) {
  const item = categoryProgressListEl.querySelector(`.category-bar-item[data-category="${category}"]`);
  if (item) {
    if (isHighlighted) {
      item.style.backgroundColor = 'var(--input-bg)';
      item.style.transform = 'translateX(4px)';
    } else {
      item.style.backgroundColor = '';
      item.style.transform = '';
    }
  }
}

/* ==========================================================================
   Transaction Form Modal CRUD Operations
   ========================================================================== */

function openModal(defaultType = 'expense', editTxId = '') {
  const today = new Date().toISOString().split('T')[0];
  txDateInput.value = today;
  
  if (editTxId) {
    modalTitle.textContent = 'Edit Transaction';
    btnSubmitTx.textContent = 'Save Changes';
    txIdInput.value = editTxId;
    
    const tx = state.transactions.find(t => t.id === editTxId);
    if (tx) {
      if (tx.type === 'income') {
        typeIncomeRadio.checked = true;
      } else {
        typeExpenseRadio.checked = true;
      }
      txAmountInput.value = tx.amount;
      txDateInput.value = tx.date;
      txCategorySelect.value = tx.category;
      txNotesInput.value = tx.notes || '';
    }
  } else {
    modalTitle.textContent = 'Add Transaction';
    btnSubmitTx.textContent = 'Save Transaction';
    txIdInput.value = '';
    
    if (defaultType === 'income') {
      typeIncomeRadio.checked = true;
    } else {
      typeExpenseRadio.checked = true;
    }
    txAmountInput.value = '';
    txCategorySelect.value = '';
    txNotesInput.value = '';
  }

  txModal.classList.add('active');
  setTimeout(() => txAmountInput.focus(), 100);
}

function closeModal() {
  txModal.classList.remove('active');
  txForm.reset();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const id = txIdInput.value;
  const type = typeIncomeRadio.checked ? 'income' : 'expense';
  const amount = parseFloat(txAmountInput.value);
  const date = txDateInput.value;
  const category = txCategorySelect.value;
  const notes = txNotesInput.value.trim();

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid amount greater than 0.', 'error');
    return;
  }

  if (id) {
    const index = state.transactions.findIndex(tx => tx.id === id);
    if (index !== -1) {
      state.transactions[index] = { ...state.transactions[index], type, amount, date, category, notes };
      showToast('Transaction updated successfully!', 'success');
    } else {
      showToast('Error editing transaction.', 'error');
    }
  } else {
    const newTx = {
      id: generateUUID(),
      type,
      amount,
      date,
      category,
      notes
    };
    state.transactions.push(newTx);
    showToast('Transaction added successfully!', 'success');
  }

  saveData();
  closeModal();
  updateUI();
}

// Global functions exposed for feed events
window.editTransaction = function(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (tx) {
    openModal(tx.type, id);
  }
};

window.deleteTransaction = async function(id) {
  const confirmResult = await showConfirmDialog(
    'Delete Transaction',
    'Are you sure you want to delete this transaction record? This cannot be undone.'
  );

  if (confirmResult) {
    state.transactions = state.transactions.filter(tx => tx.id !== id);
    saveData();
    updateUI();
    showToast('Transaction deleted.', 'info');
  }
};

/* ==========================================================================
   Custom Glassmorphic Confirmation Modal Overlay Logic
   ========================================================================== */

function showConfirmDialog(title, message) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  
  confirmModal.classList.add('active');

  return new Promise((resolve) => {
    confirmResolve = resolve;

    const cleanup = (value) => {
      confirmModal.classList.remove('active');
      btnConfirmProceed.removeEventListener('click', onProceed);
      btnConfirmCancel.removeEventListener('click', onCancel);
      confirmResolve = null;
      resolve(value);
    };

    const onProceed = () => cleanup(true);
    const onCancel = () => cleanup(false);

    btnConfirmProceed.addEventListener('click', onProceed);
    btnConfirmCancel.addEventListener('click', onCancel);
  });
}

/* ==========================================================================
   Import / Export Methods (JSON and CSV)
   ========================================================================== */

function exportDataJSON() {
  if (state.transactions.length === 0) {
    showToast('No transaction data to export.', 'error');
    return;
  }
  triggerDownload(
    JSON.stringify(state.transactions, null, 2),
    'application/json',
    `auraspend_backup_${getLocalDateString()}.json`
  );
  showToast('JSON backup file exported!', 'success');
}

function exportDataCSV() {
  if (state.transactions.length === 0) {
    showToast('No transaction data to export.', 'error');
    return;
  }

  // Generate CSV Headers and Columns
  const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Notes'];
  const rows = state.transactions.map(tx => [
    tx.id,
    tx.type,
    tx.amount.toFixed(2),
    tx.category,
    tx.date,
    tx.notes || ''
  ]);

  // Clean values wrapping with quotes and escaping double quotes
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  triggerDownload(
    csvContent,
    'text/csv;charset=utf-8;',
    `auraspend_spreadsheet_${getLocalDateString()}.csv`
  );
  showToast('Excel CSV spreadsheet exported!', 'success');
}

function triggerDownload(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      
      if (!Array.isArray(imported)) {
        throw new Error('Imported structure must be an array list.');
      }

      const valid = imported.every(tx => {
        return tx.id && 
               (tx.type === 'income' || tx.type === 'expense') && 
               !isNaN(parseFloat(tx.amount)) && 
               tx.date && 
               tx.category;
      });

      if (!valid) {
        throw new Error('Invalid format: Missing required transaction schema fields.');
      }

      const mergeApproved = await showConfirmDialog(
        'Import Data',
        `Would you like to import and merge ${imported.length} transactions with your current database?`
      );

      if (mergeApproved) {
        const existingIds = new Set(state.transactions.map(t => t.id));
        const newTransactions = imported.filter(t => !existingIds.has(t.id));
        
        state.transactions = [...state.transactions, ...newTransactions];
        saveData();
        updateUI();
        showToast(`Imported ${newTransactions.length} new transactions!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(`Import error: ${err.message}`, 'error');
    } finally {
      importFileInput.value = '';
    }
  };
  reader.readAsText(file);
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */

function generateUUID() {
  return 'tx-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

function formatFriendlyDate(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', options);
  }
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function getLocalDateString() {
  return new Date().toISOString().split('T')[0];
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function highlightSearch(text, query) {
  const escaped = escapeHtml(text);
  if (!query) return escaped;
  const escapedQuery = escapeHtml(query);
  const regex = new RegExp(`(${escapeRegExp(escapedQuery)})`, 'gi');
  return escaped.replace(regex, '<span class="highlight">$1</span>');
}

/* ==========================================================================
   Toast Notifications System
   ========================================================================== */

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '';
  if (type === 'success') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon text-income" style="width:18px;height:18px;"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'error') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon text-expense" style="width:18px;height:18px;"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>`;
  } else {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon" style="width:18px;height:18px;color:var(--primary);"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12" y1="8" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Close toast trigger timer
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

/* ==========================================================================
   Visual Analytics — Plotly Chart Renderers
   ========================================================================== */

function renderPlotlyAnalytics() {
  const plotlyChartEl = document.getElementById('plotlyChart');
  const plotlyNoDataEl = document.getElementById('plotlyNoData');
  const plotlySubtextEl = document.getElementById('plotlySubtext');

  if (!plotlyChartEl) return;

  const transactions = getFilteredTransactions();

  if (transactions.length === 0) {
    plotlyChartEl.classList.add('hidden');
    plotlyNoDataEl.classList.add('visible');
    plotlySubtextEl.textContent = 'No transaction data available';
    return;
  }

  plotlyChartEl.classList.remove('hidden');
  plotlyNoDataEl.classList.remove('visible');

  if (state.activeChart === 'cashflow') {
    renderPlotlyCashFlow(transactions);
  } else if (state.activeChart === 'categories') {
    renderPlotlyCategories(transactions);
  } else if (state.activeChart === 'trend') {
    renderPlotlyTrend(transactions);
  }
}

function getPlotlyThemeConfig() {
  const isDark = state.theme === 'dark';
  return {
    fontColor: isDark ? '#f3f4f6' : '#0f172a',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    zeroLineColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    tooltipText: isDark ? '#f3f4f6' : '#0f172a',
  };
}

function renderPlotlyCashFlow(transactions) {
  const dates = [];
  const dateMap = {}; // date -> { income: 0, expense: 0 }

  // Chronological sort
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach(tx => {
    if (!dateMap[tx.date]) {
      dateMap[tx.date] = { income: 0, expense: 0 };
      dates.push(tx.date);
    }
    const amt = parseFloat(tx.amount);
    if (tx.type === 'income') {
      dateMap[tx.date].income += amt;
    } else {
      dateMap[tx.date].expense += amt;
    }
  });

  // Calculate cumulative net balance historically using all transactions
  const allSorted = [...state.transactions].sort((a, b) => a.date.localeCompare(b.date));
  const allDateMap = {};
  allSorted.forEach(tx => {
    if (!allDateMap[tx.date]) {
      allDateMap[tx.date] = 0;
    }
    const amt = parseFloat(tx.amount);
    if (tx.type === 'income') {
      allDateMap[tx.date] += amt;
    } else {
      allDateMap[tx.date] -= amt;
    }
  });

  const allDatesUnique = Object.keys(allDateMap).sort();
  const cumulativeBalanceMap = {};
  let runningBal = 0;
  allDatesUnique.forEach(d => {
    runningBal += allDateMap[d];
    cumulativeBalanceMap[d] = runningBal;
  });

  const incomes = [];
  const expenses = [];
  const cumulativeBalances = [];

  dates.forEach(d => {
    incomes.push(dateMap[d].income);
    expenses.push(dateMap[d].expense);
    cumulativeBalances.push(cumulativeBalanceMap[d] || 0);
  });

  const isDark = state.theme === 'dark';
  const cfg = getPlotlyThemeConfig();

  const traceIncome = {
    x: dates,
    y: incomes,
    name: 'Income',
    type: 'bar',
    marker: {
      color: isDark ? 'rgba(16, 185, 129, 0.85)' : 'rgba(5, 150, 105, 0.85)',
      line: {
        color: isDark ? '#10b981' : '#059669',
        width: 1.5
      }
    },
    hovertemplate: 'Income: Rs.%{y:.2f}<extra></extra>'
  };

  const traceExpense = {
    x: dates,
    y: expenses,
    name: 'Expense',
    type: 'bar',
    marker: {
      color: isDark ? 'rgba(239, 68, 68, 0.85)' : 'rgba(220, 38, 38, 0.85)',
      line: {
        color: isDark ? '#ef4444' : '#dc2626',
        width: 1.5
      }
    },
    hovertemplate: 'Expense: Rs.%{y:.2f}<extra></extra>'
  };

  const traceBal = {
    x: dates,
    y: cumulativeBalances,
    name: 'Net Balance',
    type: 'scatter',
    mode: 'lines+markers',
    yaxis: 'y2',
    line: {
      color: '#6366f1',
      width: 3,
      shape: 'spline'
    },
    marker: {
      color: '#6366f1',
      size: 6
    },
    hovertemplate: 'Balance: Rs.%{y:.2f}<extra></extra>'
  };

  const data = [traceIncome, traceExpense, traceBal];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 30, r: 50, b: 40, l: 50 },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: 1.15,
      font: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    xaxis: {
      type: 'date',
      gridcolor: cfg.gridColor,
      zerolinecolor: cfg.zeroLineColor,
      tickfont: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    yaxis: {
      title: 'Cash Flow (Rs.)',
      titlefont: { color: cfg.fontColor, family: 'Outfit, sans-serif' },
      gridcolor: cfg.gridColor,
      zerolinecolor: cfg.zeroLineColor,
      tickfont: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    yaxis2: {
      title: 'Balance (Rs.)',
      titlefont: { color: '#6366f1', family: 'Outfit, sans-serif' },
      tickfont: { color: '#6366f1', family: 'Outfit, sans-serif' },
      overlaying: 'y',
      side: 'right',
      showgrid: false
    },
    barmode: 'group',
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: cfg.tooltipBg,
      bordercolor: cfg.tooltipBorder,
      font: { color: cfg.tooltipText, family: 'Outfit, sans-serif' }
    }
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  Plotly.newPlot('plotlyChart', data, layout, config);
  document.getElementById('plotlySubtext').textContent = 'Income vs. Expense with Net Balance over time';
}

function renderPlotlyCategories(transactions) {
  const categorySums = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const amt = parseFloat(tx.amount);
      categorySums[tx.category] = (categorySums[tx.category] || 0) + amt;
    }
  });

  const categories = Object.keys(categorySums);
  const sums = Object.values(categorySums);

  if (categories.length === 0) {
    const plotlyChartEl = document.getElementById('plotlyChart');
    const plotlyNoDataEl = document.getElementById('plotlyNoData');
    plotlyChartEl.classList.add('hidden');
    plotlyNoDataEl.classList.add('visible');
    document.getElementById('plotlySubtext').textContent = 'No expenses available';
    return;
  }

  const cfg = getPlotlyThemeConfig();
  const colors = categories.map(cat => (categoryConfig[cat] || categoryConfig['Other']).color);

  const trace = {
    labels: categories,
    values: sums,
    type: 'pie',
    hole: 0.6,
    marker: {
      colors: colors,
      line: {
        color: state.theme === 'dark' ? '#0b0f19' : '#ffffff',
        width: 2
      }
    },
    textinfo: 'percent',
    hoverinfo: 'label+value+percent',
    hovertemplate: '<b>%{label}</b><br>Spent: Rs.%{value:.2f}<br>%{percent}<extra></extra>'
  };

  const data = [trace];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 30, r: 20, b: 20, l: 20 },
    showlegend: true,
    legend: {
      orientation: 'v',
      x: 0.85,
      y: 0.5,
      font: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: cfg.tooltipBg,
      bordercolor: cfg.tooltipBorder,
      font: { color: cfg.tooltipText, family: 'Outfit, sans-serif' }
    }
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  Plotly.newPlot('plotlyChart', data, layout, config);
  document.getElementById('plotlySubtext').textContent = 'Breakdown of expenditures by category';
}

function renderPlotlyTrend(transactions) {
  const dates = [];
  const dateMap = {};
  const sorted = [...transactions].filter(tx => tx.type === 'expense').sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach(tx => {
    if (!dateMap[tx.date]) {
      dateMap[tx.date] = 0;
      dates.push(tx.date);
    }
    dateMap[tx.date] += parseFloat(tx.amount);
  });

  if (dates.length === 0) {
    const plotlyChartEl = document.getElementById('plotlyChart');
    const plotlyNoDataEl = document.getElementById('plotlyNoData');
    plotlyChartEl.classList.add('hidden');
    plotlyNoDataEl.classList.add('visible');
    document.getElementById('plotlySubtext').textContent = 'No expenses available';
    return;
  }

  const dailyExpenses = dates.map(d => dateMap[d]);

  const movingAverages = [];
  for (let i = 0; i < dailyExpenses.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - 6); j <= i; j++) {
      sum += dailyExpenses[j];
      count++;
    }
    movingAverages.push(sum / count);
  }

  const cfg = getPlotlyThemeConfig();
  const isDark = state.theme === 'dark';

  const traceDaily = {
    x: dates,
    y: dailyExpenses,
    name: 'Daily Spending',
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      color: isDark ? 'rgba(239, 68, 68, 0.85)' : 'rgba(220, 38, 38, 0.85)',
      width: 2.5
    },
    marker: {
      color: isDark ? '#ef4444' : '#dc2626',
      size: 6
    },
    hovertemplate: 'Spent: Rs.%{y:.2f}<extra></extra>'
  };

  const traceMA = {
    x: dates,
    y: movingAverages,
    name: '7-Day Moving Avg',
    type: 'scatter',
    mode: 'lines',
    line: {
      color: '#3b82f6',
      width: 2,
      dash: 'dash'
    },
    hovertemplate: '7D Avg: Rs.%{y:.2f}<extra></extra>'
  };

  const data = [traceDaily, traceMA];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 30, r: 40, b: 40, l: 50 },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: 1.15,
      font: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    xaxis: {
      type: 'date',
      gridcolor: cfg.gridColor,
      zerolinecolor: cfg.zeroLineColor,
      tickfont: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    yaxis: {
      title: 'Amount Spent (Rs.)',
      titlefont: { color: cfg.fontColor, family: 'Outfit, sans-serif' },
      gridcolor: cfg.gridColor,
      zerolinecolor: cfg.zeroLineColor,
      tickfont: { color: cfg.fontColor, family: 'Outfit, sans-serif' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: cfg.tooltipBg,
      bordercolor: cfg.tooltipBorder,
      font: { color: cfg.tooltipText, family: 'Outfit, sans-serif' }
    }
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  Plotly.newPlot('plotlyChart', data, layout, config);
  document.getElementById('plotlySubtext').textContent = 'Daily spending trends and moving averages';
}

/**
 * Iraqi Agent Dashboard - Vanilla JS App
 */

const GOVERNORATES = [
    "Baghdad", "Basra", "Nineveh", "Erbil", "Najaf", "Karbala", 
    "Sulaymaniyah", "Kirkuk", "Anbar", "Diyala", "Babil", "Dhi Qar", 
    "Duhok", "Maysan", "Muthanna", "Qadisiyyah", "Salah al-Din", "Wasit"
];

const CATEGORIES = [
    "Restaurants", "Cafes", "Pharmacies", "Hospitals", "Clinics", 
    "Hotels", "Supermarkets", "Bakeries", "Electronics", "Clothing", 
    "Schools", "Universities", "Gyms", "Salons", "Car Services", 
    "Construction", "Hardware", "Jewelry", "Mobile Phones", "Furniture"
];

// State
let state = {
    selectedGovs: new Set(),
    selectedCats: new Set(),
    stats: {},
    jobs: [],
    results: [],
    failures: [],
    logs: [],
    isRefreshing: false
};

// UI Elements
const elements = {
    govList: document.getElementById('gov-list'),
    catList: document.getElementById('cat-list'),
    govCount: document.getElementById('gov-selected-count'),
    catCount: document.getElementById('cat-selected-count'),
    jobsBody: document.getElementById('jobs-body'),
    resultsBody: document.getElementById('results-body'),
    failuresBody: document.getElementById('failures-body'),
    logPanel: document.getElementById('activity-log'),
    alertContainer: document.getElementById('alert-container'),
    lastSync: document.getElementById('last-sync'),
    btnStartSelected: document.getElementById('btn-start-selected'),
    btnStartAll: document.getElementById('btn-start-all'),
    btnRefresh: document.getElementById('btn-refresh'),
    btnRetryFailed: document.getElementById('btn-retry-failed')
};

// Initialization
function init() {
    renderSelectionGrids();
    setupEventListeners();
    refreshData();
    setInterval(refreshData, 10000); // Auto-refresh every 10s
    addLog('System initialized. Ready for operations.', 'info');
}

function renderSelectionGrids() {
    // Render Governorates
    elements.govList.innerHTML = GOVERNORATES.map(gov => `
        <label class="pill" data-gov="${gov}">
            <input type="checkbox" onchange="toggleGov('${gov}')">
            <span>${gov}</span>
        </label>
    `).join('');

    // Render Categories
    elements.catList.innerHTML = CATEGORIES.map(cat => `
        <label class="pill" data-cat="${cat}">
            <input type="checkbox" onchange="toggleCat('${cat}')">
            <span>${cat}</span>
        </label>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('btn-select-all-govs').onclick = () => selectAll('gov');
    document.getElementById('btn-deselect-all-govs').onclick = () => deselectAll('gov');
    document.getElementById('btn-select-all-cats').onclick = () => selectAll('cat');
    document.getElementById('btn-deselect-all-cats').onclick = () => deselectAll('cat');

    elements.btnStartSelected.onclick = startSelected;
    elements.btnStartAll.onclick = startAll;
    elements.btnRefresh.onclick = refreshData;
    elements.btnRetryFailed.onclick = retryAllFailed;
}

// Selection Logic
window.toggleGov = (gov) => {
    if (state.selectedGovs.has(gov)) state.selectedGovs.delete(gov);
    else state.selectedGovs.add(gov);
    updateSelectionUI();
};

window.toggleCat = (cat) => {
    if (state.selectedCats.has(cat)) state.selectedCats.delete(cat);
    else state.selectedCats.add(cat);
    updateSelectionUI();
};

function selectAll(type) {
    const list = type === 'gov' ? GOVERNORATES : CATEGORIES;
    const set = type === 'gov' ? state.selectedGovs : state.selectedCats;
    list.forEach(item => set.add(item));
    updateSelectionUI();
}

function deselectAll(type) {
    const set = type === 'gov' ? state.selectedGovs : state.selectedCats;
    set.clear();
    updateSelectionUI();
}

function updateSelectionUI() {
    // Update Govs
    document.querySelectorAll('[data-gov]').forEach(el => {
        const gov = el.dataset.gov;
        const isSelected = state.selectedGovs.has(gov);
        el.classList.toggle('selected', isSelected);
        el.querySelector('input').checked = isSelected;
    });
    elements.govCount.textContent = state.selectedGovs.size;

    // Update Cats
    document.querySelectorAll('[data-cat]').forEach(el => {
        const cat = el.dataset.cat;
        const isSelected = state.selectedCats.has(cat);
        el.classList.toggle('selected', isSelected);
        el.querySelector('input').checked = isSelected;
    });
    elements.catCount.textContent = state.selectedCats.size;
}

// API Configuration
const API_BASE_URL = window.API_BASE_URL || 
                    (window.location.hostname === 'localhost' ? '' : 
                     '');

// API Calls with error handling
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Call: ${url}`);
    
    try {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API Error for ${endpoint}:`, error);
        throw error;
    }
}

async function refreshData() {
    if (state.isRefreshing) return;
    state.isRefreshing = true;
    elements.btnRefresh.disabled = true;

    try {
        const [stats, jobs, results, failures] = await Promise.all([
            apiCall('/api/dashboard'),
            apiCall('/api/jobs'),
            apiCall('/api/results'),
            apiCall('/api/failures')
        ]);

        state.stats = stats;
        state.jobs = jobs;
        state.results = results;
        state.failures = failures;

        renderDashboard();
        elements.lastSync.textContent = `Last sync: ${new Date().toLocaleTimeString()}`;
        addLog('Successfully synced with backend.', 'success');
        
        // Show connection status in UI
        document.getElementById('connection-status').textContent = 'Connected';
        document.getElementById('connection-status').className = 'status-chip status-running';
    } catch (err) {
        console.error('Refresh failed', err);
        const errorMsg = `Backend connection failed: ${err.message}`;
        addLog(errorMsg, 'error');
        showAlert(errorMsg, 'error');
        
        // Show connection status in UI
        document.getElementById('connection-status').textContent = 'Disconnected';
        document.getElementById('connection-status').className = 'status-chip status-failed';
    } finally {
        state.isRefreshing = false;
        elements.btnRefresh.disabled = false;
    }
}

async function startSelected() {
    if (state.selectedGovs.size === 0 || state.selectedCats.size === 0) {
        showAlert('Please select at least one governorate and one category.', 'error');
        return;
    }

    setLoading(true);
    try {
        const data = await apiCall('/api/start-selected', {
            method: 'POST',
            body: JSON.stringify({
                governorates: Array.from(state.selectedGovs),
                categories: Array.from(state.selectedCats)
            })
        });
        
        if (data.success) {
            showAlert('Agents started for selected configuration.', 'success');
            addLog(`Started agents for ${state.selectedGovs.size} govs and ${state.selectedCats.size} cats.`, 'success');
            refreshData();
        }
    } catch (err) {
        const errorMsg = `Failed to start agents: ${err.message}`;
        showAlert(errorMsg, 'error');
        addLog(errorMsg, 'error');
    } finally {
        setLoading(false);
    }
}

async function startAll() {
    setLoading(true);
    try {
        const data = await apiCall('/api/start-all', { method: 'POST' });
        if (data.success) {
            showAlert('All governorate agents have been triggered.', 'success');
            addLog('Triggered all governorate agents.', 'warning');
            refreshData();
        }
    } catch (err) {
        const errorMsg = `Failed to start all agents: ${err.message}`;
        showAlert(errorMsg, 'error');
        addLog(errorMsg, 'error');
    } finally {
        setLoading(false);
    }
}

async function retryAllFailed() {
    setLoading(true);
    try {
        const data = await apiCall('/api/retry-job', {
            method: 'POST',
            body: JSON.stringify({ all: true })
        });
        if (data.success) {
            showAlert('Retry command sent for all failed jobs.', 'success');
            addLog('Retrying all failed jobs.', 'info');
            refreshData();
        }
    } catch (err) {
        const errorMsg = `Failed to trigger retry: ${err.message}`;
        showAlert(errorMsg, 'error');
        addLog(errorMsg, 'error');
    } finally {
        setLoading(false);
    }
}

async function retryJob(id) {
    try {
        const data = await apiCall('/api/retry-job', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        if (data.success) {
            addLog(`Retrying job ${id}...`, 'info');
            refreshData();
        }
    } catch (err) {
        const errorMsg = `Failed to retry job ${id}: ${err.message}`;
        showAlert(errorMsg, 'error');
        addLog(errorMsg, 'error');
    }
}

// Rendering
function renderDashboard() {
    // Metrics
    document.getElementById('metric-running').textContent = state.stats.runningJobs || 0;
    document.getElementById('metric-pending').textContent = state.stats.pendingJobs || 0;
    document.getElementById('metric-completed').textContent = state.stats.completedJobs || 0;
    document.getElementById('metric-failed').textContent = state.stats.failedJobs || 0;
    document.getElementById('metric-saved').textContent = state.stats.totalBusinessesToday || 0;
    document.getElementById('metric-active-govs').textContent = state.jobs.length;

    // Jobs Table
    elements.jobsBody.innerHTML = state.jobs.map(job => `
        <tr>
            <td><strong>${job.governorate}</strong></td>
            <td>${job.city}</td>
            <td>${job.category}</td>
            <td><span class="status-chip status-${job.status}">${job.status}</span></td>
            <td>${job.savedCount} / ${job.targetCount}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${job.progress}%"></div>
                </div>
                <span style="font-size: 10px">${job.progress}%</span>
            </td>
            <td class="text-muted">${job.currentStep}</td>
            <td class="text-muted">${formatDate(job.updatedAt)}</td>
        </tr>
    `).join('');
    
    const emptyJobs = document.getElementById('jobs-empty');
    if (state.jobs.length === 0) emptyJobs.classList.remove('hidden');
    else emptyJobs.classList.add('hidden');
    document.getElementById('active-jobs-count').textContent = `${state.jobs.length} Jobs`;

    // Results Table
    elements.resultsBody.innerHTML = state.results.map(res => `
        <tr>
            <td><strong>${res.name}</strong></td>
            <td>${res.governorate}</td>
            <td>${res.city}</td>
            <td>${res.category}</td>
            <td>${res.phone}</td>
            <td>${res.source}</td>
            <td>${(res.confidence * 100).toFixed(0)}%</td>
            <td class="text-muted">${formatDate(res.savedAt)}</td>
        </tr>
    `).join('');

    // Failures Table
    elements.failuresBody.innerHTML = state.failures.map(fail => `
        <tr>
            <td><strong>${fail.governorate}</strong></td>
            <td>${fail.city}</td>
            <td>${fail.category}</td>
            <td class="log-type-error">${fail.errorMessage}</td>
            <td>${fail.retryCount}</td>
            <td class="text-muted">${formatDate(fail.updatedAt)}</td>
            <td>
                <button class="btn-text" onclick="retryJob('${fail.id}')">Retry</button>
            </td>
        </tr>
    `).join('');
}

// Helpers
function formatDate(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function addLog(msg, type = 'info') {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
        <span class="log-msg log-type-${type}">${msg}</span>
    `;
    elements.logPanel.prepend(entry);
    
    // Keep only last 100 logs
    while (elements.logPanel.children.length > 100) {
        elements.logPanel.removeChild(elements.logPanel.lastChild);
    }
}

function showAlert(msg, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = msg;
    elements.alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

function setLoading(isLoading) {
    elements.btnStartSelected.disabled = isLoading;
    elements.btnStartAll.disabled = isLoading;
    elements.btnRetryFailed.disabled = isLoading;
}

// Start
init();

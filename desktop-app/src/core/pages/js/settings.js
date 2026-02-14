// Settings Page
let activeSettingsTab = 'general';

function renderSettings() {
    return renderSettingsContent();
}

function renderSettingsContent() {
    return `
        <div class="wallet-page">
            <nav class="wallet-nav">
                <div class="nav-left">
                    <div class="nav-logo">⬢ DogeGage</div>
                    <div class="nav-tabs">
                        <a href="#/wallet" class="nav-tab">WALLETS</a>
                        <a href="#/portfolio" class="nav-tab">PORTFOLIO</a>
                        <a href="#/exchange" class="nav-tab">EXCHANGE</a>
                        <a href="#/settings" class="nav-tab active">SETTINGS</a>
                    </div>
                </div>
                <div class="nav-right">
                    <button class="nav-icon-btn" onclick="router.navigate('/wallet')">←</button>
                </div>
            </nav>
            
            <div class="settings-page">
                <div class="settings-sidebar">
                    <div class="settings-sidebar-item ${activeSettingsTab === 'general' ? 'active' : ''}" onclick="switchSettingsTab('general')">
                        <span>⚙️</span>
                        <span>General</span>
                    </div>
                    <div class="settings-sidebar-item ${activeSettingsTab === 'security' ? 'active' : ''}" onclick="switchSettingsTab('security')">
                        <span>🔐</span>
                        <span>Security</span>
                    </div>
                    <div class="settings-sidebar-item ${activeSettingsTab === 'backup' ? 'active' : ''}" onclick="switchSettingsTab('backup')">
                        <span>💾</span>
                        <span>Backup & Recovery</span>
                    </div>
                    <div class="settings-sidebar-item ${activeSettingsTab === 'danger' ? 'active' : ''}" onclick="switchSettingsTab('danger')">
                        <span>⚠️</span>
                        <span>Danger Zone</span>
                    </div>
                </div>
                
                <div class="settings-content">
                    ${renderSettingsTab()}
                </div>
            </div>
            
            <!-- Mobile Bottom Navigation -->
            <nav class="mobile-bottom-nav">
                <a href="#/wallet" class="mobile-nav-btn">
                    <span>💼</span>
                    <span>Wallet</span>
                </a>
                <a href="#/portfolio" class="mobile-nav-btn">
                    <span>📊</span>
                    <span>Portfolio</span>
                </a>
                <a href="#/exchange" class="mobile-nav-btn">
                    <span>🔄</span>
                    <span>Exchange</span>
                </a>
                <a href="#/settings" class="mobile-nav-btn active">
                    <span>⚙️</span>
                    <span>Settings</span>
                </a>
            </nav>
        </div>
    `;
}

function switchSettingsTab(tab) {
    activeSettingsTab = tab;
    document.getElementById('app').innerHTML = renderSettings();
}

function renderSettingsTab() {
    switch (activeSettingsTab) {
        case 'general':
            return renderGeneralSettings();
        case 'security':
            return renderSecuritySettings();
        case 'backup':
            return renderBackupSettings();
        case 'danger':
            return renderDangerSettings();
        default:
            return renderGeneralSettings();
    }
}

function renderGeneralSettings() {
    return `
        <div class="settings-section">
            <h2>General</h2>
            <p class="settings-description">Customize your wallet experience</p>
            
            <div class="settings-card">
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>Display Currency</strong>
                        <span>Set your preferred fiat currency for portfolio values</span>
                    </div>
                    <div class="settings-item-actions">
                        <select class="settings-select" onchange="changeCurrency(this.value)">
                            <option value="usd" ${selectedCurrency === 'usd' ? 'selected' : ''}>USD ($)</option>
                            <option value="eur" ${selectedCurrency === 'eur' ? 'selected' : ''}>EUR (€)</option>
                            <option value="gbp" ${selectedCurrency === 'gbp' ? 'selected' : ''}>GBP (£)</option>
                            <option value="jpy" ${selectedCurrency === 'jpy' ? 'selected' : ''}>JPY (¥)</option>
                            <option value="cad" ${selectedCurrency === 'cad' ? 'selected' : ''}>CAD ($)</option>
                            <option value="aud" ${selectedCurrency === 'aud' ? 'selected' : ''}>AUD ($)</option>
                            <option value="chf" ${selectedCurrency === 'chf' ? 'selected' : ''}>CHF (Fr)</option>
                            <option value="cny" ${selectedCurrency === 'cny' ? 'selected' : ''}>CNY (¥)</option>
                            <option value="inr" ${selectedCurrency === 'inr' ? 'selected' : ''}>INR (₹)</option>
                            <option value="krw" ${selectedCurrency === 'krw' ? 'selected' : ''}>KRW (₩)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSecuritySettings() {
    const currentDelay = autoLockService.getDelay();
    const isEnabled = autoLockService.isEnabled();

    return `
        <div class="settings-section">
            <h2>Security</h2>
            <p class="settings-description">Protect your wallet with auto-lock and password settings</p>
            
            <div class="settings-card">
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>Auto-Lock</strong>
                        <span>Automatically lock your wallet after a period of inactivity</span>
                    </div>
                    <div class="settings-item-actions">
                        <label class="toggle-switch">
                            <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleAutoLock(this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                
                ${isEnabled ? `
                    <div class="settings-item">
                        <div class="settings-item-info">
                            <strong>Lock Timer</strong>
                            <span>How long before the wallet locks itself</span>
                        </div>
                        <div class="settings-item-actions">
                            <select class="settings-select" onchange="updateAutoLockDelay(this.value)">
                                <option value="1" ${currentDelay === 1 ? 'selected' : ''}>1 minute</option>
                                <option value="5" ${currentDelay === 5 ? 'selected' : ''}>5 minutes</option>
                                <option value="10" ${currentDelay === 10 ? 'selected' : ''}>10 minutes</option>
                                <option value="15" ${currentDelay === 15 ? 'selected' : ''}>15 minutes</option>
                                <option value="30" ${currentDelay === 30 ? 'selected' : ''}>30 minutes</option>
                                <option value="60" ${currentDelay === 60 ? 'selected' : ''}>1 hour</option>
                            </select>
                        </div>
                    </div>
                ` : ''}
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>Change Password</strong>
                        <span>Update the password used to unlock your wallet</span>
                    </div>
                    <div class="settings-item-actions">
                        <button class="btn-secondary" onclick="changePassword()">Change</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleAutoLock(enabled) {
    autoLockService.setEnabled(enabled);
    document.getElementById('app').innerHTML = renderSettings();
}

function updateAutoLockDelay(minutes) {
    autoLockService.setDelay(parseInt(minutes));
    alert(`Auto-lock timer set to ${minutes} minute${minutes > 1 ? 's' : ''}`);
}

function renderBackupSettings() {
    return `
        <div class="settings-section">
            <h2>Backup & Recovery</h2>
            <p class="settings-description">Keep your wallet safe with encrypted backups and seed phrase access</p>
            
            <div class="settings-card">
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>Export Tuffbackup</strong>
                        <span>Download an encrypted .dogegage backup file — protected by your password</span>
                    </div>
                    <div class="settings-item-actions">
                        <button class="btn-primary" onclick="exportBackupFile()">Export</button>
                    </div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>Import Tuffbackup</strong>
                        <span>Restore your wallet from a previously exported .dogegage file</span>
                    </div>
                    <div class="settings-item-actions">
                        <button class="btn-secondary" onclick="document.getElementById('backupFileInput').click()">Import</button>
                        <input type="file" id="backupFileInput" accept=".dogegage" style="display: none;" onchange="importBackupFile(event)">
                    </div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>View Seed Phrase</strong>
                        <span>Reveal your 12-word recovery phrase — never share this with anyone</span>
                    </div>
                    <div class="settings-item-actions">
                        <button class="btn-secondary" onclick="viewSeedPhrase()">Reveal</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderDangerSettings() {
    return `
        <div class="settings-section">
            <h2>Danger Zone</h2>
            <p class="settings-description">These actions are permanent and cannot be undone</p>
            
            <div class="settings-card">
                <div class="settings-item">
                    <div class="settings-item-info">
                        <strong>Forget Wallet</strong>
                        <span>Permanently delete all wallet data from this device. Make sure you have a backup first.</span>
                    </div>
                    <div class="settings-item-actions">
                        <button class="btn-danger" onclick="clearWalletData()">Forget Wallet</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function viewSeedPhrase() {
    const password = prompt('Enter your password to view seed phrase:');
    if (!password) return;

    try {
        const seedPhrase = await encryptionService.loadWallet(password);
        alert(`Your Seed Phrase:\n\n${seedPhrase}\n\n⚠️ Never share your seed phrase!\n⚠️ Anyone with this can access your funds!`);
    } catch (error) {
        alert('Incorrect password');
    }
}

function changePassword() {
    alert('Change password feature coming soon!');
}

function clearWalletData() {
    if (confirm('Are you sure you want to forget this wallet?\n\nThis will delete your encrypted wallet from this device. Make sure you have your seed phrase or Tuffbackup saved!')) {
        // Prompt to download backup first
        if (confirm('Would you like to download a Tuffbackup before forgetting this wallet?')) {
            exportBackupFile();
            // Wait a bit for download to start
            setTimeout(() => {
                if (confirm('Backup downloaded. Proceed with forgetting wallet?')) {
                    walletService.lock();
                    sessionStorage.clear();
                    localStorage.clear();
                    alert('Wallet forgotten. Redirecting to home...');
                    router.navigate('/');
                }
            }, 1000);
        } else {
            if (confirm('This action cannot be undone. Are you absolutely sure?')) {
                walletService.lock();
                sessionStorage.clear();
                localStorage.clear();
                alert('Wallet forgotten. Redirecting to home...');
                router.navigate('/');
            }
        }
    }
}


// Export backup file
function exportBackupFile() {
    try {
        // Get encrypted wallet data from localStorage (it's a base64 string)
        const encryptedData = localStorage.getItem('encryptedWallet');
        if (!encryptedData) {
            alert('No wallet found to export');
            return;
        }

        // Create backup object with the base64 string directly
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            encryptedWallet: encryptedData
        };

        // Convert to JSON and create blob
        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tuffbackup.dogegage`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('Tuffbackup exported successfully');
        alert('Tuffbackup downloaded!');
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export backup: ' + error.message);
    }
}

// Import backup file
async function importBackupFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const backup = JSON.parse(text);

        // Validate backup format - export saves as { version, timestamp, encryptedWallet }
        if (!backup.version || !backup.encryptedWallet) {
            alert('Invalid backup file format');
            return;
        }

        // Confirm overwrite if wallet already exists
        if (encryptionService.hasStoredWallet()) {
            if (!confirm('This will replace your current wallet. Make sure you have backed it up!\n\nContinue?')) {
                return;
            }
        }

        // Ask for password to verify
        const password = prompt('Enter the password for this backup:');
        if (!password) return;

        // Try to decrypt to verify password is correct
        // encryptedWallet is the base64 string from encryptionService.encrypt()
        await encryptionService.decrypt(backup.encryptedWallet, password);

        // If decryption successful, save to the correct localStorage key
        localStorage.setItem('encryptedWallet', backup.encryptedWallet);

        alert('Wallet restored successfully! Please refresh the page.');
        location.reload();

    } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import backup. Make sure the password is correct.');
    }
}

// Create Wallet Page
function renderCreate() {
    // Hide tawk.to on create page
    hideTawkTo();
    
    return `
        <div class="landing-page">
            <div class="bg-gradient"></div>
            <div class="bg-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
            
            <div class="auth-container" style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Create New Wallet</h1>
                        <p>Generate a new wallet with a secure seed phrase</p>
                    </div>
                    
                    <div class="auth-form">
                        <div class="warning-box">
                            <div class="warning-icon">⚠️</div>
                            <div class="warning-text">
                                <strong>Important:</strong> Write down your seed phrase and keep it safe. 
                                You'll need it to recover your wallet. Never share it with anyone!
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Set Password</label>
                            <input 
                                type="password" 
                                id="createPassword" 
                                placeholder="Enter password"
                                class="form-input"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                placeholder="Confirm password"
                                class="form-input"
                            >
                        </div>
                        
                        <button onclick="generateWallet()" class="btn-primary btn-full">
                            Generate Wallet
                        </button>
                        
                        <div class="auth-footer">
                            Already have a wallet? <a href="#/import">Import Wallet</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSeedPhrase(mnemonic) {
    const words = mnemonic.split(' ');
    
    return `
        <div class="landing-page">
            <div class="bg-gradient"></div>
            <div class="bg-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
            
            <div class="auth-container" style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Your Seed Phrase</h1>
                        <p>Write this down and keep it safe!</p>
                    </div>
                    
                    <div class="auth-form">
                        <div class="warning-box">
                            <div class="warning-icon">🔒</div>
                            <div class="warning-text">
                                <strong>Never share your seed phrase!</strong><br>
                                Anyone with this phrase can access your funds.
                            </div>
                        </div>
                        
                        <div class="seed-grid">
                            ${words.map((word, i) => `
                                <div class="seed-word">
                                    <span class="seed-number">${i + 1}</span>
                                    <span class="seed-text">${word}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <button onclick="copySeedPhrase()" class="btn-outline btn-full">
                            📋 Copy to Clipboard
                        </button>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="savedCheckbox">
                            <label for="savedCheckbox">
                                I have written down my seed phrase in a safe place
                            </label>
                        </div>
                        
                        <button onclick="confirmSeedPhrase()" class="btn-primary btn-full" id="nextButton">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let generatedMnemonic = null;
let encryptedWalletData = null;

async function generateWallet() {
    const password = document.getElementById('createPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        // Generate random mnemonic
        const entropy = ethers.utils.randomBytes(16);
        const mnemonic = ethers.utils.entropyToMnemonic(entropy);
        
        // Save for later
        generatedMnemonic = mnemonic;
        
        // Encrypt and save
        await encryptionService.saveWallet(mnemonic, password);
        
        // Wait a bit for localStorage to sync
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Store encrypted data for backup
        encryptedWalletData = localStorage.getItem('dogegage_wallet');
        
        // Show seed phrase
        document.getElementById('app').innerHTML = renderSeedPhrase(mnemonic);
        
    } catch (error) {
        console.error('Failed to generate wallet:', error);
        alert('Failed to generate wallet: ' + error.message);
    }
}

function downloadBackupFile() {
    console.log('downloadBackupFile called');
    try {
        // Get encrypted wallet data from localStorage
        const encryptedData = localStorage.getItem('encryptedWallet');
        
        console.log('encryptedWalletData:', encryptedWalletData ? 'exists' : 'null');
        console.log('localStorage.encryptedWallet:', encryptedData ? 'exists' : 'null');
        console.log('All localStorage keys:', Object.keys(localStorage));
        
        if (!encryptedData) {
            console.error('No wallet data found');
            alert('No wallet data available. Please complete wallet creation first.');
            return;
        }
        
        console.log('Creating backup with data length:', encryptedData.length);
        
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            encryptedWallet: encryptedData
        };
        
        const json = JSON.stringify(backup, null, 2);
        console.log('Backup JSON created, length:', json.length);
        
        const blob = new Blob([json], { type: 'application/json' });
        console.log('Blob created, size:', blob.size);
        
        const url = URL.createObjectURL(blob);
        console.log('Blob URL created:', url);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tuffbackup.dogegage`;
        console.log('Download link created with filename:', a.download);
        
        document.body.appendChild(a);
        console.log('Link appended to body');
        
        a.click();
        console.log('Link clicked');
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Backup file download triggered successfully');
    } catch (error) {
        console.error('❌ Backup download error:', error);
        alert('Failed to download backup: ' + error.message);
    }
}

function copySeedPhrase() {
    if (!generatedMnemonic) {
        alert('No seed phrase available');
        return;
    }
    navigator.clipboard.writeText(generatedMnemonic);
    alert('Seed phrase copied to clipboard!');
}

async function confirmSeedPhrase() {
    const checkbox = document.getElementById('savedCheckbox');
    
    if (!checkbox.checked) {
        alert('Please confirm you have saved your seed phrase');
        return;
    }
    
    // Change button to loading
    const button = document.getElementById('nextButton');
    button.disabled = true;
    button.textContent = 'Loading...';
    
    try {
        // Import the wallet (this saves it to localStorage)
        await walletService.importFromSeed(generatedMnemonic);
        
        // Wait for save to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Fetch balances
        await walletService.fetchBalances();
        
        // Show backup prompt modal
        showBackupPrompt();
        
    } catch (error) {
        console.error('Failed to create wallet:', error);
        alert('Failed to create wallet: ' + error.message);
        button.disabled = false;
        button.textContent = 'Next';
    }
}

function showBackupPrompt() {
    document.getElementById('app').innerHTML = `
        <div class="landing-page">
            <div class="bg-gradient"></div>
            <div class="bg-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
            
            <div class="auth-container" style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>💾 Download Tuffbackup?</h1>
                        <p>Tuffbackup is an easier way to import your wallet than seeds</p>
                    </div>
                    
                    <div class="auth-form">
                        <div class="warning-box">
                            <div class="warning-icon">🔒</div>
                            <div class="warning-text">
                                <strong>What is Tuffbackup?</strong><br>
                                It's your wallet encrypted with your password. You can use it to restore your wallet on any device without typing your seed phrase.
                            </div>
                        </div>
                        
                        <button onclick="downloadBackupAndContinue()" class="btn-primary btn-full">
                            💾 Download Tuffbackup
                        </button>
                        
                        <button onclick="skipBackupAndContinue()" class="btn-outline btn-full">
                            Fuh no, I'm good
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function downloadBackupAndContinue() {
    // Small delay to avoid Apple password manager popup
    setTimeout(() => {
        downloadBackupFile();
        setTimeout(() => {
            router.navigate('/wallet');
        }, 500);
    }, 100);
}

function skipBackupAndContinue() {
    router.navigate('/wallet');
}

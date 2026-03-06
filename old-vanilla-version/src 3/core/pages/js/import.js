// Import Wallet Page
let importStep = 1;
let importedSeedPhrase = '';
let tuffbackupData = null; // Store TuffBackup file data

function renderImport() {
    if (importStep === 1) {
        return renderImportStep1();
    } else {
        return renderImportStep2();
    }
}

function renderImportStep1() {
    return `
        <div class="auth-page">
            <div class="auth-bg">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>
            
            <button class="auth-back" onclick="router.navigate('/')">
                ← Back
            </button>
            
            <div class="auth-container">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span>⬢</span>
                        <span>DogeGage Wallet</span>
                    </div>
                    <h2 class="auth-welcome">Import Wallet</h2>
                    <p class="auth-subtitle">Choose import method</p>
                </div>
                
                <div class="auth-form">
                    <button onclick="showSeedImport()" class="btn-auth-primary" style="margin-bottom: 12px;">
                        🌱 Import with Seed Phrase
                    </button>
                    
                    <button onclick="document.getElementById('tuffbackupInput').click()" class="btn-auth-secondary">
                        💾 Import Tuffbackup File
                    </button>
                    <input type="file" id="tuffbackupInput" accept=".dogegage" style="display: none;" onchange="importTuffbackup(event)">
                    
                    <p style="text-align: center; color: #888; font-size: 14px; margin-top: 20px;">
                        Tuffbackup is faster and easier than typing your seed phrase
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderImportStep2() {
    return `
        <div class="auth-page">
            <div class="auth-bg">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>
            
            <button class="auth-back" onclick="goBackToStep1()">
                ← Back
            </button>
            
            <div class="auth-container">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span>⬢</span>
                        <span>DogeGage Wallet</span>
                    </div>
                    <h2 class="auth-welcome">Secure Your Wallet</h2>
                    <p class="auth-subtitle">Step 2: Create a password</p>
                </div>
                
                <form class="auth-form" onsubmit="handleImportStep2(event)" autocomplete="on">
                    <div class="input-group">
                        <label for="import-password">Password</label>
                        <input 
                            type="password" 
                            id="import-password" 
                            name="password"
                            placeholder="Create a strong password"
                            required
                            minlength="8"
                            autocomplete="new-password"
                            autofocus
                        />
                        <span class="input-help">This password encrypts your wallet locally</span>
                    </div>
                    
                    <div class="input-group">
                        <label for="import-password-confirm">Confirm Password</label>
                        <input 
                            type="password" 
                            id="import-password-confirm" 
                            name="password-confirm"
                            placeholder="Confirm your password"
                            required
                            minlength="8"
                            autocomplete="new-password"
                        />
                    </div>
                    
                    <div id="error-message" class="error-message"></div>
                    
                    <button type="submit" class="btn-auth-primary" id="import-btn">
                        Import Wallet →
                    </button>
                </form>
            </div>
        </div>
    `;
}

// Initialize autocomplete after render
function initImportPage() {
    importStep = 1; // Reset to step 1
    const textarea = document.getElementById('seed-phrase');
    if (textarea) {
        setupAutocomplete(textarea);
    }
}

function goBackToStep1() {
    importStep = 1;
    document.getElementById('app').innerHTML = renderImport();
    initImportPage();
}

function handleImportStep1(event) {
    event.preventDefault();

    const seedPhrase = document.getElementById('seed-phrase').value.trim();
    const errorEl = document.getElementById('error-message');

    errorEl.textContent = '';

    // Validate seed phrase
    const { ethers } = window.cryptoLibs;
    try {
        ethers.utils.HDNode.fromMnemonic(seedPhrase);
    } catch (e) {
        errorEl.textContent = 'Invalid seed phrase';
        return;
    }

    // Store seed phrase and move to step 2
    importedSeedPhrase = seedPhrase;
    importStep = 2;
    document.getElementById('app').innerHTML = renderImport();
}

// BIP39 Autocomplete
function setupAutocomplete(textarea) {
    const hint = document.getElementById('autocomplete-hint');
    let currentSuggestion = '';

    // Get wordlist from ethers
    const wordlist = window.cryptoLibs.ethers.wordlists.en;

    textarea.addEventListener('input', () => {
        const value = textarea.value;
        const words = value.split(/\s+/);
        const currentWord = words[words.length - 1].toLowerCase();

        if (currentWord.length > 0) {
            const matches = [];

            // Search through all 2048 BIP39 words
            for (let i = 0; i < 2048; i++) {
                const word = wordlist.getWord(i);
                if (word.startsWith(currentWord) && word !== currentWord) {
                    matches.push(word);
                    if (matches.length >= 5) break;
                }
            }

            if (matches.length > 0) {
                currentSuggestion = matches[0];

                // Show the full text with the typed part transparent
                const textBefore = words.slice(0, -1).join(' ') + (words.length > 1 ? ' ' : '');
                hint.innerHTML = `<span style="opacity: 0;">${textBefore}${currentWord}</span>${currentSuggestion.substring(currentWord.length)}`;
                hint.style.display = 'block';
            } else {
                hint.style.display = 'none';
                currentSuggestion = '';
            }
        } else {
            hint.style.display = 'none';
            currentSuggestion = '';
        }
    });

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && currentSuggestion) {
            e.preventDefault();
            const value = textarea.value;
            const words = value.split(/\s+/);
            words[words.length - 1] = currentSuggestion;
            textarea.value = words.join(' ') + ' ';
            hint.style.display = 'none';
            currentSuggestion = '';
        }
    });
}

async function handleImportStep2(event) {
    event.preventDefault();

    const password = document.getElementById('import-password').value;
    const passwordConfirm = document.getElementById('import-password-confirm').value;
    const errorEl = document.getElementById('error-message');
    const btn = document.getElementById('import-btn');

    errorEl.textContent = '';

    // Validate passwords match
    if (password !== passwordConfirm) {
        errorEl.textContent = 'Passwords do not match';
        return;
    }

    // Validate password strength
    if (password.length < 8) {
        errorEl.textContent = 'Password must be at least 8 characters';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Importing...';

    try {
        console.log('Starting wallet import...');

        // Import wallet
        await walletService.importFromSeed(importedSeedPhrase);
        console.log('Wallet imported successfully');

        // Encrypt and save to localStorage
        console.log('Encrypting wallet with password...');
        await encryptionService.saveWallet(importedSeedPhrase, password);
        console.log('Wallet encrypted and saved to localStorage');

        // Clear the seed phrase from memory
        importedSeedPhrase = '';

        // Fetch exchange rates and balances
        console.log('Fetching exchange rates and balances...');
        await Promise.all([
            fetchExchangeRates(),
            walletService.fetchBalances()
        ]);
        console.log('All data fetched successfully');

        router.navigate('/wallet');
    } catch (error) {
        console.error('Import error:', error);
        errorEl.textContent = error.message;
        btn.disabled = false;
        btn.innerHTML = 'Import Wallet →';
    }
}


function showSeedImport() {
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <div class="auth-bg">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>
            
            <button class="auth-back" onclick="router.navigate('/import'); initImportPage();">
                ← Back
            </button>
            
            <div class="auth-container">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span>⬢</span>
                        <span>DogeGage Wallet</span>
                    </div>
                    <h2 class="auth-welcome">Import with Seed Phrase</h2>
                    <p class="auth-subtitle">Enter your 12-word seed phrase</p>
                </div>
                
                <form class="auth-form" onsubmit="handleImportStep1(event)">
                    <div class="input-group" style="position: relative;">
                        <label for="seed-phrase">Seed Phrase</label>
                        <textarea 
                            id="seed-phrase" 
                            rows="4" 
                            placeholder="word1 word2 word3 ..."
                            required
                            autofocus
                        ></textarea>
                        <div id="autocomplete-hint" class="autocomplete-hint"></div>
                        <span class="input-help">Your seed phrase never leaves your device • Press Tab to autocomplete</span>
                    </div>
                    
                    <div id="error-message" class="error-message"></div>
                    
                    <button type="submit" class="btn-auth-primary" id="import-btn">
                        Continue →
                    </button>
                </form>
            </div>
        </div>
    `;

    const textarea = document.getElementById('seed-phrase');
    if (textarea) {
        setupAutocomplete(textarea);
    }
}

async function importTuffbackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const backup = JSON.parse(text);

        // Validate backup format
        if (!backup.version || !backup.encryptedWallet) {
            alert('Invalid Tuffbackup file format');
            return;
        }

        // Store backup data and show password input page
        tuffbackupData = backup;
        showTuffbackupPasswordPage();

    } catch (error) {
        console.error('Tuffbackup file read error:', error);
        alert('Failed to read Tuffbackup file. Make sure it\'s a valid .dogegage file.');
    }
}

function showTuffbackupPasswordPage() {
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <div class="auth-bg">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>
            
            <button class="auth-back" onclick="router.navigate('/import'); tuffbackupData = null;">
                ← Back
            </button>
            
            <div class="auth-container">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span>⬢</span>
                        <span>DogeGage Wallet</span>
                    </div>
                    <h2 class="auth-welcome">Enter Password</h2>
                    <p class="auth-subtitle">Enter your wallet password to decrypt the backup</p>
                </div>
                
                <form class="auth-form" onsubmit="processTuffbackupImport(event)">
                    <div class="input-group">
                        <label for="tuffbackup-password">Wallet Password</label>
                        <input 
                            type="password" 
                            id="tuffbackup-password" 
                            placeholder="Enter your wallet password"
                            required
                            autofocus
                        />
                        <span class="input-help">This is the password you used when creating the backup</span>
                    </div>
                    
                    <button type="submit" class="btn-auth-primary">
                        Decrypt & Import Wallet
                    </button>
                    
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px; border-left: 4px solid var(--primary);">
                        <p style="color: #888; font-size: 0.875rem; margin: 0;">
                            💡 Your password never leaves your device
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function processTuffbackupImport(event) {
    event.preventDefault();

    const password = document.getElementById('tuffbackup-password').value;
    if (!password || !tuffbackupData) return;

    // Show loading page
    showImportingPage();

    try {
        // Small delay to show loading UI
        await new Promise(resolve => setTimeout(resolve, 100));

        // Try to decrypt to verify password and get seed phrase
        const seedPhrase = await encryptionService.decrypt(tuffbackupData.encryptedWallet, password);

        // Validate it's a valid seed phrase
        const { ethers } = window.cryptoLibs;
        try {
            ethers.utils.HDNode.fromMnemonic(seedPhrase);
        } catch (e) {
            alert('Invalid seed phrase in backup file');
            showTuffbackupPasswordPage();
            return;
        }

        // Save the backup to localStorage
        localStorage.setItem('encryptedWallet', tuffbackupData.encryptedWallet);

        // Import the wallet
        await walletService.importFromSeed(seedPhrase);

        // Fetch balances
        await Promise.all([
            fetchExchangeRates(),
            walletService.fetchBalances()
        ]);

        // Clear tuffbackup data
        tuffbackupData = null;

        // Navigate to wallet
        router.navigate('/wallet');

    } catch (error) {
        console.error('Tuffbackup import error:', error);
        alert('Failed to decrypt backup. Make sure the password is correct.');
        showTuffbackupPasswordPage();
    }
}

function showImportingPage() {
    document.getElementById('app').innerHTML = `
        <div class="auth-page">
            <div class="auth-bg">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>
            
            <div class="auth-container" style="text-align: center;">
                <div class="auth-logo" style="margin-bottom: 1rem;">⬢</div>
                <h1>Importing Wallet...</h1>
                <p style="color: #888; margin-bottom: 2rem;">Please wait while we restore your wallet from Tuffbackup</p>
                
                <div class="loading-spinner" style="margin: 2rem auto;"></div>
                
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px; border-left: 4px solid var(--primary); text-align: left;">
                    <p style="color: #888; font-size: 0.875rem; margin: 0;">
                        ⚡ Decrypting backup file<br>
                        🔑 Deriving wallet addresses<br>
                        💰 Fetching balances
                    </p>
                </div>
            </div>
        </div>
    `;
}

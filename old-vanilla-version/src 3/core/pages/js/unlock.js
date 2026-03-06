// Unlock Wallet Page
function renderUnlock() {
    const hasPasskey = passkeyService.isSupported() && passkeyService.hasPasskey();

    // Auto-trigger passkey prompt after render
    if (hasPasskey) {
        setTimeout(() => {
            handlePasskeyUnlock();
        }, 300);
    }

    return `
        <div class="auth-page">
            <div class="auth-bg">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>
            
            <button class="auth-back" onclick="handleForgetWallet()">
                🗑️ Forget Wallet
            </button>
            
            <div class="auth-container">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span>⬢</span>
                        <span>DogeGage Wallet</span>
                    </div>
                    <h2 class="auth-welcome">Welcome Back</h2>
                    <p class="auth-subtitle">${hasPasskey ? 'Authenticating with passkey...' : 'Enter your password to unlock'}</p>
                </div>
                
                ${hasPasskey ? `
                    <div id="passkey-section">
                        <div style="text-align: center; padding: 40px 0;">
                            <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(102, 126, 234, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                                🔐
                            </div>
                            <p style="color: #94a3b8; font-size: 16px; margin-bottom: 24px;">
                                Waiting for biometric authentication...
                            </p>
                        </div>
                        
                        <div id="error-message" class="error-message"></div>
                        
                        <button 
                            class="btn-auth-secondary" 
                            onclick="showPasswordForm()"
                            style="width: 100%; padding: 14px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s;"
                        >
                            Use password instead
                        </button>
                    </div>
                    
                    <form class="auth-form" id="password-section" onsubmit="handleUnlock(event)" autocomplete="on" style="display: none;">
                        <div class="input-group">
                            <label for="password">Password</label>
                            <input 
                                type="password" 
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                autocomplete="current-password"
                            />
                        </div>
                        
                        <button type="submit" class="btn-auth-primary" id="unlock-btn">
                            Unlock Wallet →
                        </button>
                        
                        <button 
                            type="button"
                            class="btn-text" 
                            onclick="showPasskeyForm()"
                            style="width: 100%; padding: 12px; background: transparent; color: #94a3b8; border: none; font-size: 14px; cursor: pointer; margin-top: 8px; transition: color 0.3s;"
                        >
                            ← Back to passkey
                        </button>
                    </form>
                ` : `
                    <form class="auth-form" onsubmit="handleUnlock(event)" autocomplete="on">
                        <div class="input-group">
                            <label for="password">Password</label>
                            <input 
                                type="password" 
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                autofocus
                                autocomplete="current-password"
                            />
                        </div>
                        
                        ${passkeyService.isSupported() ? `
                            <div style="margin-top: 12px;">
                                <label style="display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 14px; cursor: pointer;">
                                    <input type="checkbox" id="enable-passkey" style="cursor: pointer;" />
                                    <span>Enable passkey for faster unlock</span>
                                </label>
                            </div>
                        ` : ''}
                        
                        <div id="error-message" class="error-message"></div>
                        
                        <button type="submit" class="btn-auth-primary" id="unlock-btn">
                            Unlock Wallet →
                        </button>
                    </form>
                `}
            </div>
        </div>
    `;
}

function showPasswordForm() {
    document.getElementById('passkey-section').style.display = 'none';
    document.getElementById('password-section').style.display = 'block';
    document.getElementById('password').focus();
}

function showPasskeyForm() {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('passkey-section').style.display = 'block';
    document.getElementById('error-message').textContent = '';
    // Re-trigger passkey prompt
    setTimeout(() => {
        handlePasskeyUnlock();
    }, 100);
}

async function handlePasskeyUnlock() {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = '';
    
    try {
        // Retrieve password using passkey
        const password = await passkeyService.retrievePasswordWithPasskey();
        
        // Decrypt and load wallet
        const seedPhrase = await encryptionService.loadWallet(password);
        await walletService.importFromSeed(seedPhrase);

        // Check if there's a redirect target
        const redirectTo = sessionStorage.getItem('redirectAfterUnlock');
        if (redirectTo) {
            sessionStorage.removeItem('redirectAfterUnlock');
            router.navigate(redirectTo);
        } else {
            router.navigate('/wallet');
        }

        // Fetch exchange rates and balances in background
        fetchExchangeRates();
        walletService.fetchBalances();

    } catch (error) {
        errorEl.textContent = 'Passkey authentication failed. Please use your password.';
        console.error('Passkey unlock failed:', error);
    }
}

async function handleUnlock(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error-message');
    const btn = document.getElementById('unlock-btn');
    const enablePasskeyCheckbox = document.getElementById('enable-passkey');

    errorEl.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Unlocking...';

    try {
        // Decrypt and load wallet
        const seedPhrase = await encryptionService.loadWallet(password);
        await walletService.importFromSeed(seedPhrase);

        // Register passkey if checkbox is checked
        if (enablePasskeyCheckbox && enablePasskeyCheckbox.checked) {
            try {
                await passkeyService.register();
                await passkeyService.storePasswordForPasskey(password);
                console.log('Passkey enabled successfully');
            } catch (passkeyError) {
                console.error('Failed to enable passkey:', passkeyError);
                // Don't block unlock if passkey registration fails
            }
        }

        // Check if there's a redirect target
        const redirectTo = sessionStorage.getItem('redirectAfterUnlock');
        if (redirectTo) {
            sessionStorage.removeItem('redirectAfterUnlock');
            router.navigate(redirectTo);
        } else {
            router.navigate('/wallet');
        }

        // Fetch exchange rates and balances in background (progressive updates)
        fetchExchangeRates();
        walletService.fetchBalances();

    } catch (error) {
        errorEl.textContent = error.message === 'Invalid password or corrupted data'
            ? 'Incorrect password'
            : error.message;
        btn.disabled = false;
        btn.textContent = 'Unlock Wallet →';
    }
}

function handleForgetWallet() {
    if (confirm('Are you sure you want to forget this wallet?\n\nMake sure you have your seed phrase backed up!\n\nThis action cannot be undone.')) {
        encryptionService.clearWallet();
        localStorage.removeItem('cachedBalances');
        sessionStorage.clear();
        router.navigate('/');
    }
}

// Unlock Wallet Page
function renderUnlock() {
    // Hide tawk.to on unlock page
    hideTawkTo();
    
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
                    <p class="auth-subtitle">Enter your password to unlock</p>
                </div>
                
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
                    
                    <div id="error-message" class="error-message"></div>
                    
                    <button type="submit" class="btn-auth-primary" id="unlock-btn">
                        Unlock Wallet →
                    </button>
                </form>
            </div>
        </div>
    `;
}

async function handleUnlock(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error-message');
    const btn = document.getElementById('unlock-btn');
    
    errorEl.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Unlocking...';
    
    try {
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
        
        // Fetch exchange rates and balances in background (progressive updates)
        fetchExchangeRates();
        walletService.fetchBalances();
        
    } catch (error) {
        errorEl.textContent = error.message === 'Invalid password or corrupted data' 
            ? 'Incorrect password' 
            : error.message;
        btn.disabled = false;
        btn.innerHTML = 'Unlock Wallet →';
    }
}

function handleForgetWallet() {
    if (confirm('Are you sure you want to forget this wallet?\n\nMake sure you have your seed phrase backed up!\n\nThis action cannot be undone.')) {
        encryptionService.clearWallet();
        router.navigate('/');
    }
}

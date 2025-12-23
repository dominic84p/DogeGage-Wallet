// Exchange Status Page
let statusState = {
    exchangeId: '',
    txHash: '',
    fromCurrency: '',
    toCurrency: '',
    fromAmount: '',
    toAmount: '',
    toAddress: '',
    status: 'waiting', // waiting, confirming, exchanging, sending, finished, failed
    statusMessage: 'Waiting for deposit confirmation...',
    checkInterval: null
};

function renderExchangeStatus() {
    const wallet = walletService.getWallet();
    if (!wallet) {
        router.navigate('/');
        return '';
    }

    const steps = [
        { id: 'waiting', label: 'Waiting', icon: '⏳' },
        { id: 'confirming', label: 'Confirming', icon: '✓' },
        { id: 'exchanging', label: 'Exchanging', icon: '🔄' },
        { id: 'sending', label: 'Sending', icon: '📤' },
        { id: 'finished', label: 'Complete', icon: '✅' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === statusState.status);

    return `
        <div class="wallet-page">
            <nav class="wallet-nav">
                <div class="nav-left">
                    <div class="nav-logo">⬢ DogeGage</div>
                    <div class="nav-tabs">
                        <a href="#/wallet" class="nav-tab">WALLETS</a>
                        <a href="#/portfolio" class="nav-tab">PORTFOLIO</a>
                        <a href="#/exchange" class="nav-tab active">EXCHANGE</a>
                        <a href="#/settings" class="nav-tab">SETTINGS</a>
                    </div>
                </div>
                <div class="nav-right">
                    <button class="nav-icon-btn" onclick="router.navigate('/settings')">⚙️</button>
                </div>
            </nav>

            <div class="exchange-status-container">
                <div class="exchange-status-card">
                    <h1>Exchange in Progress</h1>
                    <p class="exchange-status-subtitle">${statusState.statusMessage}</p>

                    <div class="exchange-progress-bar">
                        ${steps.map((step, index) => `
                            <div class="progress-step ${index <= currentStepIndex ? 'active' : ''} ${index === currentStepIndex ? 'current' : ''}">
                                <div class="progress-step-icon">${step.icon}</div>
                                <div class="progress-step-label">${step.label}</div>
                            </div>
                            ${index < steps.length - 1 ? `
                                <div class="progress-line ${index < currentStepIndex ? 'active' : ''}"></div>
                            ` : ''}
                        `).join('')}
                    </div>

                    <div class="exchange-details-box">
                        <div class="exchange-detail-row">
                            <span>Exchange ID</span>
                            <span class="mono">${statusState.exchangeId}</span>
                        </div>
                        <div class="exchange-detail-row">
                            <span>Transaction</span>
                            <span class="mono">${statusState.txHash.slice(0, 16)}...${statusState.txHash.slice(-16)}</span>
                        </div>
                        <div class="exchange-detail-row">
                            <span>Sending</span>
                            <span>${statusState.fromAmount} ${statusState.fromCurrency}</span>
                        </div>
                        <div class="exchange-detail-row">
                            <span>Receiving</span>
                            <span>${statusState.toAmount} ${statusState.toCurrency}</span>
                        </div>
                        <div class="exchange-detail-row">
                            <span>To Address</span>
                            <span class="mono">${statusState.toAddress.slice(0, 12)}...${statusState.toAddress.slice(-8)}</span>
                        </div>
                    </div>

                    ${statusState.status === 'finished' ? `
                        <button class="exchange-status-btn success" onclick="router.navigate('/wallet')">
                            ✅ View Wallet
                        </button>
                    ` : statusState.status === 'failed' ? `
                        <button class="exchange-status-btn error" onclick="router.navigate('/exchange')">
                            ❌ Try Again
                        </button>
                    ` : `
                        <button class="exchange-status-btn stress" onclick="handleStress()">
                            😰 Click if stressed
                        </button>
                    `}

                    <div class="exchange-status-note">
                        Exchanges typically take 5-30 minutes. You can safely close this page.
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initExchangeStatus(exchangeData, txHash) {
    statusState = {
        exchangeId: exchangeData.id,
        txHash: txHash,
        fromCurrency: exchangeData.fromCurrency.toUpperCase(),
        toCurrency: exchangeData.toCurrency.toUpperCase(),
        fromAmount: exchangeData.fromAmount,
        toAmount: exchangeData.toAmount,
        toAddress: exchangeData.payoutAddress,
        status: 'confirming',
        statusMessage: 'Confirming your transaction on the blockchain...',
        checkInterval: null
    };

    // Start checking exchange status
    checkExchangeStatus();
    statusState.checkInterval = setInterval(checkExchangeStatus, 10000); // Check every 10 seconds
}

async function checkExchangeStatus() {
    try {
        const status = await changeNowService.getExchangeStatus(statusState.exchangeId);
        
        if (!status) return;

        // Update status based on ChangeNow response
        if (status.status === 'waiting') {
            statusState.status = 'waiting';
            statusState.statusMessage = 'Waiting for deposit confirmation...';
        } else if (status.status === 'confirming') {
            statusState.status = 'confirming';
            statusState.statusMessage = 'Confirming your transaction...';
        } else if (status.status === 'exchanging') {
            statusState.status = 'exchanging';
            statusState.statusMessage = 'Exchanging your crypto...';
        } else if (status.status === 'sending') {
            statusState.status = 'sending';
            statusState.statusMessage = `Sending ${statusState.toCurrency} to your wallet...`;
        } else if (status.status === 'finished') {
            statusState.status = 'finished';
            statusState.statusMessage = '🎉 Exchange complete!';
            clearInterval(statusState.checkInterval);
            
            // Refresh wallet balance
            await walletService.fetchBalances();
        } else if (status.status === 'failed' || status.status === 'refunded') {
            statusState.status = 'failed';
            statusState.statusMessage = 'Exchange failed. Please try again.';
            clearInterval(statusState.checkInterval);
        }

        document.getElementById('app').innerHTML = renderExchangeStatus();
        
    } catch (error) {
        console.error('Failed to check exchange status:', error);
    }
}

function handleStress() {
    const messages = [
        "It's okay! Crypto exchanges take time ⏰",
        "Your funds are safe with ChangeNow 🔒",
        "Deep breaths... it'll be done soon 🧘",
        "Go grab a coffee, you deserve it ☕",
        "Blockchain confirmations are slow but secure 🛡️",
        "Trust the process! 💪",
        "Your crypto is on its way! 🚀",
        "Patience is a virtue... and profitable 💰"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create modal with cat image
    const modal = document.createElement('div');
    modal.className = 'cat-modal-overlay';
    modal.onclick = () => modal.remove();
    
    modal.innerHTML = `
        <div class="cat-modal-content" onclick="event.stopPropagation()">
            <button class="cat-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <h2>Take a deep breath 🐱</h2>
            <p>${randomMessage}</p>
            <img src="https://cataas.com/cat?${Date.now()}" alt="Calming cat" class="cat-image" />
            <button class="cat-modal-btn" onclick="this.parentElement.parentElement.remove()">I feel better now</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}


// Console command to test exchange status screen
window.testExchangeStatus = function(status = 'confirming') {
    const fakeExchange = {
        id: 'test' + Math.random().toString(36).substr(2, 9),
        fromCurrency: 'btc',
        toCurrency: 'eth',
        fromAmount: '0.001',
        toAmount: '0.025',
        payoutAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    };
    
    const fakeTxHash = '5XjpL3DuWKo13vxEqoFEqCoLgpHqEfDm1qfzyn4qvStQHTydcWohUY7SLjJ4T9KqARUHpyD9KyShnsmZxxVMZK7j';
    
    initExchangeStatus(fakeExchange, fakeTxHash);
    
    // Override status if specified
    if (status) {
        statusState.status = status;
        
        const statusMessages = {
            'waiting': 'Waiting for deposit confirmation...',
            'confirming': 'Confirming your transaction on the blockchain...',
            'exchanging': 'Exchanging your crypto...',
            'sending': 'Sending ETH to your wallet...',
            'finished': '🎉 Exchange complete!',
            'failed': 'Exchange failed. Please try again.'
        };
        
        statusState.statusMessage = statusMessages[status] || statusState.statusMessage;
    }
    
    // Stop the interval checking
    if (statusState.checkInterval) {
        clearInterval(statusState.checkInterval);
        statusState.checkInterval = null;
    }
    
    router.navigate('/exchange-status');
    
    console.log('✅ Test exchange status loaded!');
    console.log('Available statuses: waiting, confirming, exchanging, sending, finished, failed');
    console.log('Usage: testExchangeStatus("exchanging")');
};

console.log('💡 Test command available: testExchangeStatus("status")');
console.log('   Example: testExchangeStatus("exchanging")');

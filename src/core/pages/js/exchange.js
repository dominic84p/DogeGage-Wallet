/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Exchange Page

// Minimum exchange amounts (hardcoded to avoid API calls)
const MIN_AMOUNTS = {
    'BTC': { 'ETH': 0, 'SOL': 0, 'XTZ': 0, 'TRX': 0, 'DOGE': 0, 'LTC': 0, 'POL': 0 },
    'DOGE': { 'BTC': 100, 'ETH': 100, 'SOL': 100, 'XTZ': 100, 'TRX': 100, 'LTC': 100, 'POL': 100 },
    'LTC': { 'BTC': 0.01, 'ETH': 0.01, 'SOL': 0.01, 'XTZ': 0.01, 'TRX': 0.01, 'DOGE': 0.01, 'POL': 0.01 },
    'ETH': { 'BTC': 0.01, 'SOL': 0.01, 'XTZ': 0.01, 'TRX': 0.01, 'DOGE': 0.01, 'LTC': 0.01, 'POL': 0.01 },
    'POL': { 'BTC': 1, 'ETH': 1, 'SOL': 1, 'XTZ': 1, 'TRX': 1, 'DOGE': 1, 'LTC': 1 },
    'SOL': { 'BTC': 0.000525, 'ETH': 0.000525, 'XTZ': 0.000525, 'TRX': 0.000525, 'DOGE': 0.000525, 'LTC': 0.000525, 'POL': 0.000525 },
    'XTZ': { 'BTC': 1, 'ETH': 1, 'SOL': 1, 'TRX': 1, 'DOGE': 1, 'LTC': 1, 'POL': 1 },
    'TRX': { 'BTC': 10, 'ETH': 10, 'SOL': 10, 'XTZ': 10, 'DOGE': 10, 'LTC': 10, 'POL': 10 }
};

function getMinAmount(from, to) {
    return MIN_AMOUNTS[from]?.[to] || 0;
}

let exchangeState = {
    fromCurrency: 'BTC',
    toCurrency: 'ETH',
    fromAmount: '',
    toAmount: '',
    minAmount: getMinAmount('BTC', 'ETH'),
    estimating: false,
    customAddress: false,
    recipientAddress: '',
    countdown: 0,
    countdownInterval: null,
    error: ''
};

function renderExchange() {
    // Hide tawk.to on exchange page
    hideTawkTo();
    
    const wallet = walletService.getWallet();
    if (!wallet) {
        router.navigate('/');
        return '';
    }

    const currencies = [
        { symbol: 'BTC', name: 'Bitcoin', balance: wallet.bitcoin.balance, address: wallet.bitcoin.address },
        { symbol: 'DOGE', name: 'Dogecoin', balance: wallet.dogecoin.balance, address: wallet.dogecoin.address },
        { symbol: 'LTC', name: 'Litecoin', balance: wallet.litecoin.balance, address: wallet.litecoin.address },
        { symbol: 'ETH', name: 'Ethereum', balance: wallet.ethereum.balance, address: wallet.ethereum.address },
        { symbol: 'POL', name: 'Polygon', balance: wallet.polygon.balance, address: wallet.polygon.address },
        { symbol: 'SOL', name: 'Solana', balance: wallet.solana.balance, address: wallet.solana.address },
        { symbol: 'XTZ', name: 'Tezos', balance: wallet.tezos.balance, address: wallet.tezos.address },
        { symbol: 'TRX', name: 'Tron', balance: wallet.tron.balance, address: wallet.tron.address }
    ];

    const fromCrypto = currencies.find(c => c.symbol === exchangeState.fromCurrency);
    const toCrypto = currencies.find(c => c.symbol === exchangeState.toCurrency);

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
                    <select class="currency-selector" onchange="changeCurrency(this.value)" value="${selectedCurrency}">
                        <option value="usd" ${selectedCurrency === 'usd' ? 'selected' : ''}>USD</option>
                        <option value="eur" ${selectedCurrency === 'eur' ? 'selected' : ''}>EUR</option>
                        <option value="gbp" ${selectedCurrency === 'gbp' ? 'selected' : ''}>GBP</option>
                        <option value="jpy" ${selectedCurrency === 'jpy' ? 'selected' : ''}>JPY</option>
                        <option value="cad" ${selectedCurrency === 'cad' ? 'selected' : ''}>CAD</option>
                        <option value="aud" ${selectedCurrency === 'aud' ? 'selected' : ''}>AUD</option>
                        <option value="chf" ${selectedCurrency === 'chf' ? 'selected' : ''}>CHF</option>
                        <option value="cny" ${selectedCurrency === 'cny' ? 'selected' : ''}>CNY</option>
                        <option value="inr" ${selectedCurrency === 'inr' ? 'selected' : ''}>INR</option>
                        <option value="krw" ${selectedCurrency === 'krw' ? 'selected' : ''}>KRW</option>
                    </select>
                    <button class="nav-icon-btn" onclick="router.navigate('/settings')">⚙️</button>
                </div>
            </nav>

            <div class="exchange-fullscreen">
                <div class="exchange-main">
                    <div class="exchange-section">
                        <div class="exchange-section-header">
                            <h3>I have</h3>
                            <span class="exchange-balance-text">Balance: ${fromCrypto.balance} ${exchangeState.fromCurrency}</span>
                        </div>
                        <div class="exchange-input-box">
                            <input 
                                type="text" 
                                inputmode="decimal"
                                class="exchange-input ${exchangeState.error ? 'error' : ''}" 
                                placeholder="0.00"
                                value="${exchangeState.fromAmount}"
                                oninput="updateFromAmount(this.value)"
                            />
                            <select class="exchange-select" onchange="updateFromCurrency(this.value)">
                                ${currencies.map(c => `
                                    <option value="${c.symbol}" ${exchangeState.fromCurrency === c.symbol ? 'selected' : ''}>
                                        ${c.symbol} - ${c.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        ${exchangeState.error ? `
                            <div class="exchange-error">${exchangeState.error}</div>
                        ` : ''}
                        ${exchangeState.minAmount > 0 && !exchangeState.error ? `
                            <div class="exchange-hint">Minimum: ${exchangeState.minAmount} ${exchangeState.fromCurrency}</div>
                        ` : ''}
                    </div>

                    <div class="exchange-arrow">
                        <button class="exchange-swap" onclick="swapCurrencies()">⇅</button>
                    </div>

                    <div class="exchange-section">
                        <div class="exchange-section-header">
                            <h3>I want</h3>
                            <div class="exchange-to-address">
                                ${exchangeState.customAddress ? 
                                    `<span class="to-label">To:</span> <span class="to-value">${exchangeState.recipientAddress ? exchangeState.recipientAddress.slice(0, 12) + '...' + exchangeState.recipientAddress.slice(-8) : 'Enter address'}</span>` :
                                    `<span class="to-label">To:</span> <span class="to-value">My Wallet</span>`
                                }
                            </div>
                        </div>
                        <div class="exchange-input-box">
                            <input 
                                type="text" 
                                class="exchange-input" 
                                placeholder="0.00"
                                value="${exchangeState.toAmount}"
                                readonly
                            />
                            <select class="exchange-select" onchange="updateToCurrency(this.value)">
                                ${currencies.map(c => `
                                    <option value="${c.symbol}" ${exchangeState.toCurrency === c.symbol ? 'selected' : ''}>
                                        ${c.symbol} - ${c.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="exchange-address-toggle">
                            <label class="exchange-checkbox">
                                <input type="checkbox" ${exchangeState.customAddress ? 'checked' : ''} onchange="toggleCustomAddress(this.checked)">
                                <span>Send to different wallet</span>
                            </label>
                        </div>
                        
                        ${exchangeState.customAddress ? `
                            <div class="exchange-custom-address">
                                <input 
                                    type="text" 
                                    class="exchange-address-input" 
                                    placeholder="Enter ${exchangeState.toCurrency} address"
                                    value="${exchangeState.recipientAddress}"
                                    oninput="updateRecipientAddress(this.value)"
                                />
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="exchange-sidebar">
                    <div class="exchange-info-card">
                        <h4>Exchange Details</h4>
                        
                        ${exchangeState.toAmount ? `
                            <div class="exchange-info-grid">
                                <div class="exchange-info-item">
                                    <span class="label">Rate</span>
                                    <span class="value">1 ${exchangeState.fromCurrency} ≈ ${(parseFloat(exchangeState.toAmount) / parseFloat(exchangeState.fromAmount)).toFixed(6)} ${exchangeState.toCurrency}</span>
                                </div>
                                <div class="exchange-info-item">
                                    <span class="label">You Send</span>
                                    <span class="value">${exchangeState.fromAmount} ${exchangeState.fromCurrency}</span>
                                </div>
                                <div class="exchange-info-item">
                                    <span class="label">You Receive</span>
                                    <span class="value">${exchangeState.toAmount} ${exchangeState.toCurrency}</span>
                                </div>
                                <div class="exchange-info-item">
                                    <span class="label">Network Fee</span>
                                    <span class="value">Included</span>
                                </div>
                                <div class="exchange-info-item">
                                    <span class="label">Est. Time</span>
                                    <span class="value">5-30 min</span>
                                </div>
                            </div>
                        ` : `
                            <div class="exchange-info-empty">
                                Enter an amount to see exchange details
                            </div>
                        `}
                        
                        <button 
                            class="exchange-btn" 
                            onclick="initiateExchange()" 
                            ${!canExchange() ? 'disabled' : ''}
                        >
                            ${exchangeState.countdown > 0 ? 
                                `Cancel (${exchangeState.countdown}s)` : 
                                (exchangeState.fromAmount ? 'Exchange Now' : 'Enter Amount')
                            }
                        </button>
                        
                        <div class="exchange-powered-by">
                            Powered by ChangeNow
                        </div>
                    </div>
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
                <a href="#/exchange" class="mobile-nav-btn active">
                    <span>🔄</span>
                    <span>Exchange</span>
                </a>
                <a href="#/settings" class="mobile-nav-btn">
                    <span>⚙️</span>
                    <span>Settings</span>
                </a>
            </nav>
        </div>
    `;
}

let estimateTimeout = null;

async function updateFromAmount(amount) {
    // Allow decimals
    if (amount && !/^\d*\.?\d*$/.test(amount)) {
        return; // Invalid input, ignore
    }
    
    exchangeState.fromAmount = amount;
    exchangeState.error = '';
    
    // Clear previous timeout
    if (estimateTimeout) {
        clearTimeout(estimateTimeout);
    }
    
    // Check minimum amount
    if (amount && parseFloat(amount) > 0) {
        const minAmount = getMinAmount(exchangeState.fromCurrency, exchangeState.toCurrency);
        
        if (parseFloat(amount) < minAmount) {
            exchangeState.error = `Minimum amount is ${minAmount} ${exchangeState.fromCurrency}`;
            exchangeState.toAmount = '';
            updateExchangeUI();
            return;
        }
        
        // Debounce the API call - wait 500ms after user stops typing
        estimateTimeout = setTimeout(async () => {
            exchangeState.estimating = true;
            updateExchangeUI();
            
            // Get estimate from ChangeNow
            const fromCode = changeNowService.getCurrencyCode(exchangeState.fromCurrency);
            const toCode = changeNowService.getCurrencyCode(exchangeState.toCurrency);
            
            const estimate = await changeNowService.getEstimate(fromCode, toCode, amount);
            
            if (estimate && estimate.toAmount) {
                exchangeState.toAmount = estimate.toAmount;
            } else {
                exchangeState.toAmount = '';
            }
            exchangeState.estimating = false;
            updateExchangeUI();
        }, 500);
    } else {
        exchangeState.toAmount = '';
        updateExchangeUI();
    }
}

// Update only the dynamic parts without re-rendering the whole page
function updateExchangeUI() {
    // Update error message
    const errorEl = document.querySelector('.exchange-error');
    const hintEl = document.querySelector('.exchange-hint');
    const inputEl = document.querySelector('.exchange-input');
    
    if (exchangeState.error) {
        if (inputEl) inputEl.classList.add('error');
        if (!errorEl) {
            const inputBox = document.querySelector('.exchange-input-box');
            if (inputBox) {
                const errDiv = document.createElement('div');
                errDiv.className = 'exchange-error';
                errDiv.textContent = exchangeState.error;
                inputBox.parentElement.insertBefore(errDiv, inputBox.nextSibling);
            }
        } else {
            errorEl.textContent = exchangeState.error;
        }
        if (hintEl) hintEl.style.display = 'none';
    } else {
        if (inputEl) inputEl.classList.remove('error');
        if (errorEl) errorEl.remove();
    }
    
    // Update "to" amount
    const toInput = document.querySelectorAll('.exchange-input')[1];
    if (toInput) {
        toInput.value = exchangeState.toAmount;
    }
    
    // Update exchange details sidebar
    const infoCard = document.querySelector('.exchange-info-card');
    if (infoCard && exchangeState.toAmount && exchangeState.fromAmount) {
        const rate = (parseFloat(exchangeState.toAmount) / parseFloat(exchangeState.fromAmount)).toFixed(6);
        infoCard.innerHTML = `
            <h4>Exchange Details</h4>
            <div class="exchange-info-grid">
                <div class="exchange-info-item">
                    <span class="label">Rate</span>
                    <span class="value">1 ${exchangeState.fromCurrency} ≈ ${rate} ${exchangeState.toCurrency}</span>
                </div>
                <div class="exchange-info-item">
                    <span class="label">You Send</span>
                    <span class="value">${exchangeState.fromAmount} ${exchangeState.fromCurrency}</span>
                </div>
                <div class="exchange-info-item">
                    <span class="label">You Receive</span>
                    <span class="value">${exchangeState.toAmount} ${exchangeState.toCurrency}</span>
                </div>
                <div class="exchange-info-item">
                    <span class="label">Network Fee</span>
                    <span class="value">Included</span>
                </div>
                <div class="exchange-info-item">
                    <span class="label">Est. Time</span>
                    <span class="value">5-30 min</span>
                </div>
            </div>
            <button 
                class="exchange-btn" 
                onclick="initiateExchange()" 
                ${!canExchange() ? 'disabled' : ''}
            >
                ${exchangeState.countdown > 0 ? 
                    `Cancel (${exchangeState.countdown}s)` : 
                    (exchangeState.fromAmount ? 'Exchange Now' : 'Enter Amount')
                }
            </button>
            <div class="exchange-powered-by">
                Powered by ChangeNow
            </div>
        `;
    } else if (infoCard && !exchangeState.toAmount) {
        infoCard.innerHTML = `
            <h4>Exchange Details</h4>
            <div class="exchange-info-empty">
                Enter an amount to see exchange details
            </div>
            <button 
                class="exchange-btn" 
                onclick="initiateExchange()" 
                disabled
            >
                Enter Amount
            </button>
            <div class="exchange-powered-by">
                Powered by ChangeNow
            </div>
        `;
    }
}

async function updateFromCurrency(currency) {
    exchangeState.fromCurrency = currency;
    exchangeState.minAmount = getMinAmount(currency, exchangeState.toCurrency);
    exchangeState.error = '';
    
    document.getElementById('app').innerHTML = renderExchange();
    
    if (exchangeState.fromAmount) {
        updateFromAmount(exchangeState.fromAmount);
    }
}

async function updateToCurrency(currency) {
    exchangeState.toCurrency = currency;
    exchangeState.minAmount = getMinAmount(exchangeState.fromCurrency, currency);
    exchangeState.error = '';
    
    document.getElementById('app').innerHTML = renderExchange();
    
    if (exchangeState.fromAmount) {
        updateFromAmount(exchangeState.fromAmount);
    }
}

function swapCurrencies() {
    const temp = exchangeState.fromCurrency;
    exchangeState.fromCurrency = exchangeState.toCurrency;
    exchangeState.toCurrency = temp;
    exchangeState.fromAmount = '';
    exchangeState.toAmount = '';
    document.getElementById('app').innerHTML = renderExchange();
}

function toggleCustomAddress(checked) {
    exchangeState.customAddress = checked;
    if (!checked) {
        exchangeState.recipientAddress = '';
    }
    document.getElementById('app').innerHTML = renderExchange();
    
    // Re-trigger estimate if amount exists
    if (exchangeState.fromAmount) {
        updateFromAmount(exchangeState.fromAmount);
    }
}

function updateRecipientAddress(address) {
    exchangeState.recipientAddress = address;
    // Re-render to update the "To:" display
    document.getElementById('app').innerHTML = renderExchange();
}

function canExchange() {
    if (!exchangeState.fromAmount || exchangeState.estimating || exchangeState.error) return false;
    
    // Check minimum amount
    const minAmount = getMinAmount(exchangeState.fromCurrency, exchangeState.toCurrency);
    if (parseFloat(exchangeState.fromAmount) < minAmount) return false;
    
    // Check if custom address is valid
    if (exchangeState.customAddress) {
        if (!exchangeState.recipientAddress) return false;
        if (!isValidAddress(exchangeState.recipientAddress, exchangeState.toCurrency)) return false;
    }
    
    // Check if user has enough balance
    const wallet = walletService.getWallet();
    if (!wallet) return false;
    
    const fromCrypto = {
        'BTC': wallet.bitcoin,
        'DOGE': wallet.dogecoin,
        'LTC': wallet.litecoin,
        'ETH': wallet.ethereum,
        'POL': wallet.polygon,
        'SOL': wallet.solana,
        'XTZ': wallet.tezos,
        'TRX': wallet.tron
    }[exchangeState.fromCurrency];
    
    const userBalance = parseFloat(fromCrypto.balance);
    const sendAmount = parseFloat(exchangeState.fromAmount);
    
    if (sendAmount > userBalance) return false;
    
    return true;
}

async function initiateExchange() {
    // If countdown is active, cancel it
    if (exchangeState.countdown > 0) {
        clearInterval(exchangeState.countdownInterval);
        exchangeState.countdown = 0;
        document.getElementById('app').innerHTML = renderExchange();
        return;
    }
    
    // Start 5 second countdown
    exchangeState.countdown = 5;
    document.getElementById('app').innerHTML = renderExchange();
    
    exchangeState.countdownInterval = setInterval(() => {
        exchangeState.countdown--;
        
        if (exchangeState.countdown <= 0) {
            clearInterval(exchangeState.countdownInterval);
            executeExchange();
        } else {
            document.getElementById('app').innerHTML = renderExchange();
        }
    }, 1000);
}

async function executeExchange() {
    const wallet = walletService.getWallet();
    if (!wallet) return;
    
    // Check if user has enough balance
    const fromCrypto = {
        'BTC': wallet.bitcoin,
        'DOGE': wallet.dogecoin,
        'LTC': wallet.litecoin,
        'ETH': wallet.ethereum,
        'POL': wallet.polygon,
        'SOL': wallet.solana,
        'XTZ': wallet.tezos,
        'TRX': wallet.tron
    }[exchangeState.fromCurrency];
    
    const userBalance = parseFloat(fromCrypto.balance);
    const sendAmount = parseFloat(exchangeState.fromAmount);
    
    if (sendAmount > userBalance) {
        alert(`Insufficient balance. You have ${userBalance} ${exchangeState.fromCurrency} but trying to send ${sendAmount} ${exchangeState.fromCurrency}`);
        return;
    }
    
    // Get recipient address
    let toAddress;
    if (exchangeState.customAddress) {
        toAddress = exchangeState.recipientAddress;
        if (!toAddress) {
            alert('Please enter a recipient address');
            return;
        }
        
        // Validate address format
        if (!isValidAddress(toAddress, exchangeState.toCurrency)) {
            alert(`Invalid ${exchangeState.toCurrency} address format`);
            return;
        }
    } else {
        toAddress = getWalletAddress(exchangeState.toCurrency);
    }
    
    const refundAddress = getWalletAddress(exchangeState.fromCurrency);
    
    if (!toAddress || !refundAddress) {
        alert('Could not get wallet addresses');
        return;
    }
    
    // Create exchange
    const fromCode = changeNowService.getCurrencyCode(exchangeState.fromCurrency);
    const toCode = changeNowService.getCurrencyCode(exchangeState.toCurrency);
    
    console.log('Creating exchange:', {
        from: fromCode,
        to: toCode,
        amount: exchangeState.fromAmount,
        toAddress,
        refundAddress
    });
    
    const exchange = await changeNowService.createExchange(
        fromCode,
        toCode,
        exchangeState.fromAmount,
        toAddress,
        refundAddress
    );
    
    console.log('Exchange response:', exchange);
    
    if (exchange && exchange.id) {
        // Auto-send the crypto to ChangeNow
        await autoSendToExchange(exchange);
    } else if (exchange && exchange.error) {
        alert(`Exchange failed: ${exchange.error}`);
    } else {
        alert('Failed to create exchange. Please try again.');
    }
}

async function autoSendToExchange(exchange) {
    try {
        const fromCurrency = exchangeState.fromCurrency;
        const amount = exchangeState.fromAmount; // Use user's input, not API response
        const toAddress = exchange.payinAddress;
        
        // Validate the exchange response matches user's intent
        if (parseFloat(exchange.fromAmount) !== parseFloat(amount)) {
            throw new Error('Exchange amount mismatch. Please try again.');
        }
        
        // Validate payin address format
        if (!isValidAddress(toAddress, fromCurrency)) {
            throw new Error('Invalid payin address from exchange service');
        }
        
        // Send based on currency type
        let txHash;
        
        if (fromCurrency === 'BTC') {
            txHash = await sendBitcoin(toAddress, amount);
        } else if (fromCurrency === 'DOGE') {
            txHash = await sendDogecoin(toAddress, amount);
        } else if (fromCurrency === 'LTC') {
            txHash = await sendLitecoin(toAddress, amount);
        } else if (fromCurrency === 'ETH') {
            txHash = await sendEthereum(toAddress, amount);
        } else if (fromCurrency === 'POL') {
            txHash = await sendPolygon(toAddress, amount);
        } else if (fromCurrency === 'SOL') {
            txHash = await sendSolana(toAddress, amount);
        } else if (fromCurrency === 'XTZ') {
            txHash = await sendTezos(toAddress, amount);
        } else if (fromCurrency === 'TRX') {
            txHash = await sendTron(toAddress, amount);
        }
        
        if (txHash) {
            // Initialize status page with exchange data
            initExchangeStatus(exchange, txHash);
            
            // Navigate to status page
            router.navigate('/exchange-status');
        } else {
            alert('Failed to send transaction. Exchange created but not funded.');
        }
        
    } catch (error) {
        console.error('Auto-send failed:', error);
        
        let errorMsg = error.message;
        if (errorMsg.includes('No UTXOs available')) {
            errorMsg = `Your ${exchangeState.fromCurrency.toUpperCase()} wallet is empty or has no confirmed transactions. Please add funds first.`;
        } else if (errorMsg.includes('Insufficient balance')) {
            errorMsg = `Insufficient ${exchangeState.fromCurrency.toUpperCase()} balance.`;
        }
        
        alert(`Failed to send: ${errorMsg}\n\nExchange created but not funded. You can manually send ${exchangeState.fromAmount} ${exchangeState.fromCurrency.toUpperCase()} to:\n${exchange.payinAddress}`);
    }
}

function isValidAddress(address, currency) {
    // Basic validation for each crypto
    const validators = {
        'BTC': /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
        'DOGE': /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/,
        'LTC': /^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-z0-9]{39,59}$/,
        'ETH': /^0x[a-fA-F0-9]{40}$/,
        'POL': /^0x[a-fA-F0-9]{40}$/,
        'SOL': /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
        'XTZ': /^tz[1-3][1-9A-HJ-NP-Za-km-z]{33}$/,
        'TRX': /^T[A-Za-z1-9]{33}$/
    };
    
    const regex = validators[currency];
    return regex ? regex.test(address) : true; // If no validator, allow it
}

function getWalletAddress(currency) {
    const wallet = walletService.getWallet();
    const mapping = {
        'BTC': wallet.bitcoin.address,
        'DOGE': wallet.dogecoin.address,
        'LTC': wallet.litecoin.address,
        'ETH': wallet.ethereum.address,
        'POL': wallet.polygon.address,
        'SOL': wallet.solana.address,
        'XTZ': wallet.tezos.address,
        'TRX': wallet.tron.address
    };
    return mapping[currency];
}

function showExchangeDetails(exchange) {
    alert(`Exchange created!\n\nSend ${exchange.fromAmount} ${exchange.fromCurrency.toUpperCase()} to:\n${exchange.payinAddress}\n\nExchange ID: ${exchange.id}`);
}

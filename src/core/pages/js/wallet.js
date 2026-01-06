/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Wallet Page
let selectedAsset = 'bitcoin';
let expandedChains = { bitcoin: true, ethereum: true, tezos: true, tron: true, solana: true };
let selectedCurrency = localStorage.getItem('selectedCurrency') || 'usd';
let showingSend = false; // Track if we're showing send form
let sendStage = 'form'; // 'form', 'confirm', 'sending', 'success'
let pendingTransaction = null; // Store transaction details

// Currency conversion rates (fetched from API)
let exchangeRates = {
    'usd': 1,
    'eur': 0.92,
    'gbp': 0.79,
    'jpy': 149.50,
    'cad': 1.36,
    'aud': 1.52,
    'chf': 0.88,
    'cny': 7.24,
    'inr': 83.12,
    'krw': 1320.50
};

// Currency symbols (clean, no prefix)
const currencySymbols = {
    'usd': '$',
    'eur': '€',
    'gbp': '£',
    'jpy': '¥',
    'cad': '$',
    'aud': '$',
    'chf': 'Fr',
    'cny': '¥',
    'inr': '₹',
    'krw': '₩'
};

// Fetch real exchange rates
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/rates');
        const data = await response.json();
        
        if (data && data.rates) {
            exchangeRates = {
                'usd': 1,
                'eur': data.rates.EUR,
                'gbp': data.rates.GBP,
                'jpy': data.rates.JPY,
                'cad': data.rates.CAD,
                'aud': data.rates.AUD,
                'chf': data.rates.CHF,
                'cny': data.rates.CNY,
                'inr': data.rates.INR,
                'krw': data.rates.KRW
            };
            console.log('Exchange rates updated:', exchangeRates);
        }
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Keep using default rates if fetch fails
    }
}

// Convert USD to selected currency
function convertCurrency(usdAmount) {
    const rate = exchangeRates[selectedCurrency];
    const converted = parseFloat(usdAmount) * rate;
    
    // Format based on currency (no decimals for JPY, KRW)
    if (selectedCurrency === 'jpy' || selectedCurrency === 'krw') {
        return Math.round(converted).toLocaleString();
    }
    return converted.toFixed(2);
}

function renderWallet() {
    // Hide tawk.to on wallet page
    hideTawkTo();
    
    const wallet = walletService.getWallet();
    if (!wallet) {
        router.navigate('/');
        return '';
    }
    
    const totalBalance = walletService.getTotalBalance();
    const totalBalanceConverted = convertCurrency(totalBalance);
    const isLoading = walletService.isBalancesLoading();
    
    // Get selected asset data
    let asset, assetName, assetSymbol, chainName;
    if (selectedAsset === 'bitcoin') {
        asset = wallet.bitcoin;
        assetName = 'Bitcoin';
        assetSymbol = 'BTC';
        chainName = 'Bitcoin';
    } else if (selectedAsset === 'dogecoin') {
        asset = wallet.dogecoin;
        assetName = 'Dogecoin';
        assetSymbol = 'DOGE';
        chainName = 'Bitcoin';
    } else if (selectedAsset === 'litecoin') {
        asset = wallet.litecoin;
        assetName = 'Litecoin';
        assetSymbol = 'LTC';
        chainName = 'Bitcoin';
    } else if (selectedAsset === 'ethereum') {
        asset = wallet.ethereum;
        assetName = 'Ethereum';
        assetSymbol = 'ETH';
        chainName = 'Ethereum';
    } else if (selectedAsset === 'polygon') {
        asset = wallet.polygon;
        assetName = 'Polygon';
        assetSymbol = 'POL';
        chainName = 'Polygon';
    } else if (selectedAsset === 'dgage') {
        asset = wallet.dgage;
        assetName = 'DogeGage Token';
        assetSymbol = 'DGAGE';
        chainName = 'Polygon';
    } else if (selectedAsset === 'tezos') {
        asset = wallet.tezos;
        assetName = 'Tezos';
        assetSymbol = 'XTZ';
        chainName = 'Tezos';
    } else if (selectedAsset === 'tron') {
        asset = wallet.tron;
        assetName = 'Tron';
        assetSymbol = 'TRX';
        chainName = 'Tron';
    } else if (selectedAsset === 'solana') {
        asset = wallet.solana;
        assetName = 'Solana';
        assetSymbol = 'SOL';
        chainName = 'Solana';
    }
    
    return `
        <div class="wallet-page">
            <nav class="wallet-nav">
                <div class="nav-left">
                    <div class="nav-logo">⬢ DogeGage</div>
                    <div class="nav-tabs">
                        <a href="#/wallet" class="nav-tab active">WALLETS</a>
                        <a href="#/portfolio" class="nav-tab">PORTFOLIO</a>
                        <a href="#/exchange" class="nav-tab">EXCHANGE</a>
                        <a href="#/settings" class="nav-tab">SETTINGS</a>
                    </div>
                </div>
                <div class="nav-right">
                    <select class="currency-selector" onchange="changeCurrency(this.value)">
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
                    <button class="nav-icon-btn" onclick="refreshBalances()">↻</button>
                    <button class="nav-icon-btn" onclick="handleLock()">🔒</button>
                </div>
            </nav>
            
            <div class="wallet-layout ${selectedAsset ? 'crypto-selected' : ''}">
                <aside class="wallet-sidebar">
                    <div class="sidebar-header">
                        <div class="total-balance">${isLoading ? '...' : `${currencySymbols[selectedCurrency]}${totalBalanceConverted}`} <span>${selectedCurrency.toUpperCase()}</span></div>
                        <div class="wallet-stats">5 chains${isLoading ? ' • Loading...' : ''}</div>
                    </div>
                    <div class="wallet-list">
                        ${renderChainGroup('Bitcoin', 'bitcoin', '#f7931a', [
                            { name: 'Bitcoin', symbol: 'BTC', asset: wallet.bitcoin, key: 'bitcoin' },
                            { name: 'Dogecoin', symbol: 'DOGE', asset: wallet.dogecoin, key: 'dogecoin' },
                            { name: 'Litecoin', symbol: 'LTC', asset: wallet.litecoin, key: 'litecoin' }
                        ])}
                        ${renderChainGroup('Ethereum', 'ethereum', '#627eea', [
                            { name: 'Ethereum', symbol: 'ETH', asset: wallet.ethereum, key: 'ethereum' },
                            ...(wallet.polygon ? [{ name: 'Polygon', symbol: 'POL', asset: wallet.polygon, key: 'polygon' }] : []),
                            ...(wallet.dgage ? [{ name: 'DogeGage Token', symbol: 'DGAGE', asset: wallet.dgage, key: 'dgage' }] : []),
                            ...(wallet.detectedTokens && wallet.detectedTokens.ethereum ? wallet.detectedTokens.ethereum.map(token => ({
                                name: token.name,
                                symbol: token.symbol,
                                asset: token,
                                key: `eth-token-${token.contractAddress}`
                            })) : [])
                        ])}
                        ${wallet.detectedTokens && wallet.detectedTokens.polygon && wallet.detectedTokens.polygon.length > 0 ? renderChainGroup('Polygon Tokens', 'polygon-tokens', '#8247e5', 
                            wallet.detectedTokens.polygon.map(token => ({
                                name: token.name,
                                symbol: token.symbol,
                                asset: token,
                                key: `poly-token-${token.contractAddress}`
                            }))
                        ) : ''}
                        ${renderChainGroup('Tezos', 'tezos', '#2c7df7', [
                            { name: 'Tezos', symbol: 'XTZ', asset: wallet.tezos, key: 'tezos' }
                        ])}
                        ${renderChainGroup('Tron', 'tron', '#ef0027', [
                            { name: 'Tron', symbol: 'TRX', asset: wallet.tron, key: 'tron' }
                        ])}
                        ${renderChainGroup('Solana', 'solana', '#14f195', [
                            { name: 'Solana', symbol: 'SOL', asset: wallet.solana, key: 'solana' }
                        ])}
                    </div>
                </aside>
                
                ${selectedAsset ? `
                    <main class="wallet-content">
                        <!-- Mobile Back Button -->
                        <button class="mobile-back-btn" onclick="clearSelectedAsset()">
                            ← Back to Wallet List
                        </button>
                        
                        <div class="asset-header">
                            <h2>${assetName}${selectedAsset === 'tezos' ? ' <span style="background: #ff6b6b; color: white; font-size: 12px; padding: 3px 8px; border-radius: 4px; margin-left: 8px; font-weight: bold;">⚠️ UNTESTED</span>' : ''}</h2>
                            <div class="asset-actions">
                                <button class="action-btn ${!showingSend ? 'active' : ''}" onclick="showReceive()">Receive</button>
                                <button class="action-btn ${showingSend ? 'active' : ''}" onclick="showSend()">Send</button>
                            </div>
                        </div>
                        
                        ${selectedAsset === 'tezos' ? '<div style="background: #fff3cd; border: 2px solid #ff6b6b; border-radius: 8px; padding: 12px; margin-bottom: 20px; color: #856404;"><strong>⚠️ Warning:</strong> XTZ sending and receiving is UNTESTED. Use at your own risk with small amounts only!</div>' : ''}
                        
                        ${showingSend ? renderSendForm(asset, assetName, assetSymbol) : `
                            <div class="asset-details">
                                <div class="detail-group">
                                    <label>Balance</label>
                                    <div class="detail-value">${asset.balance} ${assetSymbol}</div>
                                    <div class="detail-secondary">${currencySymbols[selectedCurrency]}${convertCurrency(asset.balanceUSD)}</div>
                                </div>
                                
                                <div class="detail-group">
                                    <label>Wallet Address</label>
                                    <div class="address-box">
                                        <span>${asset.address}</span>
                                        <button onclick="copyAddress('${asset.address}')">📋</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="price-chart-section">
                                <div class="chart-header">
                                    <h3>Price Chart</h3>
                                    <div class="chart-timeframes">
                                        <button class="timeframe-btn active" onclick="loadPriceChart('${assetSymbol}', 1, this)">24H</button>
                                        <button class="timeframe-btn" onclick="loadPriceChart('${assetSymbol}', 7, this)">7D</button>
                                        <button class="timeframe-btn" onclick="loadPriceChart('${assetSymbol}', 30, this)">30D</button>
                                    </div>
                                </div>
                                <div class="chart-container">
                                    <canvas id="priceChart"></canvas>
                                </div>
                            </div>
                            
                            <div class="transactions-section">
                                <h3>Transactions</h3>
                                ${asset.transactions && asset.transactions.length > 0 ? `
                                    <div class="transactions-list">
                                        ${asset.transactions.map(tx => renderTransaction(tx, assetSymbol)).join('')}
                                    </div>
                                ` : '<div class="transactions-empty">No transactions</div>'}
                            </div>
                        `}
                    </main>
                ` : ''}
            </div>
            
            <!-- Mobile Bottom Navigation -->
            <nav class="mobile-bottom-nav">
                <a href="#/wallet" class="mobile-nav-btn active">
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
                <a href="#/settings" class="mobile-nav-btn">
                    <span>⚙️</span>
                    <span>Settings</span>
                </a>
            </nav>
        </div>
    `;
}

function renderChainGroup(chainName, chainKey, color, assets) {
    const isExpanded = expandedChains[chainKey];
    const isLoading = walletService.isBalancesLoading();
    const totalUSD = assets.reduce((sum, a) => sum + parseFloat(a.asset.balanceUSD || 0), 0).toFixed(2);
    const totalConverted = convertCurrency(totalUSD);
    
    // Logo mapping
    const logoMap = {
        'bitcoin': 'src/assets/crypto/SVG/btc.svg',
        'dogecoin': 'src/assets/crypto/SVG/doge.svg',
        'litecoin': 'src/assets/crypto/SVG/ltc.svg',
        'ethereum': 'src/assets/crypto/SVG/eth.svg',
        'polygon': 'src/assets/crypto/SVG/poly.svg',
        'dgage': 'src/assets/crypto/SVG/dgage.png',
        'tezos': 'src/assets/crypto/SVG/xtz.svg',
        'tron': 'src/assets/crypto/SVG/trx.svg',
        'solana': 'src/assets/crypto/SVG/sol.svg'
    };
    
    return `
        <div class="chain-group">
            <div class="chain-header" onclick="toggleChain('${chainKey}')">
                <div class="chain-info">
                    <div class="wallet-icon" style="background: transparent;">
                        <img src="${logoMap[chainKey]}" alt="${chainName}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div>
                        <div class="chain-name">${chainName}</div>
                        <div class="chain-count">${assets.length} asset${assets.length > 1 ? 's' : ''}</div>
                    </div>
                </div>
                <div class="chain-balance">
                    <div>${isLoading ? '...' : `${currencySymbols[selectedCurrency]}${totalConverted}`}</div>
                    <div class="expand-icon">${isExpanded ? '▼' : '▶'}</div>
                </div>
            </div>
            ${isExpanded ? `
                <div class="chain-assets">
                    ${assets.map(a => renderWalletItem(a.name, a.symbol, color, a.asset, selectedAsset === a.key)).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function renderWalletItem(name, symbol, color, asset, active) {
    // Logo mapping for individual items
    const logoMap = {
        'BTC': 'src/assets/crypto/SVG/btc.svg',
        'DOGE': 'src/assets/crypto/SVG/doge.svg',
        'LTC': 'src/assets/crypto/SVG/ltc.svg',
        'ETH': 'src/assets/crypto/SVG/eth.svg',
        'POL': 'src/assets/crypto/SVG/poly.svg',
        'DGAGE': 'src/assets/crypto/SVG/dgage.png',
        'XTZ': 'src/assets/crypto/SVG/xtz.svg',
        'TRX': 'src/assets/crypto/SVG/trx.svg',
        'SOL': 'src/assets/crypto/SVG/sol.svg'
    };
    
    const isLoading = walletService.isBalancesLoading();
    
    return `
        <div class="wallet-item ${active ? 'active' : ''}" onclick="selectAsset('${symbol.toLowerCase()}')">
            <div class="wallet-icon-small" style="background: transparent;">
                <img src="${logoMap[symbol]}" alt="${symbol}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="wallet-info">
                <div class="wallet-name">${symbol}</div>
            </div>
            <div class="wallet-balance">
                ${isLoading ? `
                    <div class="balance-loading">...</div>
                    <div class="balance-usd balance-loading">...</div>
                ` : `
                    <div>${asset.balance}</div>
                    <div class="balance-usd">${currencySymbols[selectedCurrency]}${convertCurrency(asset.balanceUSD)}</div>
                `}
            </div>
        </div>
    `;
}

function renderTransaction(tx, symbol) {
    const date = new Date(tx.timestamp).toLocaleDateString();
    const time = new Date(tx.timestamp).toLocaleTimeString();
    const isSent = tx.type === 'sent';
    
    return `
        <div class="transaction-item">
            <div class="tx-icon ${isSent ? 'sent' : 'received'}">
                ${isSent ? '↑' : '↓'}
            </div>
            <div class="tx-info">
                <div class="tx-type">${isSent ? 'Sent' : 'Received'}</div>
                <div class="tx-date">${date} ${time}</div>
                <div class="tx-hash">${tx.hash.slice(0, 16)}...</div>
            </div>
            <div class="tx-amount ${isSent ? 'sent' : 'received'}">
                ${isSent ? '-' : '+'}${tx.value} ${symbol}
            </div>
        </div>
    `;
}

function toggleChain(chainKey) {
    expandedChains[chainKey] = !expandedChains[chainKey];
    document.getElementById('app').innerHTML = renderWallet();
}

function selectAsset(asset) {
    if (asset === 'btc') {
        selectedAsset = 'bitcoin';
    } else if (asset === 'doge') {
        selectedAsset = 'dogecoin';
    } else if (asset === 'ltc') {
        selectedAsset = 'litecoin';
    } else if (asset === 'eth') {
        selectedAsset = 'ethereum';
    } else if (asset === 'pol') {
        selectedAsset = 'polygon';
    } else if (asset === 'dgage') {
        selectedAsset = 'dgage';
    } else if (asset === 'xtz') {
        selectedAsset = 'tezos';
    } else if (asset === 'trx') {
        selectedAsset = 'tron';
    } else if (asset === 'sol') {
        selectedAsset = 'solana';
    }
    showingSend = false; // Reset to receive view
    document.getElementById('app').innerHTML = renderWallet();
}

function handleLock() {
    if (confirm('Lock wallet?')) {
        walletService.lock();
        router.navigate('/');
    }
}

function clearSelectedAsset() {
    // Clear the selected asset to go back to crypto list on mobile
    selectedAsset = null;
    document.getElementById('app').innerHTML = renderWallet();
}

function refreshBalances() {
    // Fetch exchange rates and balances
    Promise.all([
        fetchExchangeRates(),
        walletService.fetchBalances()
    ]).then(() => {
        document.getElementById('app').innerHTML = renderWallet();
    });
}

function copyAddress(address) {
    navigator.clipboard.writeText(address);
    alert('Copied!');
}

function renderSendForm(asset, assetName, assetSymbol) {
    // Stage 1: Form
    if (sendStage === 'form') {
        return `
            <div class="send-form-container">
                <div class="send-form">
                    <div class="form-group">
                        <label>Recipient Address</label>
                        <input type="text" id="sendAddress" placeholder="Enter ${assetSymbol} address" class="form-input" />
                    </div>
                    <div class="form-group">
                        <label>Amount</label>
                        <div class="amount-input">
                            <input type="number" id="sendAmount" placeholder="0.00" step="any" class="form-input" oninput="updateSendingSummary()" />
                            <span class="amount-symbol">${assetSymbol}</span>
                        </div>
                        <div class="amount-max">
                            Available: ${asset.balance} ${assetSymbol}
                            <button onclick="setMaxAmount('${asset.balance}')" class="max-btn">MAX</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Network Fee</label>
                        <div class="fee-info">
                            <span>Estimated fee: ~$0.50</span>
                        </div>
                    </div>
                    <div class="send-summary">
                        <div class="summary-row">
                            <span>You're sending</span>
                            <span id="sendingSummary">0 ${assetSymbol}</span>
                        </div>
                        <div class="summary-row">
                            <span>Network fee</span>
                            <span>~$0.50</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="reviewTransaction()">Review Transaction</button>
                </div>
            </div>
        `;
    }
    
    // Stage 2: Confirmation
    if (sendStage === 'confirm' && pendingTransaction) {
        return `
            <div class="send-form-container">
                <div class="send-form">
                    <div class="send-stage-header">
                        <h3>Confirm Transaction</h3>
                        <p>Please review the details before sending</p>
                    </div>
                    
                    <div class="send-summary">
                        <div class="summary-row">
                            <span>Asset</span>
                            <span>${assetName} (${assetSymbol})</span>
                        </div>
                        <div class="summary-row">
                            <span>Amount</span>
                            <span>${pendingTransaction.amount} ${assetSymbol}</span>
                        </div>
                        <div class="summary-row">
                            <span>To Address</span>
                        </div>
                        <div class="address-display">
                            ${pendingTransaction.address}
                        </div>
                        <div class="summary-row">
                            <span>Network Fee</span>
                            <span>~$0.50</span>
                        </div>
                    </div>
                    
                    <div class="send-warning">
                        <strong>⚠️ Warning:</strong>
                        <p>Cryptocurrency transactions cannot be reversed. Please verify the address is correct before confirming.</p>
                    </div>
                    
                    <div class="send-actions">
                        <button class="btn-secondary" onclick="backToSendForm()">← Back</button>
                        <button class="btn-primary" onclick="executeSendTransaction()">Confirm & Send</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Stage 3: Sending
    if (sendStage === 'sending') {
        return `
            <div class="send-form-container">
                <div class="send-form" style="text-align: center;">
                    <div class="loading-spinner" style="margin: 2rem auto;"></div>
                    <h3>Sending Transaction...</h3>
                    <p style="color: #888;">Please wait while your transaction is being broadcast to the network.</p>
                </div>
            </div>
        `;
    }
    
    // Stage 4: Success
    if (sendStage === 'success' && pendingTransaction && pendingTransaction.txHash) {
        return `
            <div class="send-form-container">
                <div class="send-form">
                    <div class="send-stage-header" style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                        <h3>Transaction Sent!</h3>
                        <p>Successfully sent <strong>${pendingTransaction.amount} ${assetSymbol}</strong></p>
                        <p style="color: #888; font-size: 0.875rem;">Your transaction has been broadcast to the network</p>
                    </div>
                    
                    <div class="send-summary">
                        <div class="summary-row">
                            <span>Transaction Hash</span>
                        </div>
                        <div class="tx-hash-display">
                            ${pendingTransaction.txHash}
                        </div>
                    </div>
                    
                    ${pendingTransaction.explorerUrl ? `
                        <a href="${pendingTransaction.explorerUrl}" target="_blank" rel="noopener noreferrer" class="explorer-link">
                            View on Block Explorer →
                        </a>
                    ` : ''}
                    
                    <button class="btn-primary" onclick="showReceive()" style="width: 100%; margin-top: 1rem;">Done</button>
                </div>
            </div>
        `;
    }
}

function showSend() {
    showingSend = true;
    sendStage = 'form';
    pendingTransaction = null;
    document.getElementById('app').innerHTML = renderWallet();
}

function showReceive() {
    showingSend = false;
    sendStage = 'form';
    pendingTransaction = null;
    document.getElementById('app').innerHTML = renderWallet();
}

function setMaxAmount(balance) {
    document.getElementById('sendAmount').value = balance;
    updateSendingSummary();
}

function updateSendingSummary() {
    const amount = document.getElementById('sendAmount').value;
    const symbol = selectedAsset === 'bitcoin' ? 'BTC' : 
                   selectedAsset === 'dogecoin' ? 'DOGE' :
                   selectedAsset === 'litecoin' ? 'LTC' :
                   selectedAsset === 'ethereum' ? 'ETH' :
                   selectedAsset === 'polygon' ? 'POL' :
                   selectedAsset === 'dgage' ? 'DGAGE' :
                   selectedAsset === 'tezos' ? 'XTZ' : 
                   selectedAsset === 'tron' ? 'TRX' : 
                   selectedAsset === 'solana' ? 'SOL' : '';
    document.getElementById('sendingSummary').textContent = `${amount || 0} ${symbol}`;
}

function reviewTransaction() {
    const address = document.getElementById('sendAddress').value;
    const amount = document.getElementById('sendAmount').value;
    
    if (!address || !amount) {
        alert('Please fill in all fields');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        alert('Amount must be greater than 0');
        return;
    }
    
    const wallet = walletService.getWallet();
    if (!wallet) return;
    
    // Check balance
    let balance;
    if (selectedAsset === 'bitcoin') {
        balance = parseFloat(wallet.bitcoin.balance);
    } else if (selectedAsset === 'dogecoin') {
        balance = parseFloat(wallet.dogecoin.balance);
    } else if (selectedAsset === 'litecoin') {
        balance = parseFloat(wallet.litecoin.balance);
    } else if (selectedAsset === 'ethereum') {
        balance = parseFloat(wallet.ethereum.balance);
    } else if (selectedAsset === 'polygon') {
        balance = parseFloat(wallet.polygon.balance);
    } else if (selectedAsset === 'dgage') {
        balance = parseFloat(wallet.dgage.balance);
    } else if (selectedAsset === 'solana') {
        balance = parseFloat(wallet.solana.balance);
    } else if (selectedAsset === 'tezos') {
        balance = parseFloat(wallet.tezos.balance);
    } else if (selectedAsset === 'tron') {
        balance = parseFloat(wallet.tron.balance);
    }
    
    if (parseFloat(amount) > balance) {
        alert(`Insufficient balance. You have ${balance}`);
        return;
    }
    
    // Store transaction details and move to confirmation stage
    pendingTransaction = {
        address: address,
        amount: amount
    };
    sendStage = 'confirm';
    document.getElementById('app').innerHTML = renderWallet();
}

function backToSendForm() {
    sendStage = 'form';
    document.getElementById('app').innerHTML = renderWallet();
    // Restore form values
    setTimeout(() => {
        if (pendingTransaction) {
            document.getElementById('sendAddress').value = pendingTransaction.address;
            document.getElementById('sendAmount').value = pendingTransaction.amount;
            updateSendingSummary();
        }
    }, 0);
}

async function executeSendTransaction() {
    if (!pendingTransaction) return;
    
    // Move to sending stage
    sendStage = 'sending';
    document.getElementById('app').innerHTML = renderWallet();
    
    try {
        let txHash;
        
        if (selectedAsset === 'bitcoin') {
            txHash = await sendBitcoin(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'dogecoin') {
            txHash = await sendDogecoin(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'litecoin') {
            txHash = await sendLitecoin(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'ethereum') {
            txHash = await sendEthereum(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'polygon') {
            txHash = await sendPolygon(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'dgage') {
            txHash = await sendDGAGE(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'solana') {
            txHash = await sendSolana(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'tezos') {
            // Show warning for untested Tezos
            if (!confirm('⚠️ WARNING: Tezos sending is UNTESTED!\n\nThis feature has not been tested with real funds. There is a risk of losing your XTZ.\n\nOnly proceed if you understand the risks and are testing with a small amount.\n\nContinue anyway?')) {
                sendStage = 'form';
                document.getElementById('app').innerHTML = renderWallet();
                return;
            }
            txHash = await sendTezos(pendingTransaction.address, pendingTransaction.amount);
        } else if (selectedAsset === 'tron') {
            txHash = await sendTron(pendingTransaction.address, pendingTransaction.amount);
        }
        
        if (txHash) {
            // Get explorer URL based on asset
            let explorerUrl = '';
            if (selectedAsset === 'bitcoin') {
                explorerUrl = `https://blockchair.com/bitcoin/transaction/${txHash}`;
            } else if (selectedAsset === 'dogecoin') {
                explorerUrl = `https://blockchair.com/dogecoin/transaction/${txHash}`;
            } else if (selectedAsset === 'litecoin') {
                explorerUrl = `https://blockchair.com/litecoin/transaction/${txHash}`;
            } else if (selectedAsset === 'ethereum') {
                explorerUrl = `https://etherscan.io/tx/${txHash}`;
            } else if (selectedAsset === 'polygon' || selectedAsset === 'dgage') {
                explorerUrl = `https://polygonscan.com/tx/${txHash}`;
            } else if (selectedAsset === 'solana') {
                explorerUrl = `https://explorer.solana.com/tx/${txHash}`;
            } else if (selectedAsset === 'tezos') {
                explorerUrl = `https://tzstats.com/${txHash}`;
            } else if (selectedAsset === 'tron') {
                explorerUrl = `https://tronscan.org/#/transaction/${txHash}`;
            }
            
            // Update pending transaction with result
            pendingTransaction.txHash = txHash;
            pendingTransaction.explorerUrl = explorerUrl;
            
            // Move to success stage
            sendStage = 'success';
            document.getElementById('app').innerHTML = renderWallet();
            
            // Refresh balances in background
            walletService.fetchBalances();
        }
    } catch (error) {
        alert(`Send failed: ${error.message}`);
        sendStage = 'form';
        document.getElementById('app').innerHTML = renderWallet();
    }
}

function changeCurrency(currency) {
    selectedCurrency = currency;
    localStorage.setItem('selectedCurrency', currency);
    
    // Just re-render with new currency (no need to fetch again)
    document.getElementById('app').innerHTML = renderWallet();
}


// Send DGAGE tokens
async function sendDGAGE(toAddress, amount) {
    const wallet = walletService.getWallet();
    if (!wallet) throw new Error('Wallet not found');
    
    // Get private key from mnemonic using ethers
    const { ethers } = window.cryptoLibs;
    const hdNode = ethers.utils.HDNode.fromMnemonic(wallet.mnemonic);
    const path = "m/44'/60'/0'/0/0";
    const child = hdNode.derivePath(path);
    const privateKey = child.privateKey;
    
    console.log('Sending DGAGE transaction...');
    const result = await walletService.dgageService.sendDGAGE(privateKey, toAddress, amount);
    
    if (result && result.success && result.txHash) {
        return result.txHash;
    } else if (result && result.txHash) {
        // Sometimes success flag might not be set but txHash exists
        return result.txHash;
    } else {
        throw new Error('Transaction failed - no transaction hash returned');
    }
}

// Price chart instance
let priceChartInstance = null;

// CoinGecko ID mapping
const coinGeckoIds = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'DOGE': 'dogecoin',
    'LTC': 'litecoin',
    'SOL': 'solana',
    'XTZ': 'tezos',
    'TRX': 'tron',
    'POL': 'matic-network'
};

// Chart cache to avoid rate limiting
let chartCache = {};
const CHART_CACHE_TTL = 60000; // 1 minute

async function loadPriceChart(symbol, days = 1, buttonEl = null) {
    const coinId = coinGeckoIds[symbol];
    if (!coinId) {
        console.log('No chart data for', symbol);
        return;
    }
    
    // Update active button
    document.querySelectorAll('.timeframe-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonEl) {
        buttonEl.classList.add('active');
    } else {
        const firstBtn = document.querySelector('.timeframe-btn');
        if (firstBtn) firstBtn.classList.add('active');
    }
    
    try {
        const cacheKey = `${coinId}-${days}`;
        let data = null;
        
        // Check cache - must have valid prices array
        const cached = chartCache[cacheKey];
        if (cached && Array.isArray(cached.data?.prices) && cached.data.prices.length > 0 && Date.now() - cached.timestamp < CHART_CACHE_TTL) {
            console.log('Using cached chart data for', symbol, '- points:', cached.data.prices.length);
            data = cached.data;
        } else {
            // Always fetch fresh if cache invalid
            console.log('Fetching fresh chart data for', symbol);
            const response = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/chart?id=${coinId}&days=${days}`);
            
            if (!response.ok) {
                console.error('Chart API error:', response.status);
                return;
            }
            
            data = await response.json();
            console.log('Chart response for', symbol, '- prices:', data.prices?.length || 0);
            
            // Only cache valid data
            if (Array.isArray(data.prices) && data.prices.length > 0) {
                chartCache[cacheKey] = { data, timestamp: Date.now() };
            }
        }
        
        if (!Array.isArray(data?.prices) || data.prices.length === 0) {
            console.error('No valid price data for', symbol);
            delete chartCache[cacheKey];
            // Show unavailable message
            const ctx = document.getElementById('priceChart');
            if (ctx) {
                const container = ctx.parentElement;
                container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#888;">Chart temporarily unavailable (rate limited)</div>';
            }
            return;
        }
        
        const prices = data.prices;
        const labels = prices.map(p => {
            const date = new Date(p[0]);
            if (days === 1) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }
        });
        const values = prices.map(p => p[1]);
        
        // Determine if price went up or down
        const priceChange = values[values.length - 1] - values[0];
        const chartColor = priceChange >= 0 ? '#4ade80' : '#ef4444';
        
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (priceChartInstance) {
            priceChartInstance.destroy();
        }
        
        priceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Price`,
                    data: values,
                    borderColor: chartColor,
                    backgroundColor: chartColor + '20',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#888',
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
    } catch (error) {
        console.error('Failed to load price chart:', error);
    }
}

// Auto-load chart when asset is selected
function initPriceChart() {
    const symbol = selectedAsset === 'bitcoin' ? 'BTC' : 
                   selectedAsset === 'ethereum' ? 'ETH' :
                   selectedAsset === 'dogecoin' ? 'DOGE' :
                   selectedAsset === 'litecoin' ? 'LTC' :
                   selectedAsset === 'solana' ? 'SOL' :
                   selectedAsset === 'tezos' ? 'XTZ' :
                   selectedAsset === 'tron' ? 'TRX' :
                   selectedAsset === 'polygon' ? 'POL' : null;
    
    if (symbol && document.getElementById('priceChart')) {
        loadPriceChart(symbol, 1);
    }
}

// Call initPriceChart after render
const originalSelectAsset = selectAsset;
selectAsset = function(asset) {
    originalSelectAsset(asset);
    setTimeout(initPriceChart, 100);
};

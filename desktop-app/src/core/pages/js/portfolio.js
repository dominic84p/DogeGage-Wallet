// Portfolio Page
let currentTimeframe = '7D'; // Default timeframe

function renderPortfolio() {
    const wallet = walletService.getWallet();
    if (!wallet) {
        router.navigate('/');
        return '';
    }

    const totalBalance = walletService.getTotalBalance();
    const totalBalanceConverted = convertCurrency(totalBalance);

    // Get all assets
    const assets = [
        { name: 'Bitcoin', symbol: 'BTC', asset: wallet.bitcoin, color: '#f7931a', percentage: 300 },
        { name: 'Ethereum', symbol: 'ETH', asset: wallet.ethereum, color: '#627eea', percentage: 150 },
        { name: 'Dogecoin', symbol: 'DOGE', asset: wallet.dogecoin, color: '#c2a633', percentage: 100 },
        { name: 'Litecoin', symbol: 'LTC', asset: wallet.litecoin, color: '#bfbbbb', percentage: 80 },
        { name: 'Tezos', symbol: 'XTZ', asset: wallet.tezos, color: '#2c7df7', percentage: 80 },
        { name: 'Tron', symbol: 'TRX', asset: wallet.tron, color: '#eb0029', percentage: 50 },
        { name: 'Solana', symbol: 'SOL', asset: wallet.solana, color: '#14f195', percentage: 200 },
        ...(wallet.polygon ? [{ name: 'Polygon', symbol: 'POL', asset: wallet.polygon, color: '#8247e5', percentage: 60 }] : [])
    ];

    return `
        <div class="wallet-page">
            <nav class="wallet-nav">
                <div class="nav-left">
                    <div class="nav-logo">⬢ DogeGage</div>
                    <div class="nav-tabs">
                        <a href="#/wallet" class="nav-tab">WALLETS</a>
                        <a href="#/portfolio" class="nav-tab active">PORTFOLIO</a>
                        <a href="#/exchange" class="nav-tab">EXCHANGE</a>
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
            
            <div class="portfolio-container">
                <div class="portfolio-layout">
                    <div class="portfolio-left">
                        <div class="portfolio-chart-card">
                            <div class="portfolio-total-center">
                                <div class="portfolio-total-label">Total Balance</div>
                                <div class="portfolio-total-amount">${currencySymbols[selectedCurrency]}${totalBalanceConverted}</div>
                            </div>
                            <canvas id="portfolioDonut"></canvas>
                        </div>
                        
                        <div class="portfolio-assets-list">
                            ${assets.map(a => renderAssetItem(a)).join('')}
                        </div>
                    </div>
                    
                    <div class="portfolio-right">
                        <div class="portfolio-chart-card">
                            <div class="chart-header">
                                <h3>Portfolio Performance</h3>
                                <div class="chart-timeframe">
                                    <button class="timeframe-btn ${currentTimeframe === '24H' ? 'active' : ''}" onclick="changeTimeframe('24H')">24H</button>
                                    <button class="timeframe-btn ${currentTimeframe === '7D' ? 'active' : ''}" onclick="changeTimeframe('7D')">7D</button>
                                    <button class="timeframe-btn ${currentTimeframe === '1M' ? 'active' : ''}" onclick="changeTimeframe('1M')">1M</button>
                                    <button class="timeframe-btn ${currentTimeframe === '3M' ? 'active' : ''}" onclick="changeTimeframe('3M')">3M</button>
                                    <button class="timeframe-btn ${currentTimeframe === '1Y' ? 'active' : ''}" onclick="changeTimeframe('1Y')">1Y</button>
                                    <button class="timeframe-btn ${currentTimeframe === 'Max' ? 'active' : ''}" onclick="changeTimeframe('Max')">Max</button>
                                </div>
                            </div>
                            <canvas id="portfolioLineChart"></canvas>
                            <div class="chart-note">Showing ${getTimeframeLabel()} percentage gain/loss for owned cryptos</div>
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
                <a href="#/portfolio" class="mobile-nav-btn active">
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

function renderAssetItem(asset) {
    const balanceUSD = parseFloat(asset.asset.balanceUSD || 0);

    // Only show if user owns this crypto
    if (balanceUSD <= 0) return '';

    // Calculate percentage of total portfolio
    const totalBalance = walletService.getTotalBalance();
    const percentage = totalBalance > 0 ? ((balanceUSD / totalBalance) * 100).toFixed(0) : 0;

    return `
        <div class="asset-item" onclick="router.navigate('/wallet'); selectAsset('${asset.symbol.toLowerCase()}')">
            <div class="asset-color" style="background: ${asset.color};"></div>
            <div class="asset-name">${asset.name} ${percentage}%</div>
        </div>
    `;
}

function changeTimeframe(timeframe) {
    currentTimeframe = timeframe;
    document.getElementById('app').innerHTML = renderPortfolio();
    setTimeout(() => {
        initPortfolioCharts();
    }, 100);
}

function getTimeframeLabel() {
    const labels = {
        '24H': '24-hour',
        '7D': '7-day',
        '1M': '1-month',
        '3M': '3-month',
        '1Y': '1-year',
        'Max': 'all-time'
    };
    return labels[currentTimeframe] || '7-day';
}

function getTimeframeDays() {
    const days = {
        '24H': 1,
        '7D': 7,
        '1M': 30,
        '3M': 90,
        '1Y': 365,
        'Max': 'max'
    };
    return days[currentTimeframe] || 7;
}

// Initialize charts after render
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#/portfolio') {
        setTimeout(initPortfolioCharts, 100);
    }
});

function initPortfolioCharts() {
    initDonutChart();
    initLineChart();
}

function initDonutChart() {
    const canvas = document.getElementById('portfolioDonut');
    if (!canvas) return;

    const wallet = walletService.getWallet();
    if (!wallet) return;

    const assets = [
        { name: 'Bitcoin', color: '#f7931a', value: parseFloat(wallet.bitcoin.balanceUSD || 0) },
        { name: 'Ethereum', color: '#627eea', value: parseFloat(wallet.ethereum.balanceUSD || 0) },
        { name: 'Dogecoin', color: '#c2a633', value: parseFloat(wallet.dogecoin.balanceUSD || 0) },
        { name: 'Litecoin', color: '#bfbbbb', value: parseFloat(wallet.litecoin.balanceUSD || 0) },
        { name: 'Solana', color: '#14f195', value: parseFloat(wallet.solana.balanceUSD || 0) },
        { name: 'Tezos', color: '#2c7df7', value: parseFloat(wallet.tezos.balanceUSD || 0) },
        { name: 'Tron', color: '#eb0029', value: parseFloat(wallet.tron.balanceUSD || 0) },
        { name: 'Polygon', color: '#8247e5', value: parseFloat(wallet.polygon?.balanceUSD || 0) }
    ];

    const assetsWithBalance = assets.filter(a => a.value > 0);

    if (assetsWithBalance.length === 0) {
        return;
    }

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: assetsWithBalance.map(a => a.name),
            datasets: [{
                data: assetsWithBalance.map(a => a.value),
                backgroundColor: assetsWithBalance.map(a => a.color),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            cutout: '75%'
        }
    });
}

function initLineChart() {
    const canvas = document.getElementById('portfolioLineChart');
    if (!canvas) return;

    // Show loading state
    const chartCard = canvas.closest('.portfolio-chart-card');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chart-loading';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-quote">"Complexity is the enemy of security"</div>
        <div class="loading-text">Fetching price data...</div>
    `;
    chartCard.appendChild(loadingDiv);
    canvas.style.opacity = '0';

    // Fetch real price data from CoinGecko
    fetchCryptoPriceHistory().then(priceData => {
        // Remove loading state
        loadingDiv.remove();
        canvas.style.opacity = '1';
        if (!priceData) {
            // Fallback to mock data if API fails
            renderMockChart(canvas);
            return;
        }

        const cryptoColors = {
            bitcoin: '#f7931a',
            ethereum: '#627eea',
            solana: '#14f195',
            tezos: '#2c7df7',
            tron: '#eb0029'
        };

        const cryptoNames = {
            bitcoin: 'Bitcoin',
            ethereum: 'Ethereum',
            solana: 'Solana',
            tezos: 'Tezos',
            tron: 'Tron'
        };

        // Build datasets only for owned cryptos
        const datasets = priceData.ownedCryptos.map(crypto => ({
            label: cryptoNames[crypto],
            data: priceData[crypto],
            borderColor: cryptoColors[crypto],
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0
        }));

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: priceData.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#2a2a2a',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#444',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed.y;
                                const sign = value >= 0 ? '+' : '';
                                return context.dataset.label + ': ' + sign + value.toFixed(2) + '%';
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
                            maxTicksLimit: 8,
                            autoSkip: true
                        }
                    },
                    y: {
                        display: true,
                        position: 'right',
                        grid: {
                            color: '#333',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            callback: function (value) {
                                const sign = value >= 0 ? '+' : '';
                                return sign + value.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    });
}

async function fetchCryptoPriceHistory() {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) return null;

        // Only fetch data for cryptos user owns
        const ownedCryptos = [];
        if (parseFloat(wallet.bitcoin.balanceUSD || 0) > 0) ownedCryptos.push({ id: 'bitcoin', key: 'bitcoin' });
        if (parseFloat(wallet.ethereum.balanceUSD || 0) > 0) ownedCryptos.push({ id: 'ethereum', key: 'ethereum' });
        if (parseFloat(wallet.solana.balanceUSD || 0) > 0) ownedCryptos.push({ id: 'solana', key: 'solana' });
        if (parseFloat(wallet.tezos.balanceUSD || 0) > 0) ownedCryptos.push({ id: 'tezos', key: 'tezos' });
        if (parseFloat(wallet.tron.balanceUSD || 0) > 0) ownedCryptos.push({ id: 'tron', key: 'tron' });

        if (ownedCryptos.length === 0) return null;

        const days = getTimeframeDays();

        // Fetch with 2 second delay between requests to avoid rate limiting
        const results = [];
        for (let i = 0; i < ownedCryptos.length; i++) {
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${ownedCryptos[i].id}/market_chart?vs_currency=usd&days=${days}`);

                // Check if rate limited
                if (response.status === 429) {
                    console.warn('Rate limited by CoinGecko, using fallback data');
                    return null;
                }

                if (!response.ok) {
                    console.warn(`Failed to fetch ${ownedCryptos[i].id}: ${response.status}`);
                    return null;
                }

                const data = await response.json();
                results.push(data);
            } catch (err) {
                console.warn(`Error fetching ${ownedCryptos[i].id}:`, err);
                return null;
            }
        }

        // Convert prices to percentage gains (normalized to start at 0%)
        const priceData = {};
        results.forEach((result, index) => {
            const prices = result.prices.map(p => p[1]);
            const startPrice = prices[0];
            const percentageGains = prices.map(price => ((price - startPrice) / startPrice) * 100);
            priceData[ownedCryptos[index].key] = percentageGains;
        });

        // Create labels from timestamps
        const labels = results[0].prices.map(p => {
            const date = new Date(p[0]);
            // Format based on timeframe
            if (currentTimeframe === '24H') {
                return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            } else if (currentTimeframe === '7D' || currentTimeframe === '1M') {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else {
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }
        });

        return {
            labels,
            ownedCryptos: ownedCryptos.map(c => c.key),
            ...priceData
        };
    } catch (error) {
        console.error('Failed to fetch price history:', error);
        return null;
    }
}

function renderMockChart(canvas) {
    const wallet = walletService.getWallet();
    if (!wallet) return;

    // Only show cryptos user owns
    const cryptoColors = {
        bitcoin: '#f7931a',
        ethereum: '#627eea',
        solana: '#14f195',
        tezos: '#2c7df7',
        tron: '#eb0029'
    };

    const cryptoNames = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        solana: 'Solana',
        tezos: 'Tezos',
        tron: 'Tron'
    };

    const ownedCryptos = [];
    if (parseFloat(wallet.bitcoin.balanceUSD || 0) > 0) ownedCryptos.push('bitcoin');
    if (parseFloat(wallet.ethereum.balanceUSD || 0) > 0) ownedCryptos.push('ethereum');
    if (parseFloat(wallet.solana.balanceUSD || 0) > 0) ownedCryptos.push('solana');
    if (parseFloat(wallet.tezos.balanceUSD || 0) > 0) ownedCryptos.push('tezos');
    if (parseFloat(wallet.tron.balanceUSD || 0) > 0) ownedCryptos.push('tron');

    if (ownedCryptos.length === 0) return;

    // Adjust data points based on timeframe
    const dataPoints = currentTimeframe === '24H' ? 24 :
        currentTimeframe === '7D' ? 30 :
            currentTimeframe === '1M' ? 30 :
                currentTimeframe === '3M' ? 90 :
                    currentTimeframe === '1Y' ? 365 : 100;

    // Fallback mock data showing percentage gains
    const now = Date.now();
    const labels = Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date(now - (dataPoints - i) * (currentTimeframe === '24H' ? 3600000 : 86400000));
        if (currentTimeframe === '24H') {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (currentTimeframe === '7D' || currentTimeframe === '1M') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }
    });

    const datasets = ownedCryptos.map(crypto => ({
        label: cryptoNames[crypto],
        data: generateMockPercentageData(dataPoints),
        borderColor: cryptoColors[crypto],
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0
    }));

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#2a2a2a',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#444',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed.y;
                            const sign = value >= 0 ? '+' : '';
                            return context.dataset.label + ': ' + sign + value.toFixed(2) + '%';
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
                        maxTicksLimit: 8,
                        autoSkip: true
                    }
                },
                y: {
                    display: true,
                    position: 'right',
                    grid: {
                        color: '#333',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        callback: function (value) {
                            const sign = value >= 0 ? '+' : '';
                            return sign + value.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

function generateMockPercentageData(points) {
    const data = [];
    let current = 0; // Start at 0%

    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * 3; // Random change between -1.5% and +1.5%
        current += change;
        data.push(current);
    }

    return data;
}

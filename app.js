/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// DogeGage Wallet - Main Application
console.log('%c⚠️ STOP! ⚠️', 'color: red; font-size: 50px; font-weight: bold;');
console.log('%c🛑 WARNING - SCAM ALERT 🛑', 'color: red; font-size: 30px; font-weight: bold; background: yellow; padding: 10px;');
console.log('%cAttention: This is a browser feature intended for developers.', 'font-size: 18px; font-weight: bold;');
console.log('%cIf anyone is asking you to paste anything here, they are 101% a SCAMMER!', 'font-size: 18px; font-weight: bold; color: red;');
console.log('%cPasting code here can give attackers access to your wallet and steal all your crypto!', 'font-size: 16px; color: red;');
console.log('%c\nIf you don\'t know what you\'re doing, close this window immediately!', 'font-size: 16px; font-weight: bold;');
console.log('\n');
console.log('DogeGage Wallet loading...');

// Set Infura API key
// TODO: Move this to settings/config
walletService.setInfuraKey('9540b1a395444670a0a59d0febd57d56');

// Initialize app
function initApp() {
    // Clear any stale hash on initial load if wallet is unlocked
    // This prevents browser from remembering /#/unlock from previous session
    if (walletService.isWalletUnlocked() && window.location.hash === '#/unlock') {
        window.location.hash = '#/';
    }

    // Register routes
    router.register('/', () => {
        document.getElementById('app').innerHTML = renderLanding();
    });

    router.register('/docs', () => {
        document.getElementById('app').innerHTML = renderDocs();
    });

    router.register('/news', () => {
        document.getElementById('app').innerHTML = renderNews();
    });

    router.register('/support', () => {
        document.getElementById('app').innerHTML = renderSupport();
    });

    router.register('/about', () => {
        document.getElementById('app').innerHTML = renderAbout();
    });

    router.register('/unlock', () => {
        // If no wallet exists, go to landing
        if (!encryptionService.hasStoredWallet()) {
            router.navigate('/');
            return;
        }

        // If wallet is already unlocked, go to wallet
        if (walletService.isWalletUnlocked()) {
            router.navigate('/wallet');
            return;
        }

        document.getElementById('app').innerHTML = renderUnlock();
    });

    router.register('/import', () => {
        document.getElementById('app').innerHTML = renderImport();
    }, initImportPage);

    router.register('/create', () => {
        document.getElementById('app').innerHTML = renderCreate();
    });

    router.register('/wallet', async () => {
        console.log('Opening wallet...');

        if (!walletService.isWalletUnlocked()) {
            router.navigate('/unlock');
            return;
        }

        document.getElementById('app').innerHTML = renderWallet();

        // Fetch exchange rates and balances if not already loaded
        const wallet = walletService.getWallet();
        if (wallet && (!wallet.bitcoin.balanceUSD || wallet.bitcoin.balanceUSD === '0.00')) {
            await Promise.all([
                fetchExchangeRates(),
                walletService.fetchBalances()
            ]);
            document.getElementById('app').innerHTML = renderWallet();
        }
    });

    router.register('/portfolio', async () => {
        if (!walletService.isWalletUnlocked()) {
            sessionStorage.setItem('redirectAfterUnlock', '/portfolio');
            router.navigate('/');
            return;
        }
        document.getElementById('app').innerHTML = renderPortfolio();

        // Fetch exchange rates and balances if not already loaded
        const wallet = walletService.getWallet();
        if (wallet && (!wallet.bitcoin.balanceUSD || wallet.bitcoin.balanceUSD === '0.00')) {
            await Promise.all([
                fetchExchangeRates(),
                walletService.fetchBalances()
            ]);
            document.getElementById('app').innerHTML = renderPortfolio();
        }
    });

    router.register('/exchange', async () => {
        if (!walletService.isWalletUnlocked()) {
            sessionStorage.setItem('redirectAfterUnlock', '/exchange');
            router.navigate('/');
            return;
        }
        document.getElementById('app').innerHTML = renderExchange();

        // Fetch exchange rates and balances if not already loaded
        const wallet = walletService.getWallet();
        if (wallet && (!wallet.bitcoin.balanceUSD || wallet.bitcoin.balanceUSD === '0.00')) {
            await Promise.all([
                fetchExchangeRates(),
                walletService.fetchBalances()
            ]);
            document.getElementById('app').innerHTML = renderExchange();
        }
    });

    router.register('/exchange-status', () => {
        if (!walletService.isWalletUnlocked()) {
            router.navigate('/');
            return;
        }
        document.getElementById('app').innerHTML = renderExchangeStatus();
    });

    router.register('/settings', () => {
        if (!walletService.isWalletUnlocked()) {
            router.navigate('/');
            return;
        }
        document.getElementById('app').innerHTML = renderSettings();
    });

    // Start router
    router.start();

    console.log('DogeGage Wallet ready! 🔥');
}

// Start app
initApp();

// Initialize auto-lock service
autoLockService.init();

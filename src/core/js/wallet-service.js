// Wallet Service - Manages wallet state and crypto operations
class WalletService {
    constructor() {
        this.wallet = null;
        this.isUnlocked = false;
        this.infuraApiKey = null;
        this.ethereumService = null;
        this.bitcoinService = new BitcoinService();
        this.dogecoinService = new DogecoinService();
        this.litecoinService = new LitecoinService();
        this.tezosService = new TezosService();
        this.tronService = new TronService();
        this.solanaService = new SolanaService();
        this.dgageService = new DGAGEService();
        this.polygonService = new PolygonService();
        this.tokenScanner = new TokenScanner();
    }
    
    setInfuraKey(apiKey) {
        this.infuraApiKey = apiKey;
        this.ethereumService = new EthereumService(apiKey);
    }
    
    async importFromSeed(mnemonic) {
        if (!window.cryptoLibs) {
            throw new Error('Crypto libraries not loaded');
        }
        
        const { ethers } = window.cryptoLibs;
        
        // Validate mnemonic
        try {
            ethers.utils.HDNode.fromMnemonic(mnemonic);
        } catch (e) {
            throw new Error('Invalid seed phrase');
        }
        
        // Derive Ethereum address
        const ethData = this.ethereumService.deriveAddress(mnemonic);
        
        // Derive Bitcoin address
        const btcData = this.bitcoinService.deriveAddress(mnemonic);
        
        // Derive Dogecoin address
        const dogeData = this.dogecoinService.deriveAddress(mnemonic);
        
        // Derive Litecoin address
        const ltcData = this.litecoinService.deriveAddress(mnemonic);
        
        // Derive Tezos address (async because of Ed25519)
        const xtzData = await this.tezosService.deriveAddress(mnemonic);
        
        // Derive Tron address
        const trxData = this.tronService.deriveAddress(mnemonic);
        
        // Derive Solana address
        console.log('Deriving Solana address...');
        const solData = await this.solanaService.deriveAddress(mnemonic);
        console.log('Solana derived:', solData);
        
        this.wallet = {
            mnemonic,
            bitcoin: {
                address: btcData.address,
                balance: '0.00000000',
                balanceUSD: '0.00',
                transactions: []
            },
            dogecoin: {
                address: dogeData,
                balance: '0.00000000',
                balanceUSD: '0.00',
                transactions: []
            },
            litecoin: {
                address: ltcData,
                balance: '0.00000000',
                balanceUSD: '0.00',
                transactions: []
            },
            ethereum: {
                address: ethData.address,
                privateKey: ethData.privateKey,
                balance: '0.0000',
                balanceUSD: '0.00',
                transactions: []
            },
            dgage: {
                address: ethData.address, // Same as ETH
                balance: '0.0000',
                balanceUSD: '0.00',
                transactions: []
            },
            tezos: {
                address: xtzData.address,
                balance: '0.000000',
                balanceUSD: '0.00',
                transactions: []
            },
            tron: {
                address: trxData.address,
                balance: '0.000000',
                balanceUSD: '0.00',
                transactions: []
            },
            solana: {
                address: solData.address,
                balance: '0.000000',
                balanceUSD: '0.00',
                transactions: []
            }
        };
        
        this.isUnlocked = true;
        sessionStorage.setItem('walletUnlocked', 'true');
        this.saveToStorage();
        
        return this.wallet;
    }
    
    async fetchBalances() {
        if (!this.wallet) return;
        
        if (!this.infuraApiKey) {
            console.error('Infura API key not set');
            return;
        }
        
        console.log('Fetching balances...');
        
        // Try to load cached balances first
        const cached = this.loadCachedBalances();
        if (cached) {
            console.log('Using cached balances as fallback');
            this.wallet.ethereum.balance = cached.ethereum?.balance || '0.00';
            this.wallet.ethereum.balanceUSD = cached.ethereum?.balanceUSD || '0.00';
            this.wallet.bitcoin.balance = cached.bitcoin?.balance || '0.00';
            this.wallet.bitcoin.balanceUSD = cached.bitcoin?.balanceUSD || '0.00';
            this.wallet.dogecoin.balance = cached.dogecoin?.balance || '0.00';
            this.wallet.dogecoin.balanceUSD = cached.dogecoin?.balanceUSD || '0.00';
            this.wallet.tezos.balance = cached.tezos?.balance || '0.00';
            this.wallet.tezos.balanceUSD = cached.tezos?.balanceUSD || '0.00';
            this.wallet.tron.balance = cached.tron?.balance || '0.00';
            this.wallet.tron.balanceUSD = cached.tron?.balanceUSD || '0.00';
            this.wallet.solana.balance = cached.solana?.balance || '0.00';
            this.wallet.solana.balanceUSD = cached.solana?.balanceUSD || '0.00';
        }
        
        try {
            // Fetch Ethereum balance
            try {
                const ethData = await this.ethereumService.getBalanceUSD(this.wallet.ethereum.address);
                this.wallet.ethereum.balance = ethData.balance;
                this.wallet.ethereum.balanceUSD = ethData.balanceUSD;
                this.wallet.ethereum.transactions = await this.ethereumService.getTransactions(this.wallet.ethereum.address);
                console.log('ETH Balance:', ethData.balance, 'USD:', ethData.balanceUSD);
            } catch (error) {
                console.error('ETH balance fetch failed:', error);
            }
            
            // Fetch Bitcoin balance
            try {
                const btcData = await this.bitcoinService.getBalanceUSD(this.wallet.bitcoin.address);
                this.wallet.bitcoin.balance = btcData.balance;
                this.wallet.bitcoin.balanceUSD = btcData.balanceUSD;
                this.wallet.bitcoin.transactions = await this.bitcoinService.getTransactions(this.wallet.bitcoin.address);
                console.log('BTC Balance:', btcData.balance, 'USD:', btcData.balanceUSD);
            } catch (error) {
                console.error('BTC balance fetch failed:', error);
            }
            
            // Fetch Dogecoin balance
            try {
                const dogeBalance = await this.dogecoinService.getBalance(this.wallet.dogecoin.address);
                const dogePrice = await this.getDogePrice();
                this.wallet.dogecoin.balance = dogeBalance;
                this.wallet.dogecoin.balanceUSD = (parseFloat(dogeBalance) * dogePrice).toFixed(2);
                console.log('DOGE Balance:', dogeBalance, 'USD:', this.wallet.dogecoin.balanceUSD);
            } catch (error) {
                console.error('DOGE balance fetch failed:', error);
            }
            
            // Fetch Litecoin balance
            try {
                const ltcBalance = await this.litecoinService.getBalance(this.wallet.litecoin.address);
                const ltcPrice = await this.getLtcPrice();
                this.wallet.litecoin.balance = ltcBalance;
                this.wallet.litecoin.balanceUSD = (parseFloat(ltcBalance) * ltcPrice).toFixed(2);
                console.log('LTC Balance:', ltcBalance, 'USD:', this.wallet.litecoin.balanceUSD);
            } catch (error) {
                console.error('LTC balance fetch failed:', error);
            }
            
            // Fetch Tezos balance
            try {
                const xtzData = await this.tezosService.getBalanceUSD(this.wallet.tezos.address);
                this.wallet.tezos.balance = xtzData.balance;
                this.wallet.tezos.balanceUSD = xtzData.balanceUSD;
                console.log('XTZ Balance:', xtzData.balance, 'USD:', xtzData.balanceUSD);
            } catch (error) {
                console.error('XTZ balance fetch failed:', error);
            }
            
            // Fetch Tron balance
            try {
                const trxData = await this.tronService.getBalanceUSD(this.wallet.tron.address);
                this.wallet.tron.balance = trxData.balance;
                this.wallet.tron.balanceUSD = trxData.balanceUSD;
                console.log('TRX Balance:', trxData.balance, 'USD:', trxData.balanceUSD);
            } catch (error) {
                console.error('TRX balance fetch failed:', error);
            }
            
            // Fetch Solana balance
            try {
                const solData = await this.solanaService.getBalanceUSD(this.wallet.solana.address);
                this.wallet.solana.balance = solData.balance;
                this.wallet.solana.balanceUSD = solData.balanceUSD;
                this.wallet.solana.transactions = await this.solanaService.getTransactions(this.wallet.solana.address);
                console.log('SOL Balance:', solData.balance, 'USD:', solData.balanceUSD);
                console.log('SOL Address:', this.wallet.solana.address);
            } catch (error) {
                console.error('SOL balance fetch failed:', error);
            }
            
            // Fetch DGAGE balance
            try {
                const dgageBalance = await this.dgageService.getBalance(this.wallet.ethereum.address);
                const dgageTransactions = await this.dgageService.getTransactions(this.wallet.ethereum.address);
                this.wallet.dgage = {
                    address: this.wallet.ethereum.address, // Same as ETH address
                    balance: dgageBalance,
                    balanceUSD: '0.00', // No market price yet
                    transactions: dgageTransactions
                };
                console.log('DGAGE Balance:', dgageBalance);
                console.log('DGAGE Transactions:', dgageTransactions.length);
            } catch (error) {
                console.error('DGAGE balance fetch failed:', error);
            }
            
            // Fetch Polygon (POL) balance
            try {
                const polBalanceRaw = await this.polygonService.getBalance(this.wallet.ethereum.address);
                const polBalance = parseFloat(polBalanceRaw).toFixed(8); // Format to 8 decimals
                const polPrice = await this.polygonService.getPrice();
                const polBalanceUSD = (parseFloat(polBalance) * polPrice).toFixed(2);
                this.wallet.polygon = {
                    address: this.wallet.ethereum.address, // Same as ETH address
                    balance: polBalance,
                    balanceUSD: polBalanceUSD,
                    transactions: [] // Empty for now
                };
                console.log('POL Balance:', polBalance, 'USD:', polBalanceUSD);
            } catch (error) {
                console.error('POL balance fetch failed:', error);
            }
            
            // Scan for additional tokens on Ethereum and Polygon
            try {
                console.log('Scanning for additional tokens...');
                const [ethTokens, polyTokens] = await Promise.all([
                    this.tokenScanner.scanEthereumTokens(this.wallet.ethereum.address),
                    this.tokenScanner.scanPolygonTokens(this.wallet.ethereum.address)
                ]);
                
                // Store detected tokens
                this.wallet.detectedTokens = {
                    ethereum: ethTokens,
                    polygon: polyTokens
                };
                
                console.log('Token scan complete!', ethTokens.length, 'ETH tokens,', polyTokens.length, 'Polygon tokens');
            } catch (error) {
                console.error('Token scan failed:', error);
                this.wallet.detectedTokens = { ethereum: [], polygon: [] };
            }
            
            console.log('Balance fetch complete!');
            
            // Cache the balances
            this.cacheBalances();
            
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            console.log('Using cached balances (if available)');
        }
    }
    
    async getDogePrice() {
        try {
            const response = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/prices?ids=dogecoin');
            const data = await response.json();
            return data.dogecoin?.usd || 0;
        } catch (error) {
            console.error('Failed to fetch Dogecoin price:', error);
            return 0;
        }
    }
    
    async getLtcPrice() {
        try {
            const response = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/prices?ids=litecoin');
            const data = await response.json();
            return data.litecoin?.usd || 0;
        } catch (error) {
            console.error('Failed to fetch DOGE price:', error);
            return 0;
        }
    }
    
    cacheBalances() {
        if (!this.wallet) return;
        
        const cache = {
            ethereum: {
                balance: this.wallet.ethereum.balance,
                balanceUSD: this.wallet.ethereum.balanceUSD
            },
            bitcoin: {
                balance: this.wallet.bitcoin.balance,
                balanceUSD: this.wallet.bitcoin.balanceUSD
            },
            dogecoin: {
                balance: this.wallet.dogecoin.balance,
                balanceUSD: this.wallet.dogecoin.balanceUSD
            },
            tezos: {
                balance: this.wallet.tezos.balance,
                balanceUSD: this.wallet.tezos.balanceUSD
            },
            tron: {
                balance: this.wallet.tron.balance,
                balanceUSD: this.wallet.tron.balanceUSD
            },
            solana: {
                balance: this.wallet.solana.balance,
                balanceUSD: this.wallet.solana.balanceUSD
            },
            timestamp: Date.now()
        };
        
        localStorage.setItem('cachedBalances', JSON.stringify(cache));
        console.log('Balances cached');
    }
    
    loadCachedBalances() {
        try {
            const cached = localStorage.getItem('cachedBalances');
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            
            // Check if cache is less than 5 minutes old
            const age = Date.now() - data.timestamp;
            if (age > 5 * 60 * 1000) {
                console.log('Cache expired');
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Failed to load cached balances:', error);
            return null;
        }
    }
    
    getTotalBalance() {
        if (!this.wallet) return 0;
        
        const btcUSD = parseFloat(this.wallet.bitcoin.balanceUSD) || 0;
        const dogeUSD = parseFloat(this.wallet.dogecoin.balanceUSD) || 0;
        const ltcUSD = parseFloat(this.wallet.litecoin.balanceUSD) || 0;
        const ethUSD = parseFloat(this.wallet.ethereum.balanceUSD) || 0;
        const xtzUSD = parseFloat(this.wallet.tezos.balanceUSD) || 0;
        const trxUSD = parseFloat(this.wallet.tron.balanceUSD) || 0;
        const solUSD = parseFloat(this.wallet.solana.balanceUSD) || 0;
        
        return btcUSD + dogeUSD + ltcUSD + ethUSD + xtzUSD + trxUSD + solUSD;
    }
    
    saveToStorage() {
        // TODO: Implement encrypted storage
        // For now, just store in memory
    }
    
    lock() {
        this.isUnlocked = false;
        sessionStorage.removeItem('walletUnlocked');
    }
    
    isWalletUnlocked() {
        // Check if wallet exists in memory AND unlock flag is set
        return this.wallet !== null && (this.isUnlocked || sessionStorage.getItem('walletUnlocked') === 'true');
    }
    
    getWallet() {
        // Migration: Add dgage property if it doesn't exist
        if (this.wallet && !this.wallet.dgage && this.wallet.ethereum) {
            this.wallet.dgage = {
                address: this.wallet.ethereum.address,
                balance: '0.0000',
                balanceUSD: '0.00',
                transactions: []
            };
        }
        return this.wallet;
    }
}

const walletService = new WalletService();

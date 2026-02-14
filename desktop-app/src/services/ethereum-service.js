/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Ethereum Service - Handle ETH balance and transactions
class EthereumService {
    constructor(infuraApiKey) {
        this.infuraApiKey = infuraApiKey;
        this.provider = null;
        this.cachedPrice = 3000; // Default fallback
        this.setInfuraKey(infuraApiKey);
    }
    
    setInfuraKey(apiKey) {
        this.infuraApiKey = apiKey;
        if (apiKey) {
            this.provider = new window.cryptoLibs.ethers.providers.JsonRpcProvider(
                `https://mainnet.infura.io/v3/${apiKey}`
            );
        }
    }
    
    async getBalance(address) {
        if (!this.provider) {
            throw new Error('Infura provider not initialized');
        }
        
        const { ethers } = window.cryptoLibs;
        const balance = await this.provider.getBalance(address);
        return ethers.utils.formatEther(balance);
    }
    
    async getBalanceUSD(address) {
        const ethBalance = await this.getBalance(address);
        
        // Get ETH price from CoinGecko via worker
        try {
            const response = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/prices?ids=ethereum');
            const data = await response.json();
            const ethPrice = data.ethereum?.usd;
            
            // Only update cached price if we got a valid price > 0
            if (ethPrice && ethPrice > 0) {
                this.cachedPrice = ethPrice;
            }
            
            return {
                balance: parseFloat(ethBalance).toFixed(4),
                balanceUSD: (parseFloat(ethBalance) * this.cachedPrice).toFixed(2),
                price: this.cachedPrice
            };
        } catch (error) {
            console.error('Failed to get ETH price:', error);
            return {
                balance: parseFloat(ethBalance).toFixed(4),
                balanceUSD: (parseFloat(ethBalance) * this.cachedPrice).toFixed(2),
                price: this.cachedPrice
            };
        }
    }
    
    async getTransactions(address) {
        try {
            // Use Etherscan API (free, no key needed for basic queries)
            const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`);
            const data = await response.json();
            
            if (data.status === '1' && data.result) {
                return data.result.map(tx => ({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: (parseInt(tx.value) / 1e18).toFixed(4),
                    timestamp: parseInt(tx.timeStamp) * 1000,
                    type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received'
                }));
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch Ethereum transactions:', error);
            return [];
        }
    }
    
    deriveAddress(mnemonic) {
        const { ethers } = window.cryptoLibs;
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        return {
            address: wallet.address,
            privateKey: wallet.privateKey
        };
    }
}

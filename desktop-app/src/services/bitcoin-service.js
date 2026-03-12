/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Bitcoin Service - Handle BTC balance and address derivation
class BitcoinService {
    constructor() {
        this.cachedPrice = 95000; // Default fallback
    }
    
    async getBalance(address) {
        try {
            // Use blockchain.info API (more reliable, no rate limits)
            const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
            const satoshis = await response.text();
            return (parseInt(satoshis) / 100000000).toFixed(8);
        } catch (error) {
            console.error('Failed to fetch Bitcoin balance:', error);
            return '0.00000000';
        }
    }
    
    async getBalanceUSD(address) {
        const btcBalance = await this.getBalance(address);
        
        // Get BTC price from CoinGecko via worker
        try {
            const response = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/prices?ids=bitcoin');
            const data = await response.json();
            const btcPrice = data.bitcoin?.usd || this.cachedPrice || 95000;
            
            // Cache the price
            if (btcPrice > 0) {
                this.cachedPrice = btcPrice;
            }
            
            return {
                balance: btcBalance,
                balanceUSD: (parseFloat(btcBalance) * btcPrice).toFixed(2),
                price: btcPrice
            };
        } catch (error) {
            console.error('Failed to get BTC price:', error);
            // Use cached or fallback price
            const fallbackPrice = this.cachedPrice || 95000;
            return {
                balance: btcBalance,
                balanceUSD: (parseFloat(btcBalance) * fallbackPrice).toFixed(2),
                price: fallbackPrice
            };
        }
    }
    
    deriveAddress(mnemonic) {
        const { ethers, bitcoin } = window.cryptoLibs;
        
        // Convert mnemonic to seed
        const seed = ethers.utils.mnemonicToSeed(mnemonic);
        const seedBuffer = Buffer.from(seed.slice(2), 'hex');
        
        // Derive using BIP44 path for Bitcoin: m/44'/0'/0'/0/0
        const root = bitcoin.bip32.fromSeed(seedBuffer);
        const child = root.derivePath("m/44'/0'/0'/0/0");
        
        // Generate Legacy P2PKH address (starts with 1)
        const { address } = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
            network: bitcoin.networks.bitcoin
        });
        
        return {
            address: address,
            publicKey: child.publicKey.toString('hex')
        };
    }
    
    publicKeyToP2PKH(publicKeyHex) {
        // Not needed anymore - using bitcoinjs-lib directly
        return null;
    }
    
    async getTransactions(address) {
        try {
            // Use blockchain.info API
            const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=10`);
            const data = await response.json();
            
            if (data.txs) {
                return data.txs.map(tx => {
                    const isSent = tx.inputs.some(input => input.prev_out && input.prev_out.addr === address);
                    const value = isSent 
                        ? tx.inputs.reduce((sum, input) => input.prev_out && input.prev_out.addr === address ? sum + input.prev_out.value : sum, 0)
                        : tx.out.reduce((sum, output) => output.addr === address ? sum + output.value : sum, 0);
                    
                    return {
                        hash: tx.hash,
                        value: (value / 100000000).toFixed(8),
                        timestamp: tx.time * 1000,
                        type: isSent ? 'sent' : 'received'
                    };
                });
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch Bitcoin transactions:', error);
            return [];
        }
    }
}

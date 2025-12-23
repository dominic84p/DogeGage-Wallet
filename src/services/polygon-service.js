class PolygonService {
    constructor() {
        this.rpcUrl = 'https://polygon-rpc.com';
        this.cachedPrice = 0.11; // Default fallback
    }

    getProvider() {
        if (!window.cryptoLibs || !window.cryptoLibs.ethers) {
            throw new Error('Ethers library not loaded');
        }
        const { ethers } = window.cryptoLibs;
        return new ethers.providers.JsonRpcProvider(this.rpcUrl);
    }

    async getAddress(mnemonic) {
        const { ethers } = window.cryptoLibs;
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        return wallet.address;
    }

    async getBalance(address) {
        try {
            const provider = this.getProvider();
            const { ethers } = window.cryptoLibs;
            const balance = await provider.getBalance(address);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Error fetching POL balance:', error);
            return '0';
        }
    }

    async getPrice() {
        try {
            const response = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/prices?ids=matic-network');
            const data = await response.json();
            const price = data['matic-network']?.usd;
            
            // Only update cached price if we got a valid price > 0
            if (price && price > 0) {
                this.cachedPrice = price;
            }
            
            return this.cachedPrice;
        } catch (error) {
            console.error('Error fetching POL price:', error);
            return this.cachedPrice;
        }
    }

    async sendTransaction(mnemonic, toAddress, amount) {
        try {
            const { ethers } = window.cryptoLibs;
            const provider = this.getProvider();
            const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
            
            const tx = {
                to: toAddress,
                value: ethers.utils.parseEther(amount.toString())
            };

            const transaction = await wallet.sendTransaction(tx);
            await transaction.wait();
            
            return transaction.hash;
        } catch (error) {
            console.error('Error sending POL:', error);
            throw error;
        }
    }

    async estimateFee(toAddress, amount) {
        try {
            const { ethers } = window.cryptoLibs;
            const provider = this.getProvider();
            const wallet = ethers.Wallet.fromMnemonic('test test test test test test test test test test test junk').connect(provider);
            
            const tx = {
                to: toAddress,
                value: ethers.utils.parseEther(amount.toString())
            };

            const gasEstimate = await wallet.estimateGas(tx);
            const gasPrice = await provider.getGasPrice();
            const gasCost = gasEstimate.mul(gasPrice);
            
            return ethers.utils.formatEther(gasCost);
        } catch (error) {
            console.error('Error estimating POL fee:', error);
            return '0.001'; // Default estimate
        }
    }
    
    async getTransactions(address) {
        try {
            const response = await fetch(`https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`);
            const data = await response.json();
            
            if (data.status === '1' && data.result) {
                const { ethers } = window.cryptoLibs;
                return data.result.map(tx => ({
                    hash: tx.hash,
                    timestamp: parseInt(tx.timeStamp) * 1000,
                    type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
                    value: ethers.utils.formatEther(tx.value)
                }));
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch Polygon transactions:', error);
            return [];
        }
    }
}

// DogeGage Token (DGAGE) Service
class DGAGEService {
    constructor() {
        this.contractAddress = '0x9b359461EDdCEd424e37c1b3d2e54c875a5a319D';
        this.rpcUrl = 'https://polygon-rpc.com';
        this.abi = [
            "function balanceOf(address account) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
            "function transfer(address to, uint256 amount) returns (bool)"
        ];
    }

    async getBalance(address) {
        try {
            // Use ethers v5 syntax
            const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
            const contract = new ethers.Contract(this.contractAddress, this.abi, provider);
            
            const balance = await contract.balanceOf(address);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Failed to fetch DGAGE balance:', error);
            return '0';
        }
    }

    async getBalanceUSD(address) {
        // DGAGE doesn't have a market price yet, return 0
        return 0;
    }

    async sendDGAGE(privateKey, toAddress, amount) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
            const wallet = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract(this.contractAddress, this.abi, wallet);

            const amountWei = ethers.utils.parseEther(amount.toString());
            
            // Get current gas price from network
            const feeData = await provider.getFeeData();
            
            // Use higher gas prices for Polygon (minimum 30 Gwei)
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas && feeData.maxPriorityFeePerGas.gt(ethers.utils.parseUnits('30', 'gwei'))
                ? feeData.maxPriorityFeePerGas
                : ethers.utils.parseUnits('30', 'gwei');
            
            const maxFeePerGas = feeData.maxFeePerGas && feeData.maxFeePerGas.gt(ethers.utils.parseUnits('50', 'gwei'))
                ? feeData.maxFeePerGas
                : ethers.utils.parseUnits('50', 'gwei');
            
            // Send transaction with proper gas settings
            const tx = await contract.transfer(toAddress, amountWei, {
                maxPriorityFeePerGas: maxPriorityFeePerGas,
                maxFeePerGas: maxFeePerGas
            });
            
            console.log('DGAGE transaction sent successfully');
            
            const receipt = await tx.wait();
            
            return {
                success: true,
                txHash: tx.hash,
                explorerUrl: `https://polygonscan.com/tx/${tx.hash}`
            };
        } catch (error) {
            console.error('DGAGE send error:', error);
            
            // Check if it's a gas estimation error
            if (error.message.includes('insufficient funds')) {
                throw new Error('Insufficient POL for gas fees. Please add POL to your wallet.');
            } else if (error.message.includes('gas')) {
                throw new Error('Gas estimation failed: ' + error.message);
            }
            
            throw new Error('Failed to send DGAGE: ' + error.message);
        }
    }

    async getTransactions(address) {
        try {
            // Use Polygonscan API to get ERC-20 token transfers
            const response = await fetch(
                `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=${this.contractAddress}&address=${address}&page=1&offset=10&sort=desc`
            );
            const data = await response.json();
            
            if (data.status === '1' && data.result && Array.isArray(data.result)) {
                return data.result.map(tx => ({
                    hash: tx.hash,
                    timestamp: parseInt(tx.timeStamp) * 1000,
                    type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
                    value: (parseInt(tx.value) / 1e18).toFixed(2)
                }));
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch DGAGE transactions:', error);
            return [];
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DGAGEService;
}

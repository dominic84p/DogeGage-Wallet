// Ethereum Send Service
async function sendEthereum(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');
        
        const { ethers } = window.cryptoLibs;
        
        // Use the Infura key from wallet service
        if (!walletService.infuraApiKey) {
            throw new Error('Infura API key not configured');
        }
        
        // Create provider
        const provider = new ethers.providers.InfuraProvider('mainnet', walletService.infuraApiKey);
        
        // Create wallet from private key
        const ethWallet = new ethers.Wallet(wallet.ethereum.privateKey, provider);
        
        // Convert amount to wei
        const amountWei = ethers.utils.parseEther(amount);
        
        // Get gas price
        const gasPrice = await provider.getGasPrice();
        
        // Create transaction
        const tx = {
            to: toAddress,
            value: amountWei,
            gasLimit: 21000,
            gasPrice: gasPrice
        };
        
        // Send transaction
        const transaction = await ethWallet.sendTransaction(tx);
        
        console.log('Ethereum transaction sent successfully');
        
        // Wait for confirmation
        await transaction.wait();
        
        return transaction.hash;
        
    } catch (error) {
        console.error('Ethereum send error:', error);
        throw error;
    }
}

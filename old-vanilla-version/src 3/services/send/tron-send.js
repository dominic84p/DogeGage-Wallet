// Tron Send Service
async function sendTron(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');
        
        const mnemonic = wallet.mnemonic;
        const { ethers } = window.cryptoLibs;
        
        // Derive Tron private key (same as Ethereum derivation)
        const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
        const child = hdNode.derivePath("m/44'/195'/0'/0/0");
        const privateKey = child.privateKey.slice(2); // Remove 0x prefix
        
        // Initialize TronWeb
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            privateKey: privateKey
        });
        
        // Convert amount to SUN (1 TRX = 1,000,000 SUN)
        const amountSun = Math.floor(parseFloat(amount) * 1000000);
        
        // Create transaction
        const transaction = await tronWeb.transactionBuilder.sendTrx(
            toAddress,
            amountSun,
            wallet.tron.address
        );
        
        // Sign transaction
        const signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
        
        // Broadcast transaction
        const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
        
        if (result.result) {
            console.log('Tron transaction sent successfully');
            return result.txid;
        } else {
            throw new Error('Transaction failed: ' + JSON.stringify(result));
        }
        
    } catch (error) {
        console.error('Tron send error:', error);
        throw error;
    }
}

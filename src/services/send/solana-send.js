// Solana Send Service
async function sendSolana(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');
        
        const mnemonic = wallet.mnemonic;
        
        // Get sender's keypair
        const keys = await getTezosEd25519Keys(mnemonic, "m/44'/501'/0'/0'");
        const privateKey = keys.privateKey.slice(0, 32); // First 32 bytes is the seed
        const keypair = nacl.sign.keyPair.fromSeed(privateKey);
        
        // Convert amount to lamports (1 SOL = 1,000,000,000 lamports)
        const lamports = Math.floor(parseFloat(amount) * 1000000000);
        
        // Setup Solana connection
        const heliusApiKey = '5ac9b25a-b6e1-4157-9723-3dfe6eef1723';
        const rpcEndpoint = `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`;
        const connection = new solanaWeb3.Connection(rpcEndpoint, 'confirmed');
        
        // Create keypair from our keys
        const fromKeypair = solanaWeb3.Keypair.fromSecretKey(keypair.secretKey);
        const toPubkey = new solanaWeb3.PublicKey(toAddress);
        
        // Create transaction
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPubkey,
                lamports: lamports
            })
        );
        
        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromKeypair.publicKey;
        
        // Sign transaction
        transaction.sign(fromKeypair);
        
        // Send transaction
        const signature = await connection.sendRawTransaction(transaction.serialize());
        
        // Wait for confirmation
        await connection.confirmTransaction(signature);
        
        console.log('Solana transaction sent successfully');
        return signature;
        
    } catch (error) {
        console.error('Solana send error:', error);
        throw error;
    }
}

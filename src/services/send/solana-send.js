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
        // Use our secure worker proxy to hide the API key
        const rpcEndpoint = 'https://wallet-api.therealdominic84plays.workers.dev/api/solana/rpc';
        const connection = new solanaWeb3.Connection(rpcEndpoint, 'confirmed');

        // Create keypair from our keys
        const fromKeypair = solanaWeb3.Keypair.fromSecretKey(keypair.secretKey);
        const toPubkey = new solanaWeb3.PublicKey(toAddress);

        // Get current balance
        const balance = await connection.getBalance(fromKeypair.publicKey);
        const estimatedFee = 5000; // Standard SOL fee (0.000005 SOL)

        let sendLamports = lamports;

        // If sending max (or close to it), deduct fee
        if (sendLamports + estimatedFee > balance) {
            console.log('Adjusting amount for fees...');
            sendLamports = balance - estimatedFee;
            if (sendLamports <= 0) {
                throw new Error('Insufficient funds to pay transaction fee');
            }
        }

        // Create transaction
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPubkey,
                lamports: sendLamports
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

// Solana Send Service
// SECURITY: Derives keypair on-demand, clears after use
import { walletService } from '../wallet-service';
import { deriveSolanaKeypair } from '../key-derivation-service';

export async function sendSolana(toAddress, amount) {
    let keypair = null;
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');

        // SECURITY: Derive keypair on-demand (no longer reads wallet.mnemonic)
        keypair = await deriveSolanaKeypair();

        // Convert amount to lamports (1 SOL = 1,000,000,000 lamports)
        const lamports = Math.floor(parseFloat(amount) * 1000000000);

        // Setup Solana connection via worker proxy
        const rpcEndpoint = 'https://api.rivarawallet.xyz/api/solana/rpc';
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

        return signature;

    } catch (error) {
        throw error;
    } finally {
        // SECURITY: Clear key material
        keypair = null;
    }
}

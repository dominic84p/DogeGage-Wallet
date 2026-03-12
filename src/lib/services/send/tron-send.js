// Tron Send Service
// SECURITY: Derives private key on-demand, clears after use
import { walletService } from '../wallet-service';
import { deriveTronPrivateKey } from '../key-derivation-service';

export async function sendTron(toAddress, amount) {
    let privateKey = null;
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');

        // SECURITY: Derive private key on-demand (no longer reads wallet.mnemonic)
        privateKey = await deriveTronPrivateKey();

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
            return result.txid;
        } else {
            throw new Error('Transaction failed: ' + JSON.stringify(result));
        }

    } catch (error) {
        throw error;
    } finally {
        // SECURITY: Clear key material
        privateKey = null;
    }
}

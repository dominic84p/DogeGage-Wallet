async function sendPolygon(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');

        const mnemonic = wallet.mnemonic;
        const polygonService = new PolygonService();

        const txHash = await polygonService.sendTransaction(mnemonic, toAddress, amount);
        return txHash;
    } catch (error) {
        console.error('Error sending POL:', error);
        throw error;
    }
}

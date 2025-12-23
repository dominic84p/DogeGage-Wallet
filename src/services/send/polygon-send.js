async function sendPolygon(toAddress, amount) {
    try {
        const mnemonic = await walletService.getMnemonic();
        const polygonService = new PolygonService();
        
        const txHash = await polygonService.sendTransaction(mnemonic, toAddress, amount);
        return txHash;
    } catch (error) {
        console.error('Error sending POL:', error);
        throw error;
    }
}

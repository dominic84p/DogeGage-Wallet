// Litecoin Send Service
async function sendLitecoin(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');
        
        const mnemonic = wallet.mnemonic;
        const { ethers, bitcoin } = window.cryptoLibs;
        
        // Derive Litecoin keypair
        const seed = ethers.utils.mnemonicToSeed(mnemonic);
        const seedBuffer = Buffer.from(seed.slice(2), 'hex');
        const root = bitcoin.bip32.fromSeed(seedBuffer);
        const child = root.derivePath("m/44'/2'/0'/0/0");
        
        const fromAddress = wallet.litecoin.address;
        const amountSatoshis = Math.floor(parseFloat(amount) * 100000000);
        
        // Litecoin network parameters
        const litecoinNetwork = {
            messagePrefix: '\x19Litecoin Signed Message:\n',
            bech32: 'ltc',
            bip32: {
                public: 0x019da462,
                private: 0x019d9cfe
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0
        };
        
        // Fetch UTXOs from Blockchair via worker
        const utxoResponse = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/litecoin/${fromAddress}`);
        const utxoData = await utxoResponse.json();
        
        if (!utxoData.data || !utxoData.data[fromAddress]) {
            throw new Error('Failed to fetch UTXOs');
        }
        
        const utxos = utxoData.data[fromAddress].utxo || [];
        
        if (utxos.length === 0) {
            throw new Error('No UTXOs available');
        }
        
        // Calculate fee (Litecoin has low fees, ~0.001 LTC typical)
        const fee = 100000; // 0.001 LTC in satoshis
        
        // Select UTXOs
        let inputSum = 0;
        const selectedUtxos = [];
        
        for (const utxo of utxos) {
            selectedUtxos.push(utxo);
            inputSum += utxo.value;
            
            if (inputSum >= amountSatoshis + fee) {
                break;
            }
        }
        
        if (inputSum < amountSatoshis + fee) {
            throw new Error(`Insufficient funds. Need ${amountSatoshis + fee} satoshis, have ${inputSum}`);
        }
        
        // Build transaction
        const psbt = new bitcoin.Psbt({ network: litecoinNetwork });
        
        // Add inputs
        for (const utxo of selectedUtxos) {
            psbt.addInput({
                hash: utxo.transaction_hash,
                index: utxo.index,
                witnessUtxo: {
                    script: Buffer.from(utxo.script_hex, 'hex'),
                    value: utxo.value,
                },
            });
        }
        
        // Add output (recipient)
        psbt.addOutput({
            address: toAddress,
            value: amountSatoshis,
        });
        
        // Add change output if needed
        const change = inputSum - amountSatoshis - fee;
        if (change > 100000) { // 0.001 LTC dust threshold
            psbt.addOutput({
                address: fromAddress,
                value: change,
            });
        }
        
        // Sign all inputs
        for (let i = 0; i < selectedUtxos.length; i++) {
            psbt.signInput(i, child);
        }
        
        // Finalize and extract transaction
        psbt.finalizeAllInputs();
        const txHex = psbt.extractTransaction().toHex();
        
        // Broadcast transaction via worker
        const broadcastResponse = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/litecoin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: txHex })
        });
        
        const broadcastData = await broadcastResponse.json();
        
        if (broadcastData.data && broadcastData.data.transaction_hash) {
            console.log('Litecoin transaction sent:', broadcastData.data.transaction_hash);
            return broadcastData.data.transaction_hash;
        } else {
            throw new Error('Broadcast failed: ' + JSON.stringify(broadcastData));
        }
        
    } catch (error) {
        console.error('Litecoin send error:', error);
        throw error;
    }
}

// Dogecoin Send Service
async function sendDogecoin(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');

        const mnemonic = wallet.mnemonic;
        const { ethers, bitcoin } = window.cryptoLibs;

        // Derive Dogecoin keypair
        const seed = ethers.utils.mnemonicToSeed(mnemonic);
        const seedBuffer = Buffer.from(seed.slice(2), 'hex');
        const root = bitcoin.bip32.fromSeed(seedBuffer);
        const child = root.derivePath("m/44'/3'/0'/0/0");

        const fromAddress = wallet.dogecoin.address;
        const amountSatoshis = Math.floor(parseFloat(amount) * 100000000);

        // Dogecoin network parameters
        const dogecoinNetwork = {
            messagePrefix: '\x19Dogecoin Signed Message:\n',
            bech32: 'doge',
            bip32: {
                public: 0x02facafd,
                private: 0x02fac398
            },
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e
        };

        // Fetch UTXOs from Blockchair via worker
        let utxos = [];
        try {
            const utxoResponse = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/dogecoin/${fromAddress}`);
            const utxoData = await utxoResponse.json();

            if (utxoData.data && utxoData.data[fromAddress] && utxoData.data[fromAddress].utxo) {
                utxos = utxoData.data[fromAddress].utxo;
            }
        } catch (err) {
            console.warn('Blockchair UTXO fetch failed, trying fallback...', err);
        }

        // Fallback to BlockCypher if no UTXOs found
        if (utxos.length === 0) {
            console.log('Trying BlockCypher for UTXOs...');
            try {
                // Determine network prefix for BlockCypher (doge mainnet)
                const cypherRes = await fetch(`https://api.blockcypher.com/v1/doge/main/addrs/${fromAddress}?unspentOnly=true&includeScript=true`);
                const cypherData = await cypherRes.json();

                if (cypherData.txrefs) {
                    utxos = cypherData.txrefs.map(tx => ({
                        transaction_hash: tx.tx_hash,
                        index: tx.tx_output_n,
                        value: tx.value,
                        script_hex: tx.script
                    }));
                } else if (cypherData.final_balance > 0 && cypherData.unconfirmed_txrefs) {
                    utxos = cypherData.unconfirmed_txrefs.map(tx => ({
                        transaction_hash: tx.tx_hash,
                        index: tx.tx_output_n,
                        value: tx.value,
                        script_hex: tx.script
                    }));
                }
            } catch (err) {
                console.error('BlockCypher UTXO fetch failed:', err);
            }
        }

        if (utxos.length === 0) {
            throw new Error('No UTXOs available. Please wait for previous transactions to confirm.');
        }

        // Calculate fee (Dogecoin has lower fees, ~1 DOGE typical)
        const fee = 100000000; // 1 DOGE in satoshis

        let sendAmountSatoshis = amountSatoshis;

        // Select UTXOs
        let inputSum = 0;
        const selectedUtxos = [];

        for (const utxo of utxos) {
            selectedUtxos.push(utxo);
            inputSum += utxo.value;
            if (inputSum >= sendAmountSatoshis + fee) {
                break;
            }
        }

        // "Send Max" Logic
        if (inputSum < sendAmountSatoshis + fee) {
            if (inputSum > fee) {
                console.log("Adjusting amount for max send...");
                sendAmountSatoshis = inputSum - fee;
            } else {
                throw new Error(`Insufficient funds. Need ${sendAmountSatoshis + fee} satoshis, have ${inputSum}`);
            }
        }

        // Build transaction
        const psbt = new bitcoin.Psbt({ network: dogecoinNetwork });

        // Add inputs
        // FIX: Legacy inputs need nonWitnessUtxo (full tx hex)
        for (const utxo of selectedUtxos) {

            let nonWitnessUtxoBuffer = null;

            try {
                const txRes = await fetch(`https://api.blockcypher.com/v1/doge/main/txs/${utxo.transaction_hash}?includeHex=true`);
                const txData = await txRes.json();
                if (txData && txData.hex) {
                    nonWitnessUtxoBuffer = Buffer.from(txData.hex, 'hex');
                }
            } catch (e) {
                console.warn('Failed to fetch raw tx for input signing', e);
            }

            if (!nonWitnessUtxoBuffer) {
                throw new Error(`Could not fetch full transaction hex for input ${utxo.transaction_hash}`);
            }

            psbt.addInput({
                hash: utxo.transaction_hash,
                index: utxo.index,
                nonWitnessUtxo: nonWitnessUtxoBuffer,
            });
        }

        // Add output (recipient)
        psbt.addOutput({
            address: toAddress,
            value: sendAmountSatoshis,
        });

        // Add change output if needed
        const change = inputSum - sendAmountSatoshis - fee;
        if (change > 100000000) { // 1 DOGE dust threshold
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
        const broadcastResponse = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/dogecoin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: txHex })
        });

        const broadcastData = await broadcastResponse.json();

        if (broadcastData.data && broadcastData.data.transaction_hash) {
            console.log('Dogecoin transaction sent successfully');
            return broadcastData.data.transaction_hash;
        } else {
            throw new Error('Broadcast failed: ' + JSON.stringify(broadcastData));
        }

    } catch (error) {
        console.error('Dogecoin send error:', error);
        throw error;
    }
}

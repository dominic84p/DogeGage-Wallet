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
        let utxos = [];
        try {
            const utxoResponse = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/litecoin/${fromAddress}`);
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
                const cypherRes = await fetch(`https://api.blockcypher.com/v1/ltc/main/addrs/${fromAddress}?unspentOnly=true&includeScript=true`);
                const cypherData = await cypherRes.json();

                if (cypherData.txrefs) {
                    // Map BlockCypher format to Blockchair format
                    utxos = cypherData.txrefs.map(tx => ({
                        transaction_hash: tx.tx_hash,
                        index: tx.tx_output_n,
                        value: tx.value,
                        script_hex: tx.script // BlockCypher returns script if includeScript=true
                    }));
                } else if (cypherData.final_balance > 0 && !cypherData.txrefs) {
                    // Sometimes BlockCypher puts unspent outputs in 'unconfirmed_txrefs'
                    if (cypherData.unconfirmed_txrefs) {
                        utxos = cypherData.unconfirmed_txrefs.map(tx => ({
                            transaction_hash: tx.tx_hash,
                            index: tx.tx_output_n,
                            value: tx.value,
                            script_hex: tx.script
                        }));
                    }
                }
            } catch (err) {
                console.error('BlockCypher UTXO fetch failed:', err);
            }
        }

        if (utxos.length === 0) {
            throw new Error('No UTXOs available. Please wait for previous transactions to confirm.');
        }

        // Calculate fee (Litecoin has low fees, ~0.001 LTC typical)
        const fee = 100000; // 0.001 LTC in satoshis

        let sendAmountSatoshis = amountSatoshis;

        // Select UTXOs
        let inputSum = 0;
        const selectedUtxos = [];

        // Accumulate UTXOs until we have enough
        for (const utxo of utxos) {
            selectedUtxos.push(utxo);
            inputSum += utxo.value;
            if (inputSum >= sendAmountSatoshis + fee) {
                break;
            }
        }

        // "Send Max" Logic: If we are sending nearly everything, deduct fee
        if (inputSum < sendAmountSatoshis + fee) {
            // Check if we are trying to send everything we have (or close to it)
            // If total inputs are enough to cover the fee at least...
            if (inputSum > fee) {
                console.log("Adjusting amount for max send...");
                // Set amount to Total - Fee
                sendAmountSatoshis = inputSum - fee;
            } else {
                throw new Error(`Insufficient funds. Need ${sendAmountSatoshis + fee} satoshis, have ${inputSum}`);
            }
        }

        // Build transaction
        const psbt = new bitcoin.Psbt({ network: litecoinNetwork });

        // Add inputs
        // FIX: For Legacy (non-segwit) inputs, we need nonWitnessUtxo (full tx hex)
        // witnessUtxo is ONLY for proper SegWit inputs.
        for (const utxo of selectedUtxos) {

            // We need to fetch the full transaction hex for this UTXO
            // Try BlockCypher for raw hex (it's reliable for this)
            let nonWitnessUtxoBuffer = null;

            try {
                const txRes = await fetch(`https://api.blockcypher.com/v1/ltc/main/txs/${utxo.transaction_hash}?includeHex=true`);
                const txData = await txRes.json();
                if (txData && txData.hex) {
                    nonWitnessUtxoBuffer = Buffer.from(txData.hex, 'hex');
                }
            } catch (e) {
                console.warn('Failed to fetch raw tx for input signing', e);
            }

            if (!nonWitnessUtxoBuffer) {
                throw new Error(`Could not fetch full transaction hex for input ${utxo.transaction_hash}. Required for legacy signing.`);
            }

            psbt.addInput({
                hash: utxo.transaction_hash,
                index: utxo.index,
                nonWitnessUtxo: nonWitnessUtxoBuffer, // CRITICAL FIX for Legacy Addresses
                // witnessUtxo: ... REMOVED because it causes "non-segwit script" error
            });
        }

        // Add output (recipient)
        psbt.addOutput({
            address: toAddress,
            value: sendAmountSatoshis,
        });

        // Add change output if needed
        const change = inputSum - sendAmountSatoshis - fee;
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

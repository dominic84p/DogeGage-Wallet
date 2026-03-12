// Bitcoin Send Service
async function sendBitcoin(toAddress, amount) {
    try {
        const wallet = walletService.getWallet();
        if (!wallet) throw new Error('Wallet not found');

        const mnemonic = wallet.mnemonic;
        const { ethers, bitcoin } = window.cryptoLibs;

        // Derive Bitcoin keypair
        const seed = ethers.utils.mnemonicToSeed(mnemonic);
        const seedBuffer = Buffer.from(seed.slice(2), 'hex');
        const root = bitcoin.bip32.fromSeed(seedBuffer);
        const child = root.derivePath("m/44'/0'/0'/0/0");

        const fromAddress = wallet.bitcoin.address;
        const amountSatoshis = Math.floor(parseFloat(amount) * 100000000);

        console.log('Sending Bitcoin transaction...');

        // Try Blockchair first
        let utxos = [];
        try {
            const utxoUrl = `https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/bitcoin/${fromAddress}`;

            const utxoResponse = await fetch(utxoUrl);
            const utxoData = await utxoResponse.json();

            if (utxoData.data && utxoData.data[fromAddress] && utxoData.data[fromAddress].utxo) {
                utxos = utxoData.data[fromAddress].utxo;
            }
        } catch (error) {
            console.warn('Blockchair failed, trying blockchain.info:', error);
        }

        // Fallback to blockchain.info if Blockchair fails
        if (utxos.length === 0) {
            try {
                const response = await fetch(`https://blockchain.info/unspent?active=${fromAddress}`);
                const data = await response.json();

                if (data.unspent_outputs) {
                    // Convert blockchain.info format to Blockchair format
                    utxos = data.unspent_outputs.map(utxo => ({
                        transaction_hash: utxo.tx_hash_big_endian,
                        index: utxo.tx_output_n,
                        value: utxo.value
                    }));
                }
            } catch (error) {
                console.error('Blockchain.info also failed:', error);
            }
        }

        if (utxos.length === 0) {
            throw new Error('No UTXOs available - wallet may be empty or APIs are down');
        }

        // Calculate fee (estimate 10 sat/byte, ~250 bytes for typical tx)
        const feePerByte = 10;
        const estimatedSize = 250;
        const fee = feePerByte * estimatedSize;

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

        // Adjust amount for send-max scenario (like dogecoin/litecoin)
        let sendAmountSatoshis = amountSatoshis;
        if (inputSum < sendAmountSatoshis + fee) {
            // Not enough for amount + fee, try to send max (amount minus fee)
            if (inputSum > fee) {
                sendAmountSatoshis = inputSum - fee;
                console.log(`Adjusting BTC send amount for fees: ${amountSatoshis} -> ${sendAmountSatoshis} satoshis`);
            } else {
                throw new Error(`Insufficient funds. Need ${amountSatoshis + fee} satoshis, have ${inputSum}`);
            }
        }

        // Build transaction
        const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });

        // Add inputs
        for (const utxo of selectedUtxos) {
            // For blockchain.info UTXOs, we need to fetch the full transaction
            if (!utxo.script_hex) {
                try {
                    const txResponse = await fetch(`https://blockchain.info/rawtx/${utxo.transaction_hash}?format=hex`);
                    const txHex = await txResponse.text();

                    // For legacy addresses, use nonWitnessUtxo (full transaction)
                    psbt.addInput({
                        hash: utxo.transaction_hash,
                        index: utxo.index,
                        nonWitnessUtxo: Buffer.from(txHex, 'hex'),
                    });
                } catch (error) {
                    console.error('Failed to fetch transaction for UTXO:', error);
                    throw new Error('Failed to build transaction - could not fetch UTXO details');
                }
            } else {
                // Check if it's a legacy script (P2PKH starts with 76a914)
                const isLegacy = utxo.script_hex.startsWith('76a914');

                if (isLegacy) {
                    // For legacy, we need the full transaction
                    try {
                        const txResponse = await fetch(`https://blockchain.info/rawtx/${utxo.transaction_hash}?format=hex`);
                        const txHex = await txResponse.text();

                        psbt.addInput({
                            hash: utxo.transaction_hash,
                            index: utxo.index,
                            nonWitnessUtxo: Buffer.from(txHex, 'hex'),
                        });
                    } catch (error) {
                        console.error('Failed to fetch transaction for legacy UTXO:', error);
                        throw new Error('Failed to build transaction - could not fetch UTXO details');
                    }
                } else {
                    // SegWit address
                    psbt.addInput({
                        hash: utxo.transaction_hash,
                        index: utxo.index,
                        witnessUtxo: {
                            script: Buffer.from(utxo.script_hex, 'hex'),
                            value: utxo.value,
                        },
                    });
                }
            }
        }

        // Add output (recipient)
        psbt.addOutput({
            address: toAddress,
            value: sendAmountSatoshis,
        });

        // Add change output if needed
        const change = inputSum - sendAmountSatoshis - fee;
        if (change > 546) { // Dust threshold
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

        // Try broadcasting via Blockchair first
        let txHash = null;
        try {
            const broadcastResponse = await fetch('https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/bitcoin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: txHex })
            });

            const broadcastData = await broadcastResponse.json();

            if (broadcastData.data && broadcastData.data.transaction_hash) {
                console.log('Bitcoin transaction sent successfully');
                txHash = broadcastData.data.transaction_hash;
            } else if (broadcastData.context && broadcastData.context.error) {
                console.warn('Blockchair broadcast failed:', broadcastData.context.error);
            }
        } catch (error) {
            console.warn('Blockchair broadcast error:', error);
        }

        // Fallback to blockchain.info if Blockchair failed
        if (!txHash) {
            try {
                const response = await fetch('https://blockchain.info/pushtx', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `tx=${txHex}`
                });

                const result = await response.text();

                // blockchain.info returns the tx hash on success
                if (result && !result.includes('error')) {
                    txHash = psbt.extractTransaction().getId();
                    console.log('Bitcoin transaction sent successfully');
                } else {
                    throw new Error('Broadcast failed: ' + result);
                }
            } catch (error) {
                console.error('Blockchain.info broadcast also failed:', error);
                throw new Error('All broadcast methods failed. Transaction may be invalid.');
            }
        }

        if (!txHash) {
            throw new Error('Broadcast failed - no transaction hash returned');
        }

        return txHash;

    } catch (error) {
        console.error('Bitcoin send error:', error);
        throw error;
    }
}

// Litecoin Service
class LitecoinService {
    // Derive Litecoin address from seed phrase
    // Litecoin uses BIP44 path: m/44'/2'/0'/0/0
    deriveAddress(seedPhrase) {
        try {
            const { ethers, bitcoin } = window.cryptoLibs;
            
            // Convert mnemonic to seed
            const seed = ethers.utils.mnemonicToSeed(seedPhrase);
            const seedBuffer = Buffer.from(seed.slice(2), 'hex');
            
            // Create HD wallet from seed
            const root = bitcoin.bip32.fromSeed(seedBuffer);
            
            // Derive Litecoin path: m/44'/2'/0'/0/0
            const path = "m/44'/2'/0'/0/0";
            const child = root.derivePath(path);
            
            // Litecoin mainnet parameters
            const litecoinNetwork = {
                messagePrefix: '\x19Litecoin Signed Message:\n',
                bech32: 'ltc',
                bip32: {
                    public: 0x019da462,  // Ltub
                    private: 0x019d9cfe  // Ltpv
                },
                pubKeyHash: 0x30,  // Addresses start with 'L'
                scriptHash: 0x32,  // M-addresses (multisig)
                wif: 0xb0
            };
            
            // Generate P2PKH address (starts with L)
            const { address } = bitcoin.payments.p2pkh({
                pubkey: child.publicKey,
                network: litecoinNetwork
            });
            
            return address;
        } catch (error) {
            console.error('Litecoin derivation error:', error);
            throw error;
        }
    }
    
    // Get Litecoin balance from API
    async getBalance(address) {
        try {
            // Use worker proxy for Blockchair
            const response = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/litecoin/${address}`);
            const data = await response.json();
            
            if (data && data.data && data.data[address]) {
                const balanceSatoshis = data.data[address].address.balance;
                const balance = balanceSatoshis / 100000000; // Convert from satoshis to LTC
                return balance.toFixed(8);
            }
            
            return '0.00000000';
        } catch (error) {
            console.error('Failed to fetch Litecoin balance:', error);
            return '0.00000000';
        }
    }
    
    async getTransactions(address) {
        try {
            // Use BlockCypher for detailed transaction info
            const response = await fetch(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}/full?limit=10`);
            const data = await response.json();
            
            if (data && data.txs && Array.isArray(data.txs)) {
                return data.txs.map(tx => {
                    // Determine if sent or received
                    const isSent = tx.inputs.some(input => input.addresses && input.addresses.includes(address));
                    
                    // Calculate value
                    let value = 0;
                    if (isSent) {
                        // Sum inputs from this address
                        value = tx.inputs
                            .filter(input => input.addresses && input.addresses.includes(address))
                            .reduce((sum, input) => sum + (input.output_value || 0), 0);
                    } else {
                        // Sum outputs to this address
                        value = tx.outputs
                            .filter(output => output.addresses && output.addresses.includes(address))
                            .reduce((sum, output) => sum + (output.value || 0), 0);
                    }
                    
                    return {
                        hash: tx.hash,
                        timestamp: new Date(tx.confirmed || tx.received).getTime(),
                        type: isSent ? 'sent' : 'received',
                        value: (value / 100000000).toFixed(8)
                    };
                });
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch Litecoin transactions:', error);
            return [];
        }
    }
}

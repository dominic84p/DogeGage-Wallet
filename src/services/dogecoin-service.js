/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Dogecoin Service
class DogecoinService {
    // Derive Dogecoin address from seed phrase
    // Dogecoin uses BIP44 path: m/44'/3'/0'/0/0
    deriveAddress(seedPhrase) {
        try {
            const { ethers, bitcoin } = window.cryptoLibs;
            
            // Convert mnemonic to seed
            const seed = ethers.utils.mnemonicToSeed(seedPhrase);
            const seedBuffer = Buffer.from(seed.slice(2), 'hex');
            
            // Create HD wallet from seed
            const root = bitcoin.bip32.fromSeed(seedBuffer);
            
            // Derive Dogecoin path: m/44'/3'/0'/0/0
            const path = "m/44'/3'/0'/0/0";
            const child = root.derivePath(path);
            
            // Dogecoin mainnet parameters
            const dogecoinNetwork = {
                messagePrefix: '\x19Dogecoin Signed Message:\n',
                bech32: 'doge',
                bip32: {
                    public: 0x02facafd,  // dgub
                    private: 0x02fac398  // dgpv
                },
                pubKeyHash: 0x1e,  // Addresses start with 'D'
                scriptHash: 0x16,
                wif: 0x9e
            };
            
            // Generate P2PKH address (starts with D)
            const { address } = bitcoin.payments.p2pkh({
                pubkey: child.publicKey,
                network: dogecoinNetwork
            });
            
            return address;
        } catch (error) {
            console.error('Dogecoin derivation error:', error);
            throw error;
        }
    }
    
    // Get Dogecoin balance from API
    async getBalance(address) {
        try {
            console.log('Fetching DOGE balance for:', address);
            
            // Try Blockchair first
            try {
                const response = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/dogecoin/${address}`);
                const data = await response.json();
                
                console.log('Blockchair DOGE response:', data);
                
                if (data && data.data && data.data[address]) {
                    const balanceSatoshis = data.data[address].address.balance;
                    const balance = balanceSatoshis / 100000000;
                    console.log('DOGE balance found from Blockchair:', balance);
                    return balance.toFixed(8);
                }
            } catch (error) {
                console.warn('Blockchair failed, trying fallback:', error);
            }
            
            // Fallback to dogechain.info via worker
            try {
                console.log('Trying dogechain.info API via worker...');
                const response = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/dogechain/${address}`);
                const data = await response.json();
                
                console.log('Dogechain.info response:', data);
                
                if (data && data.balance !== undefined) {
                    const balance = parseFloat(data.balance);
                    console.log('DOGE balance found from dogechain.info:', balance);
                    return balance.toFixed(8);
                }
            } catch (error) {
                console.error('Dogechain.info also failed:', error);
            }
            
            console.warn('All DOGE APIs failed, returning 0');
            return '0.00000000';
        } catch (error) {
            console.error('Failed to fetch Dogecoin balance:', error);
            return '0.00000000';
        }
    }
    
    async getTransactions(address) {
        try {
            // Use BlockCypher for detailed transaction info
            const response = await fetch(`https://api.blockcypher.com/v1/doge/main/addrs/${address}/full?limit=10`);
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
            console.error('Failed to fetch Dogecoin transactions:', error);
            return [];
        }
    }
}


// Tezos Transaction Sending
class TezosSendService {
    constructor() {
        this.rpcUrl = 'https://mainnet.api.tez.ie';
    }
    
    // Derive address from private key - try multiple methods
    deriveAddressFromPrivateKey(edskKey) {
        try {
            // Decode the edsk private key
            const decoded = this.base58Decode(edskKey);
            
            if (decoded.length < 36) {
                throw new Error('Decoded key too short: ' + decoded.length + ' bytes');
            }
            
            // Extract seed
            let seed;
            if (decoded.length === 40) {
                seed = decoded.slice(4, 36);
            } else if (decoded.length > 40) {
                seed = decoded.slice(4, 36);
            } else {
                seed = decoded.slice(4, Math.min(36, decoded.length));
                if (seed.length < 32) {
                    const padded = new Uint8Array(32);
                    padded.set(seed, 32 - seed.length);
                    seed = padded;
                }
            }
            
            // Standard Ed25519
            const keypair = nacl.sign.keyPair.fromSeed(seed);
            const pkHash = window.blake2b(keypair.publicKey, null, 20);
            const address = this.encodeAddress(pkHash);
            
            return address;
            
        } catch (error) {
            console.error('Error deriving address:', error);
            throw new Error('Invalid private key: ' + error.message);
        }
    }
    
    // Helper to encode address
    encodeAddress(pkHash) {
        const tz1Prefix = new Uint8Array([6, 161, 159]);
        const payload = new Uint8Array(tz1Prefix.length + pkHash.length);
        payload.set(tz1Prefix);
        payload.set(pkHash, tz1Prefix.length);
        
        const checksum = this.doubleHash(payload).slice(0, 4);
        const final = new Uint8Array(payload.length + 4);
        final.set(payload);
        final.set(checksum, payload.length);
        
        return this.base58Encode(final);
    }
    
    async sendTransaction(privateKey, toAddress, amountXTZ) {
        try {
            console.log('Sending Tezos transaction...');
            
            // Decode private key
            const decoded = this.base58Decode(privateKey);
            
            // Extract seed (same logic as deriveAddressFromPrivateKey)
            let seed;
            if (decoded.length === 40) {
                seed = decoded.slice(4, 36);
            } else if (decoded.length > 40) {
                seed = decoded.slice(4, 36);
            } else {
                seed = decoded.slice(4, Math.min(36, decoded.length));
                if (seed.length < 32) {
                    const padded = new Uint8Array(32);
                    padded.set(seed, 32 - seed.length);
                    seed = padded;
                }
            }
            
            const keypair = nacl.sign.keyPair.fromSeed(seed);
            
            // Get source address
            const fromAddress = this.deriveAddressFromPrivateKey(privateKey);
            
            // Get blockchain data
            const blockHash = await this.getBlockHash();
            const counter = await this.getCounter(fromAddress);
            const amountMutez = Math.floor(parseFloat(amountXTZ) * 1000000).toString();
            
            // Build operation
            const operation = {
                branch: blockHash,
                contents: [{
                    kind: 'transaction',
                    source: fromAddress,
                    fee: '1420',
                    counter: (parseInt(counter) + 1).toString(),
                    gas_limit: '10600',
                    storage_limit: '0',
                    amount: amountMutez,
                    destination: toAddress
                }]
            };
            
            // Forge operation
            const forgedHex = await this.forgeOperation(operation);
            
            // Add watermark (0x03 for generic operation)
            const watermark = new Uint8Array([3]);
            const forgedBytes = this.hexToBytes(forgedHex);
            const toSign = new Uint8Array(watermark.length + forgedBytes.length);
            toSign.set(watermark);
            toSign.set(forgedBytes, watermark.length);
            
            // Sign
            const signature = nacl.sign.detached(toSign, keypair.secretKey);
            const signatureHex = this.bytesToHex(signature);
            
            // Build signed operation
            const signedOpBytes = forgedHex + signatureHex;
            
            // Inject operation
            const opHash = await this.injectOperation(signedOpBytes);
            console.log('Tezos transaction sent successfully');
            
            return {
                hash: opHash,
                success: true
            };
            
        } catch (error) {
            console.error('Tezos send error:', error);
            throw error;
        }
    }
    
    async getBlockHash() {
        const response = await fetch(`${this.rpcUrl}/chains/main/blocks/head/hash`);
        if (!response.ok) {
            throw new Error(`Failed to get block hash: ${response.status} ${response.statusText}`);
        }
        const hash = await response.json();
        if (typeof hash !== 'string') {
            throw new Error('Invalid block hash response: ' + JSON.stringify(hash));
        }
        return hash.replace(/"/g, '');
    }
    
    async getCounter(address) {
        const response = await fetch(`${this.rpcUrl}/chains/main/blocks/head/context/contracts/${address}/counter`);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to get counter: ${response.status} - ${error}`);
        }
        const counter = await response.json();
        if (typeof counter !== 'string') {
            throw new Error('Invalid counter response: ' + JSON.stringify(counter));
        }
        return counter.replace(/"/g, '');
    }
    
    async forgeOperation(operation) {
        const response = await fetch(`${this.rpcUrl}/chains/main/blocks/head/helpers/forge/operations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operation)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to forge operation: ${response.status} - ${error}`);
        }
        
        const forged = await response.json();
        if (typeof forged !== 'string') {
            throw new Error('Invalid forge response: ' + JSON.stringify(forged));
        }
        return forged.replace(/"/g, '');
    }
    
    async injectOperation(signedOpBytes) {
        const response = await fetch(`${this.rpcUrl}/injection/operation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signedOpBytes)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to inject operation: ${response.status} - ${error}`);
        }
        
        const hash = await response.json();
        if (typeof hash !== 'string') {
            throw new Error('Injection failed: ' + JSON.stringify(hash));
        }
        return hash.replace(/"/g, '');
    }
    
    doubleHash(data) {
        const hash1 = window.cryptoLibs.ethers.utils.sha256(data);
        const hash2 = window.cryptoLibs.ethers.utils.sha256(hash1);
        return this.hexToBytes(hash2.slice(2));
    }
    
    base58Decode(str) {
        const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const bytes = [0];
        
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            const value = ALPHABET.indexOf(c);
            if (value === -1) throw new Error('Invalid base58 character');
            
            for (let j = 0; j < bytes.length; j++) {
                bytes[j] *= 58;
            }
            bytes[0] += value;
            
            let carry = 0;
            for (let j = 0; j < bytes.length; j++) {
                bytes[j] += carry;
                carry = bytes[j] >> 8;
                bytes[j] &= 0xff;
            }
            while (carry > 0) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }
        
        for (let i = 0; i < str.length && str[i] === '1'; i++) {
            bytes.push(0);
        }
        
        return new Uint8Array(bytes.reverse());
    }
    
    base58Encode(bytes) {
        const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const digits = [0];
        
        for (let i = 0; i < bytes.length; i++) {
            let carry = bytes[i];
            for (let j = 0; j < digits.length; j++) {
                carry += digits[j] << 8;
                digits[j] = carry % 58;
                carry = (carry / 58) | 0;
            }
            while (carry > 0) {
                digits.push(carry % 58);
                carry = (carry / 58) | 0;
            }
        }
        
        let result = '';
        for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
            result += ALPHABET[0];
        }
        for (let i = digits.length - 1; i >= 0; i--) {
            result += ALPHABET[digits[i]];
        }
        return result;
    }
    
    hexToBytes(hex) {
        if (hex.startsWith('0x')) hex = hex.slice(2);
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }
    
    bytesToHex(bytes) {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

const tezosSendService = new TezosSendService();

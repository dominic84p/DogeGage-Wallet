// Base58check encoding for Tezos addresses with proper Blake2b
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58encode(buffer) {
    const digits = [0];
    for (let i = 0; i < buffer.length; i++) {
        let carry = buffer[i];
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
    for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
        result += ALPHABET[0];
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        result += ALPHABET[digits[i]];
    }
    return result;
}

function hexToBytes(hex) {
    // Remove 0x prefix if present
    if (hex.startsWith('0x')) hex = hex.slice(2);
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function sha256(data) {
    return window.cryptoLibs.ethers.utils.sha256(data);
}

function blake2bHash(hexData, outputLength = 20) {
    // Blake2b is required for correct Tezos addresses
    if (!window.blake2b) {
        throw new Error('Blake2b not loaded - cannot derive Tezos address');
    }
    
    try {
        const input = hexToBytes(hexData);
        const hash = window.blake2b(input, null, outputLength);
        return bytesToHex(hash);
    } catch (error) {
        console.error('Blake2b hashing failed:', error);
        throw new Error('Failed to hash with Blake2b: ' + error.message);
    }
}

function tezosAddressFromEd25519PublicKey(publicKey) {
    try {
        // Ed25519 public keys are 32 bytes (64 hex chars)
        const pubKeyHex = typeof publicKey === 'string' ? publicKey : bytesToHex(publicKey);
        
        // Tezos tz1 prefix bytes: [6, 161, 159]
        const tz1Prefix = new Uint8Array([6, 161, 159]);
        
        // Hash the Ed25519 public key with Blake2b-160 (20 bytes output)
        const pkHash = blake2bHash(pubKeyHex, 20);
        const pkHashBytes = hexToBytes(pkHash);
        
        // Combine prefix + public key hash
        const payload = new Uint8Array(tz1Prefix.length + pkHashBytes.length);
        payload.set(tz1Prefix);
        payload.set(pkHashBytes, tz1Prefix.length);
        
        // Double SHA256 for checksum
        const checksum1Hex = sha256('0x' + bytesToHex(payload));
        const checksum2Hex = sha256(checksum1Hex);
        const checksumBytes = hexToBytes(checksum2Hex.slice(2, 10));
        
        // Combine payload + checksum (first 4 bytes)
        const final = new Uint8Array(payload.length + 4);
        final.set(payload);
        final.set(checksumBytes.slice(0, 4), payload.length);
        
        return base58encode(final);
    } catch (error) {
        console.error('Tezos Ed25519 address derivation failed:', error);
        throw error;
    }
}

function tezosAddressFromPublicKey(publicKey) {
    try {
        // Remove 0x prefix if present
        const pubKeyHex = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
        
        // Tezos tz1 prefix bytes: [6, 161, 159]
        const tz1Prefix = new Uint8Array([6, 161, 159]);
        
        // For Tezos, we need the compressed public key (33 bytes)
        // If we have uncompressed (65 bytes), compress it
        let compressedPubKey;
        if (pubKeyHex.length === 130) { // Uncompressed (04 + 64 bytes)
            const x = pubKeyHex.slice(2, 66);
            const y = pubKeyHex.slice(66, 130);
            const yBigInt = BigInt('0x' + y);
            const compPrefix = (yBigInt & 1n) ? '03' : '02';
            compressedPubKey = compPrefix + x;
        } else if (pubKeyHex.length === 66) { // Already compressed
            compressedPubKey = pubKeyHex;
        } else {
            throw new Error('Invalid public key length: ' + pubKeyHex.length);
        }
        
        // Hash the compressed public key with Blake2b-160 (20 bytes output)
        const pkHash = blake2bHash(compressedPubKey, 20);
        const pkHashBytes = hexToBytes(pkHash);
        
        // Combine prefix + public key hash
        const payload = new Uint8Array(tz1Prefix.length + pkHashBytes.length);
        payload.set(tz1Prefix);
        payload.set(pkHashBytes, tz1Prefix.length);
        
        // Double SHA256 for checksum
        const checksum1Hex = sha256('0x' + bytesToHex(payload));
        const checksum2Hex = sha256(checksum1Hex);
        const checksumBytes = hexToBytes(checksum2Hex.slice(2, 10));
        
        // Combine payload + checksum (first 4 bytes)
        const final = new Uint8Array(payload.length + 4);
        final.set(payload);
        final.set(checksumBytes.slice(0, 4), payload.length);
        
        return base58encode(final);
    } catch (error) {
        console.error('Tezos address derivation failed:', error);
        throw error;
    }
}

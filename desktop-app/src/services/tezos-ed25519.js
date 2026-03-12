// Tezos Ed25519 key derivation using TweetNaCl
// Based on SLIP-0010 specification

async function deriveTezosSeed(mnemonic, path) {
    // Get seed from mnemonic
    const seedHex = window.cryptoLibs.ethers.utils.mnemonicToSeed(mnemonic);
    const seed = hexToBytes(seedHex);
    
    // Parse derivation path
    const segments = path.split('/').slice(1); // Remove 'm'
    
    // HMAC-SHA512 using Web Crypto API
    async function hmacSha512(key, data) {
        const cryptoKey = await crypto.subtle.importKey(
            'raw', key,
            { name: 'HMAC', hash: 'SHA-512' },
            false, ['sign']
        );
        const sig = await crypto.subtle.sign('HMAC', cryptoKey, data);
        return new Uint8Array(sig);
    }
    
    // Master key from seed
    const I = await hmacSha512(
        new TextEncoder().encode('ed25519 seed'),
        seed
    );
    
    let key = I.slice(0, 32);
    let chainCode = I.slice(32, 64);
    
    // Derive through path
    for (const segment of segments) {
        const hardened = segment.endsWith("'");
        let index = parseInt(segment.replace("'", ''));
        
        // For Ed25519, ALL derivations are hardened
        if (hardened) {
            index += 0x80000000;
        }
        
        // Build data for HMAC: 0x00 || key || index
        const data = new Uint8Array(1 + 32 + 4);
        data[0] = 0x00;
        data.set(key, 1);
        
        // Index as big-endian uint32
        new DataView(data.buffer).setUint32(33, index, false);
        
        const I = await hmacSha512(chainCode, data);
        key = I.slice(0, 32);
        chainCode = I.slice(32, 64);
    }
    
    return key; // This is the Ed25519 seed (32 bytes)
}

async function getTezosEd25519Keys(mnemonic, path) {
    const seed = await deriveTezosSeed(mnemonic, path);
    
    // Use TweetNaCl to get keypair from seed
    const keypair = nacl.sign.keyPair.fromSeed(seed);
    
    return {
        privateKey: keypair.secretKey,
        publicKey: keypair.publicKey
    };
}

function hexToBytes(hex) {
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

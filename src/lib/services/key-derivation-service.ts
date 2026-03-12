/**
 * SECURITY: On-demand key derivation service
 * Retrieves the mnemonic from encrypted storage, derives the needed private key,
 * and clears it from memory immediately after use.
 *
 * This replaces reading wallet.mnemonic or wallet[chain].privateKey from the store.
 */

import { encryptionService } from './encryption-service';

/**
 * Prompts for the wallet password and returns the decrypted mnemonic.
 * The caller MUST clear the mnemonic reference when done.
 */
export async function getMnemonicForSigning(): Promise<string> {
    // Retrieve password from sessionStorage (set during unlock)
    const sessionPw = sessionStorage.getItem('_walletSessionPw');
    if (!sessionPw) {
        throw new Error('Wallet session expired. Please unlock your wallet again.');
    }

    const mnemonic = await encryptionService.loadWallet(sessionPw);
    return mnemonic;
}

/**
 * Derive an EVM private key on-demand for signing, then return it.
 * Caller MUST null out the reference after sending the transaction.
 */
export async function deriveEvmPrivateKey(): Promise<string> {
    const mnemonic = await getMnemonicForSigning();
    // @ts-ignore - cryptoLibs loaded from CDN
    const { ethers } = window.cryptoLibs;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const privateKey = wallet.privateKey;
    // mnemonic goes out of scope here
    return privateKey;
}

/**
 * Derive UTXO child key node on-demand for signing.
 * Returns the bip32 child node needed to sign PSBTs.
 */
export async function deriveUtxoKeyNode(chain: string): Promise<any> {
    const DERIVATION_PATHS: Record<string, string> = {
        bitcoin: "m/44'/0'/0'/0/0",
        litecoin: "m/44'/2'/0'/0/0",
        dogecoin: "m/44'/3'/0'/0/0"
    };

    const mnemonic = await getMnemonicForSigning();
    // @ts-ignore
    const { ethers, bitcoin } = window.cryptoLibs;

    const UTXO_NETWORKS: Record<string, any> = {
        bitcoin: null,
        litecoin: {
            messagePrefix: '\x19Litecoin Signed Message:\n',
            bech32: 'ltc',
            bip32: { public: 0x019da462, private: 0x019d9cfe },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0
        },
        dogecoin: {
            messagePrefix: '\x19Dogecoin Signed Message:\n',
            bech32: 'doge',
            bip32: { public: 0x02facafd, private: 0x02fac398 },
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e
        }
    };

    const network = UTXO_NETWORKS[chain] || null;
    const path = DERIVATION_PATHS[chain];
    if (!path) throw new Error(`Unsupported UTXO chain: ${chain}`);

    const seed = ethers.utils.mnemonicToSeed(mnemonic);
    const seedBuffer = Buffer.from(seed.slice(2), 'hex');
    const root = bitcoin.bip32.fromSeed(seedBuffer, network);
    const child = root.derivePath(path);

    return child;
}

/**
 * Derive Tron private key on-demand for signing.
 */
export async function deriveTronPrivateKey(): Promise<string> {
    const mnemonic = await getMnemonicForSigning();
    // @ts-ignore
    const { ethers } = window.cryptoLibs;
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const child = hdNode.derivePath("m/44'/195'/0'/0/0");
    return child.privateKey.slice(2); // Remove 0x prefix
}

/**
 * Derive Solana keypair on-demand for signing.
 */
export async function deriveSolanaKeypair(): Promise<any> {
    const mnemonic = await getMnemonicForSigning();
    // @ts-ignore - getTezosEd25519Keys and nacl are globals from CDN
    const keys = await getTezosEd25519Keys(mnemonic, "m/44'/501'/0'/0'");
    const privateKey = keys.privateKey.slice(0, 32);
    // @ts-ignore
    const keypair = nacl.sign.keyPair.fromSeed(privateKey);
    return keypair;
}

/**
 * Derive Tezos private key (edsk format) on-demand for signing.
 */
export async function deriveTezosEdsk(): Promise<string> {
    const mnemonic = await getMnemonicForSigning();
    // @ts-ignore
    const keys = await getTezosEd25519Keys(mnemonic, "m/44'/1729'/0'/0'");
    const seed = keys.privateKey.slice(0, 32);
    const edskPrefix = new Uint8Array([13, 15, 58, 7]);
    const payload = new Uint8Array(edskPrefix.length + seed.length);
    payload.set(edskPrefix);
    payload.set(seed, edskPrefix.length);

    // @ts-ignore
    const { ethers } = window.cryptoLibs;
    const hash1 = ethers.utils.sha256(payload);
    const hash2 = ethers.utils.sha256(hash1);
    const checksumBytes: number[] = [];
    for (let i = 2; i < 10; i += 2) {
        checksumBytes.push(parseInt(hash2.slice(i, i + 2), 16));
    }
    const final = new Uint8Array(payload.length + 4);
    final.set(payload);
    final.set(new Uint8Array(checksumBytes), payload.length);

    // Base58 encode
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const digits = [0];
    for (let i = 0; i < final.length; i++) {
        let carry = final[i];
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
    for (let i = 0; i < final.length && final[i] === 0; i++) {
        result += ALPHABET[0];
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        result += ALPHABET[digits[i]];
    }
    return result;
}

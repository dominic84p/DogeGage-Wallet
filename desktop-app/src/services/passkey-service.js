/**
 * DogeGage Wallet - Desktop Edition
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Passkey Service - Disabled for desktop app
// Desktop app does not support biometric authentication
class PasskeyService {
    
    constructor() {
        this.isTauri = window.__TAURI__ !== undefined;
    }
    
    // Biometric authentication not supported in desktop app
    isSupported() {
        return false;
    }
    
    // Not supported
    async hasPasskey() {
        return false;
    }
    
    // Not supported
    async register() {
        throw new Error('Biometric authentication not available in desktop app');
    }
    
    // Not supported
    async authenticate() {
        throw new Error('Biometric authentication not available in desktop app');
    }
    
    // Not supported
    async removePasskey() {
        throw new Error('Biometric authentication not available in desktop app');
    }
    
    // Not supported
    async storePasswordForPasskey(password) {
        throw new Error('Biometric authentication not available in desktop app');
    }
    
    // Not supported
    async retrievePasswordWithPasskey() {
        throw new Error('Biometric authentication not available in desktop app');
    }
}

const passkeyService = new PasskeyService();

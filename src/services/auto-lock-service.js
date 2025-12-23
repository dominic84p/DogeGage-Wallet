// Auto-Lock Service
const autoLockService = {
    timeout: null,
    lockDelay: 5 * 60 * 1000, // 5 minutes default
    enabled: true,
    
    init() {
        // Get user preference from localStorage
        const savedDelay = localStorage.getItem('autoLockDelay');
        if (savedDelay) {
            this.lockDelay = parseInt(savedDelay);
        }
        
        const savedEnabled = localStorage.getItem('autoLockEnabled');
        if (savedEnabled !== null) {
            this.enabled = savedEnabled === 'true';
        }
        
        // Start monitoring user activity if enabled
        if (this.enabled) {
            this.startMonitoring();
        }
    },
    
    startMonitoring() {
        // Reset timer on user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, () => this.resetTimer(), true);
        });
        
        // Start initial timer
        this.resetTimer();
    },
    
    resetTimer() {
        // Clear existing timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        
        // Only set timer if enabled and wallet is unlocked
        if (!this.enabled || !walletService.isWalletUnlocked()) {
            return;
        }
        
        // Set new timeout
        this.timeout = setTimeout(() => {
            this.lockWallet();
        }, this.lockDelay);
    },
    
    lockWallet() {
        console.log('Auto-locking wallet due to inactivity');
        walletService.lock();
        router.navigate('/unlock');
        
        // Show alert
        alert('🔒 Wallet locked due to inactivity');
    },
    
    setDelay(minutes) {
        this.lockDelay = minutes * 60 * 1000;
        localStorage.setItem('autoLockDelay', this.lockDelay.toString());
        this.resetTimer();
    },
    
    getDelay() {
        return this.lockDelay / 60 / 1000; // Return in minutes
    },
    
    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('autoLockEnabled', enabled.toString());
        
        if (enabled) {
            this.resetTimer();
        } else {
            this.disable();
        }
    },
    
    isEnabled() {
        return this.enabled;
    },
    
    disable() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
};

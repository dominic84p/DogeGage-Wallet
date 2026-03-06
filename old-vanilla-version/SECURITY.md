# Security Policy

## Reporting Vulnerabilities

**Do NOT open public issues for security vulnerabilities.**

Email security concerns to the maintainer or DM on Discord. Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We'll respond within 48 hours and work with you on a fix.

## Threat Model

### What We Protect Against

- **Remote attacks** - No server stores your keys
- **Man-in-the-middle** - HTTPS only, no HTTP
- **XSS attacks** - No user-generated content rendered as HTML
- **Malicious dependencies** - Minimal dependencies, all audited

### What We DON'T Protect Against

- **Compromised device** - If your computer has malware, all bets are off
- **Physical access** - Someone with your device + password can access funds
- **Phishing** - We can't stop you from entering your seed on fake sites
- **User error** - Sending to wrong address, losing seed phrase

### Security Architecture

```
┌─────────────────────────────────────────┐
│           User's Browser                │
│  ┌─────────────────────────────────┐   │
│  │  Seed Phrase (in memory only)   │   │
│  │  Private Keys (derived on use)  │   │
│  │  Encrypted Wallet (localStorage)│   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    │
                    │ HTTPS (public data only)
                    ▼
┌─────────────────────────────────────────┐
│         Public Blockchain APIs          │
│  (Infura, BlockCypher, TronGrid, etc)  │
│  - Balance queries                      │
│  - Transaction broadcast                │
│  - NO private keys sent                 │
└─────────────────────────────────────────┘
```

### Key Security Features

- **BIP39** - Industry standard seed phrases
- **AES-256-GCM** - Wallet encryption
- **No cloud backup** - Keys stay on device
- **Auto-lock** - Configurable timeout
- **Address validation** - Prevents wrong-chain sends

## Best Practices for Users

1. **Write down your seed phrase** on paper, not digitally
2. **Use a strong password** - unique, 12+ characters
3. **Verify addresses** before sending
4. **Use auto-lock** in settings
5. **Don't use on shared computers**
6. **Bookmark the real site** - don't Google it each time

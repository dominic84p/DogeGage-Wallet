/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Simple SPA Router with Hash-based routing
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.afterRenderCallbacks = {};
        
        window.addEventListener('hashchange', () => this.handleRoute());
    }
    
    register(path, handler, afterRender = null) {
        this.routes[path] = handler;
        if (afterRender) {
            this.afterRenderCallbacks[path] = afterRender;
        }
    }
    
    navigate(path) {
        window.location.hash = path;
    }
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const handler = this.routes[hash] || this.routes['/'];
        
        if (handler) {
            this.currentRoute = hash;
            handler();
            
            // Call after-render callback if exists
            if (this.afterRenderCallbacks[hash]) {
                setTimeout(() => this.afterRenderCallbacks[hash](), 0);
            }
        }
    }
    
    start() {
        this.handleRoute();
    }
}

const router = new Router();

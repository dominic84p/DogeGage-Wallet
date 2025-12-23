// Tawk.to Live Chat Service
function loadTawkTo() {
    // Check if already loaded
    if (window.Tawk_API) {
        showTawkTo();
        return;
    }
    
    // Initialize Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    (function(){
        var s1 = document.createElement("script");
        var s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6948f0d68f63a919899ae21b/1jd2ephfq';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1, s0);
    })();
}

function showTawkTo() {
    if (window.Tawk_API && window.Tawk_API.showWidget) {
        window.Tawk_API.showWidget();
    }
}

function hideTawkTo() {
    if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
    }
}

// Global floral decoration for all pages
(function() {
    // Wait for page to fully load
    window.addEventListener('load', function() {
        const floralLine = '<div style="text-align: center; font-size: 2.2rem; color: #D4A373; margin: 0.5rem 0; line-height: 1.4;">🌸 ✿ 🌻 ❀ 🌺 ✾ 🌼 ✻ 🌸</div>';
        
        // Add flowers after Bismillah banner
        const bismillah = document.querySelector('.bismillah');
        if (bismillah) {
            // Check if flowers already exist
            if (!bismillah.nextElementSibling || !bismillah.nextElementSibling.classList.contains('global-floral-top')) {
                const topFloral = document.createElement('div');
                topFloral.className = 'global-floral-top';
                topFloral.innerHTML = floralLine;
                bismillah.insertAdjacentElement('afterend', topFloral);
            }
        }
        
        // Add flowers before footer
        const footer = document.querySelector('footer');
        if (footer) {
            if (!footer.previousElementSibling || !footer.previousElementSibling.classList.contains('global-floral-bottom')) {
                const bottomFloral = document.createElement('div');
                bottomFloral.className = 'global-floral-bottom';
                bottomFloral.innerHTML = floralLine;
                footer.insertAdjacentElement('beforebegin', bottomFloral);
            }
        }
    });
})();

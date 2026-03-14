// ===================================
// Vexer Server Store - JavaScript
// ===================================

// Language Translation System
let currentLang = localStorage.getItem('lang') || 'ar';

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    applyLanguage();
}

function applyLanguage() {
    const elements = document.querySelectorAll('[data-ar][data-en]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    
    // Update lang button text
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = currentLang === 'ar' ? 'EN' : 'ع';
    }
    
    // Update document direction
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
}

// Apply language on page load
document.addEventListener('DOMContentLoaded', applyLanguage);

// ===================================
// Minecraft Server Status Fetcher
// ===================================

const SERVER_IP = 'vexermc.swight.cloud';
const UPDATE_INTERVAL = 30; // Update every 30 seconds

async function fetchServerStatus() {
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await response.json();
        
        const playerCountElement = document.getElementById('player-count');
        const statusDot = document.querySelector('.status-dot');
        
        if (data.online) {
            // Server is online
            const players = data.players?.online || 0;
            const maxPlayers = data.players?.max || 0;
            
            playerCountElement.textContent = `${players} / ${maxPlayers}`;
            
            // Update status dot
            if (statusDot) {
                statusDot.classList.add('online');
                statusDot.classList.remove('offline');
            }
            
            // Update status text
            const statusText = document.querySelector('.server-status span:last-child');
            if (statusText) {
                statusText.textContent = currentLang === 'ar' ? 
                    'السيرفر online الآن' : 
                    'Server is online now';
            }
        } else {
            // Server is offline
            playerCountElement.textContent = '0 / 0';
            
            if (statusDot) {
                statusDot.classList.add('offline');
                statusDot.classList.remove('online');
            }
            
            const statusText = document.querySelector('.server-status span:last-child');
            if (statusText) {
                statusText.textContent = currentLang === 'ar' ? 
                    'السيرفر offline الآن' : 
                    'Server is offline now';
            }
        }
    } catch (error) {
        console.error('Failed to fetch server status:', error);
        const playerCountElement = document.getElementById('player-count');
        if (playerCountElement) {
            playerCountElement.textContent = '---';
        }
    }
}

// Initialize server status on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchServerStatus();
    setInterval(fetchServerStatus, UPDATE_INTERVAL * 1000);
});

// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable Ctrl+U, Ctrl+S, Ctrl+P, F12
document.addEventListener('keydown', function(e) {
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
    // Disable Ctrl+S (Save)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
    }
    // Disable Ctrl+P (Print)
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
    }
    // Disable F12 (Developer Tools)
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Disable Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
    }
});

// Store selected rank in localStorage and redirect to Discord
function selectRank(rankName, price) {
    localStorage.setItem('selectedRank', rankName);
    localStorage.setItem('rankPrice', price);
    // Redirect to Discord for payment
    window.location.href = 'https://discord.gg/yVMtcEWc';
}

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on payment page
    if (document.getElementById('selected-rank')) {
        loadSelectedRank();
        setupPaymentOptions();
    }

    // Server IP copy functionality
    setupServerIPCopy();

    // Add animation to rank cards
    animateRankCards();
});

// Load selected rank data
function loadSelectedRank() {
    const rankName = localStorage.getItem('selectedRank') || 'VIP';
    const price = localStorage.getItem('rankPrice') || '1';

    // Update all rank displays
    document.getElementById('selected-rank').textContent = rankName;
    document.getElementById('rank-name').textContent = rankName;
    document.getElementById('rank-price').textContent = '$' + price;
    document.getElementById('total-price').textContent = '$' + price;
    document.getElementById('pay-amount').textContent = '$' + price;
    document.getElementById('success-rank').textContent = rankName;

    // Update badge class based on rank
    updateRankBadge(rankName);
}

// Update rank badge styling
function updateRankBadge(rankName) {
    const badge = document.getElementById('selected-rank');
    const rankClass = rankName.toLowerCase().replace('+', '-plus').replace(' ', '-');
    badge.className = 'rank-badge ' + rankClass;
}

// Setup payment options
function setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

// Server IP copy functionality
function setupServerIPCopy() {
    const serverIP = document.querySelector('.server-ip');
    
    if (serverIP) {
        serverIP.addEventListener('click', function() {
            const ipText = this.querySelector('span').textContent;
            navigator.clipboard.writeText(ipText).then(function() {
                showToast('تم نسخ IP السيرفر!');
            }, function(err) {
                console.error('Failed to copy: ', err);
            });
        });
    }
}

// Animate rank cards on scroll
function animateRankCards() {
    const cards = document.querySelectorAll('.rank-card');
    
    if (cards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Process payment
function processPayment() {
    const username = document.getElementById('username').value.trim();
    
    // Validate username
    if (!username) {
        showToast('الرجاء إدخال اسم اللاعب!', 'error');
        document.getElementById('username').focus();
        return;
    }

    // Validate username format
    if (username.length < 3 || username.length > 16) {
        showToast('اسم اللاعب يجب أن يكون بين 3 و 16 حرف!', 'error');
        return;
    }

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Show loading state
    const payButton = document.querySelector('.btn-pay');
    payButton.classList.add('loading');
    payButton.innerHTML = '<i class="fa-solid fa-lock"></i><span>جاري المعالجة...</span>';

    // Simulate payment processing
    setTimeout(function() {
        // Show success modal
        const modal = document.getElementById('success-modal');
        modal.classList.add('show');
        
        // Reset button
        payButton.classList.remove('loading');
        payButton.innerHTML = '<i class="fa-solid fa-lock"></i><span>ادفع الآن</span><span id="pay-amount">$' + localStorage.getItem('rankPrice') + '</span>';
    }, 2000);
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 107, 53, 0.9)'};
        color: #000;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: 700;
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(function() {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Rank card hover effects
document.querySelectorAll('.rank-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.rank-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
        }
    });

    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.rank-icon i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

// Close modal when clicking outside
document.getElementById('success-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Prevent form submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
});
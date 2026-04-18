/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    
    // Create toast container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * Get cart from localStorage
 * @returns {Array} Cart items
 */
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items to save
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

/**
 * Load and display cart items
 */
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Ваш кошик порожній</p>';
        updateSummary(0, 0);
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">Фото</div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.price} грн</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    updateSummary(itemsCount, subtotal);
}

/**
 * Update cart summary
 * @param {number} itemsCount - Total number of items
 * @param {number} subtotal - Total price
 */
function updateSummary(itemsCount, subtotal) {
    document.getElementById('itemsCount').textContent = itemsCount;
    document.getElementById('subtotal').textContent = `${subtotal} грн`;
    document.getElementById('total').textContent = `${subtotal} грн`;
}

/**
 * Update quantity of item in cart
 * @param {number} productId - Product ID
 * @param {number} change - Change in quantity (+1 or -1)
 */
function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        saveCart(cart);
        showToast('Кількість оновлено', 'info');
    }
}

/**
 * Remove item from cart
 * @param {number} productId - Product ID to remove
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Товар видалено з кошика', 'info');
}

/**
 * Check if user is logged in and update UI
 */
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = user.name || user.email;
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm('Вийти з акаунту?')) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userName');
                    showToast('Ви вийшли з акаунту', 'info');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            };
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    checkAuth();
});


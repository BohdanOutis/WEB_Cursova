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
 * Update cart count in header
 */
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

/**
 * Load order summary from cart
 */
function loadOrderSummary() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        window.location.href = '/cart';
        return;
    }
    
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 0.5rem;';
        orderItem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>${item.price * item.quantity} грн</span>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('orderTotal').textContent = `${total} грн`;
}

/**
 * Handle checkout form submission
 * @param {Event} event - Form submit event
 */
function handleCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        city: formData.get('city'),
        postOffice: formData.get('postOffice'),
        payment: formData.get('payment'),
        items: getCart(),
        total: getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };
    
    // Save order to localStorage (in production, this would be sent to server/Firebase)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    showToast('Замовлення успішно оформлено! Перенаправлення...', 'success');
    
    // Redirect to homepage after 2 seconds
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
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
    loadOrderSummary();
    updateCartCount();
    checkAuth();
    
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', handleCheckout);
});


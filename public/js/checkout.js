// Cart management
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

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
    
    alert('Замовлення успішно оформлено! Ми зв\'яжемося з вами найближчим часом.');
    window.location.href = '/';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    updateCartCount();
    
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', handleCheckout);
});

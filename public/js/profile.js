// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, updatePassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCUytlqyaJS9U5AtAARNoo6Id060WvlIBU",
    authDomain: "web-programming-35a1c.firebaseapp.com",
    projectId: "web-programming-35a1c",
    storageBucket: "web-programming-35a1c.firebasestorage.app",
    messagingSenderId: "812085026611",
    appId: "1:812085026611:web:fde1077fee121bb462e846",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    
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
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
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
 * Update cart count in header
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

/**
 * Show specific section
 * @param {string} section - Section to show
 */
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    
    // Remove active class from menu items
    document.querySelectorAll('.profile-menu a').forEach(a => a.classList.remove('active'));
    
    // Show selected section
    if (section === 'info') {
        document.getElementById('infoSection').classList.add('active');
        document.querySelectorAll('.profile-menu a')[0].classList.add('active');
    } else if (section === 'orders') {
        document.getElementById('ordersSection').classList.add('active');
        document.querySelectorAll('.profile-menu a')[1].classList.add('active');
        loadOrders();
    } else if (section === 'settings') {
        document.getElementById('settingsSection').classList.add('active');
        document.querySelectorAll('.profile-menu a')[2].classList.add('active');
    }
}

/**
 * Load user profile information
 */
function loadProfile() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        showToast('Необхідно увійти в систему', 'error');
        setTimeout(() => {
            window.location.href = '/auth';
        }, 1500);
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    document.getElementById('userName').textContent = user.name || 'Не вказано';
    document.getElementById('userEmail').textContent = user.email || 'Не вказано';
    
    // Get registration date from Firebase or use current date
    const registeredDate = user.registeredDate || new Date().toLocaleDateString('uk-UA');
    document.getElementById('userRegistered').textContent = registeredDate;
}

/**
 * Load user orders
 */
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>У вас поки немає замовлень</p>';
        return;
    }
    
    ordersList.innerHTML = '';
    
    orders.forEach((order, index) => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const orderDate = new Date(order.date).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let itemsList = '';
        order.items.forEach(item => {
            itemsList += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} грн</li>`;
        });
        
        orderCard.innerHTML = `
            <div class="order-header">
                <h3>Замовлення #${index + 1}</h3>
                <span class="order-date">${orderDate}</span>
            </div>
            <div class="order-details">
                <p><strong>Отримувач:</strong> ${order.name} ${order.surname}</p>
                <p><strong>Телефон:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Доставка:</strong> ${order.city}, ${order.postOffice}</p>
                <p><strong>Оплата:</strong> ${order.payment === 'cash' ? 'Готівкою при отриманні' : 'Оплата карткою'}</p>
            </div>
            <div class="order-items">
                <h4>Товари:</h4>
                <ul>${itemsList}</ul>
            </div>
            <div class="order-total">
                <strong>Всього: ${order.total} грн</strong>
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
}

/**
 * Change password
 * @param {Event} event - Form submit event
 */
function changePassword(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        showToast('Паролі не співпадають', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('Пароль повинен містити мінімум 6 символів', 'error');
        return;
    }
    
    const user = auth.currentUser;
    
    if (user) {
        updatePassword(user, newPassword)
            .then(() => {
                showToast('Пароль успішно змінено', 'success');
                document.getElementById('changePasswordForm').reset();
            })
            .catch((error) => {
                if (error.code === 'auth/requires-recent-login') {
                    showToast('Для зміни паролю необхідно повторно увійти в систему', 'error');
                } else {
                    showToast('Помилка зміни паролю: ' + error.message, 'error');
                }
            });
    } else {
        showToast('Користувач не авторизований', 'error');
    }
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Ви впевнені, що хочете вийти?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userName');
        showToast('Ви вийшли з акаунту', 'info');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }
}

/**
 * Check authentication and update UI
 */
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = user.name || user.email;
            loginBtn.href = '/profile.html';
        }
    }
}

// Make functions globally available
window.showSection = showSection;
window.changePassword = changePassword;
window.logout = logout;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    updateCartCount();
    checkAuth();
    
    // Check Firebase auth state
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            const localUser = localStorage.getItem('currentUser');
            if (!localUser) {
                window.location.href = '/auth';
            }
        }
    });
});

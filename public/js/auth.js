// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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
 * Switch to login tab
 */
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

/**
 * Switch to register tab
 */
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
            showToast('Вхід успішний! Перенаправлення...', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        })
        .catch((error) => {
            let errorMessage = 'Помилка входу';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Користувача не знайдено';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Невірний пароль';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Невірний формат email';
            }
            
            showToast(errorMessage, 'error');
        });
}

/**
 * Handle registration form submission (from auth.html tabs)
 * @param {Event} event - Form submit event
 */
function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Паролі не співпадають', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Пароль повинен містити мінімум 6 символів', 'error');
        return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showToast('Реєстрація успішна! Тепер ви можете увійти.', 'success');
            setTimeout(() => {
                showLogin();
            }, 1500);
        })
        .catch((error) => {
            let errorMessage = 'Помилка реєстрації';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Користувач з таким email вже існує';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Невірний формат email';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Пароль занадто слабкий';
            }
            
            showToast(errorMessage, 'error');
        });
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

// Make functions globally available
window.showLogin = showLogin;
window.showRegister = showRegister;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
});


// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Паролі не співпадають');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль повинен містити мінімум 6 символів');
        return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Реєстрація успішна! Тепер ви можете увійти.');
            showLogin();
        })
        .catch((error) => {
            alert('Помилка реєстрації: ' + error.message);
        });
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = user.email;
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm('Вийти з акаунту?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = '/';
                }
            };
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
});

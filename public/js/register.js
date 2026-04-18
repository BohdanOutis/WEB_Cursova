// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCUytlqyaJS9U5AtAARNoo6Id060WvlIBU",
    authDomain: "web-programming-35a1c.firebaseapp.com",
    projectId: "web-programming-35a1c",
    storageBucket: "web-programming-35a1c.firebasestorage.app",
    messagingSenderId: "812085026611",
    appId: "1:812085026611:web:fde1077fee121bb462e846",
};

// Initialize Firebase
let app;
let auth;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    if (!container) {
        console.error('Toast container not found');
        return;
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
 * Handle registration form submission
 * @param {Event} event - Form submit event
 */
function handleRegister(event) {
    event.preventDefault();
    
    console.log('Registration form submitted');
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    console.log('Form values:', { name, email, passwordLength: password.length, agreeTerms });
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Паролі не співпадають', 'error');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showToast('Пароль повинен містити мінімум 6 символів', 'error');
        return;
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
        showToast('Необхідно погодитись з умовами використання', 'error');
        return;
    }
    
    // Check if Firebase is initialized
    if (!auth) {
        showToast('Помилка ініціалізації системи. Спробуйте пізніше.', 'error');
        console.error('Firebase auth not initialized');
        return;
    }
    
    console.log('Starting Firebase registration...');
    
    // Register with Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Registration successful:', userCredential);
            const user = userCredential.user;
            
            // Save user name to localStorage
            localStorage.setItem('userName', name);
            localStorage.setItem('currentUser', JSON.stringify({ email: user.email, name: name }));
            
            showToast('Реєстрація успішна! Перенаправлення...', 'success');
            
            // Redirect to homepage after 2 seconds
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        })
        .catch((error) => {
            console.error('Registration error:', error);
            let errorMessage = 'Помилка реєстрації';
            
            // Handle specific Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Користувач з таким email вже існує';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Невірний формат email';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Пароль занадто слабкий';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Помилка мережі. Перевірте підключення до інтернету';
            } else {
                errorMessage = `Помилка реєстрації: ${error.message}`;
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
window.handleRegister = handleRegister;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Register page loaded');
    updateCartCount();
    checkAuth();
});


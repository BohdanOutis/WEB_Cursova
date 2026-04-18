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

// Tab switching
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
            alert('Вхід успішний!');
            window.location.href = '/';
        })
        .catch((error) => {
            alert('Помилка входу: ' + error.message);
        });
}

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

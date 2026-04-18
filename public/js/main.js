/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    // Create toast container if it doesn't exist
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.className = 'toast-container';
        document.body.appendChild(newContainer);
    }
    
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
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
 * Add product to cart
 * @param {Object} product - Product to add
 */
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showToast('Товар додано до кошика!', 'success');
}

// Car models data
const carModels = {
    toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Prius'],
    volkswagen: ['Golf', 'Passat', 'Tiguan', 'Polo', 'Jetta'],
    bmw: ['3 Series', '5 Series', 'X5', 'X3', '7 Series'],
    mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC'],
    audi: ['A4', 'A6', 'Q5', 'Q7', 'A3'],
    ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Mustang'],
    honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
    nissan: ['Qashqai', 'X-Trail', 'Juke', 'Leaf', 'Micra']
};

/**
 * Handle car brand selection
 */
function handleCarBrandChange() {
    const brandSelect = document.getElementById('carBrand');
    const modelSelect = document.getElementById('carModel');
    const yearSelect = document.getElementById('carYear');
    
    const selectedBrand = brandSelect.value;
    
    // Reset model and year
    modelSelect.innerHTML = '<option value="">Модель</option>';
    yearSelect.innerHTML = '<option value="">Рік випуску</option>';
    yearSelect.disabled = true;
    
    if (selectedBrand && carModels[selectedBrand]) {
        modelSelect.disabled = false;
        carModels[selectedBrand].forEach(model => {
            const option = document.createElement('option');
            option.value = model.toLowerCase().replace(/\s+/g, '-');
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    } else {
        modelSelect.disabled = true;
    }
}

/**
 * Handle car model selection
 */
function handleCarModelChange() {
    const modelSelect = document.getElementById('carModel');
    const yearSelect = document.getElementById('carYear');
    
    if (modelSelect.value) {
        yearSelect.disabled = false;
        yearSelect.innerHTML = '<option value="">Рік випуску</option>';
        
        // Generate years from 2000 to 2026
        for (let year = 2026; year >= 2000; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    } else {
        yearSelect.disabled = true;
        yearSelect.innerHTML = '<option value="">Рік випуску</option>';
    }
}

/**
 * Search products by car model
 */
function searchByCarModel() {
    const brand = document.getElementById('carBrand').value;
    const model = document.getElementById('carModel').value;
    const year = document.getElementById('carYear').value;
    
    if (!brand) {
        showToast('Будь ласка, оберіть марку автомобіля', 'error');
        return;
    }
    
    if (!model) {
        showToast('Будь ласка, оберіть модель автомобіля', 'error');
        return;
    }
    
    if (!year) {
        showToast('Будь ласка, оберіть рік випуску', 'error');
        return;
    }
    
    // Save selected car to localStorage
    localStorage.setItem('selectedCar', JSON.stringify({ brand, model, year }));
    
    showToast('Перенаправлення до каталогу...', 'success');
    
    // Redirect to catalog with car parameters
    setTimeout(() => {
        window.location.href = `/catalog?brand=${brand}&model=${model}&year=${year}`;
    }, 100);
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

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    
    // Add event listeners for car selector if elements exist
    const carBrandSelect = document.getElementById('carBrand');
    const carModelSelect = document.getElementById('carModel');
    
    if (carBrandSelect) {
        carBrandSelect.addEventListener('change', handleCarBrandChange);
    }
    
    if (carModelSelect) {
        carModelSelect.addEventListener('change', handleCarModelChange);
    }
});


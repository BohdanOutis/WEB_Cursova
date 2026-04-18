// Sample products data
const sampleProducts = [
    { id: 1, name: 'Гальмівні колодки Brembo', price: 1200, category: 'brakes', brand: 'brembo' },
    { id: 2, name: 'Масляний фільтр Mann', price: 350, category: 'engine', brand: 'mann' },
    { id: 3, name: 'Свічки запалювання Bosch', price: 450, category: 'engine', brand: 'bosch' },
    { id: 4, name: 'Амортизатор Sachs', price: 2500, category: 'suspension', brand: 'sachs' },
    { id: 5, name: 'Гальмівний диск Brembo', price: 1800, category: 'brakes', brand: 'brembo' },
    { id: 6, name: 'Повітряний фільтр Mann', price: 280, category: 'engine', brand: 'mann' },
    { id: 7, name: 'Датчик ABS Bosch', price: 950, category: 'electronics', brand: 'bosch' },
    { id: 8, name: 'Комплект зчеплення Sachs', price: 3200, category: 'engine', brand: 'sachs' }
];

let allProducts = [...sampleProducts];
let filteredProducts = [...sampleProducts];

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
 * Load and display products
 * @param {Array} products - Array of products to display
 */
function loadProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p>Товари не знайдено</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">Фото товару</div>
            <h4>${product.name}</h4>
            <div class="product-price">${product.price} грн</div>
            <button onclick="viewProduct(${product.id})">Переглянути</button>
            <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Додати в кошик</button>
        `;
        grid.appendChild(card);
    });
}

/**
 * View product details
 * @param {number} productId - Product ID
 */
function viewProduct(productId) {
    window.location.href = `/product.html?id=${productId}`;
}

/**
 * Search products by name
 */
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    loadProducts(filteredProducts);
}

/**
 * Apply filters to products
 */
function applyFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-category');
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const brandCheckboxes = document.querySelectorAll('.filter-brand');
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        
        return categoryMatch && brandMatch && priceMatch;
    });
    
    loadProducts(filteredProducts);
    showToast(`Знайдено товарів: ${filteredProducts.length}`, 'info');
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
    loadProducts(allProducts);
    updateCartCount();
    checkAuth();
    
    // Add enter key support for search
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
});


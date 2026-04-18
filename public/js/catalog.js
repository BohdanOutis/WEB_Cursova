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

// Load products
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
            <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Додати в кошик</button>
        `;
        grid.appendChild(card);
    });
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    loadProducts(filteredProducts);
}

// Apply filters
function applyFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"][value]');
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked && ['engine', 'brakes', 'electronics', 'suspension'].includes(cb.value))
        .map(cb => cb.value);
    
    const brandCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"][value]');
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(cb => cb.checked && ['bosch', 'brembo', 'mann', 'sachs'].includes(cb.value))
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
}

// Add to cart function
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
    alert('Товар додано до кошика!');
}

// Cart management functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(allProducts);
    updateCartCount();
    
    // Add enter key support for search
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
});

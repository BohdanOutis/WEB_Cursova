// Sample products data with descriptions
const productsData = {
    1: { 
        id: 1, 
        name: 'Гальмівні колодки Brembo', 
        price: 1200, 
        category: 'brakes', 
        brand: 'brembo',
        description: 'Високоякісні гальмівні колодки від провідного виробника Brembo. Забезпечують надійне гальмування в будь-яких умовах. Виготовлені з преміум-матеріалів для максимальної довговічності.',
        specs: [
            'Матеріал: керамічна суміш',
            'Температурний діапазон: -40°C до +800°C',
            'Термін служби: до 50,000 км',
            'Сумісність: універсальні',
            'Країна виробництва: Італія'
        ]
    },
    2: { 
        id: 2, 
        name: 'Масляний фільтр Mann', 
        price: 350, 
        category: 'engine', 
        brand: 'mann',
        description: 'Оригінальний масляний фільтр Mann Filter для ефективного очищення моторного масла. Захищає двигун від забруднень та подовжує термін його служби.',
        specs: [
            'Тип: картриджний',
            'Ступінь фільтрації: 99.5%',
            'Робочий тиск: до 10 бар',
            'Матеріал корпусу: сталь',
            'Країна виробництва: Німеччина'
        ]
    },
    3: { 
        id: 3, 
        name: 'Свічки запалювання Bosch', 
        price: 450, 
        category: 'engine', 
        brand: 'bosch',
        description: 'Надійні свічки запалювання Bosch для стабільної роботи двигуна. Забезпечують оптимальне займання паливної суміші та економію палива.',
        specs: [
            'Тип: іридієві',
            'Зазор: 1.0 мм',
            'Різьба: M14x1.25',
            'Термін служби: до 100,000 км',
            'Країна виробництва: Німеччина'
        ]
    },
    4: { 
        id: 4, 
        name: 'Амортизатор Sachs', 
        price: 2500, 
        category: 'suspension', 
        brand: 'sachs',
        description: 'Газомасляний амортизатор Sachs для комфортної та безпечної їзди. Забезпечує відмінну керованість та стабільність автомобіля.',
        specs: [
            'Тип: газомасляний',
            'Довжина: 350 мм',
            'Діаметр штока: 22 мм',
            'Гарантія: 2 роки',
            'Країна виробництва: Німеччина'
        ]
    },
    5: { 
        id: 5, 
        name: 'Гальмівний диск Brembo', 
        price: 1800, 
        category: 'brakes', 
        brand: 'brembo',
        description: 'Вентильований гальмівний диск Brembo з високими характеристиками. Забезпечує ефективне охолодження та стабільне гальмування.',
        specs: [
            'Діаметр: 312 мм',
            'Товщина: 25 мм',
            'Тип: вентильований',
            'Матеріал: чавун високої якості',
            'Країна виробництва: Італія'
        ]
    },
    6: { 
        id: 6, 
        name: 'Повітряний фільтр Mann', 
        price: 280, 
        category: 'engine', 
        brand: 'mann',
        description: 'Якісний повітряний фільтр Mann для очищення повітря, що надходить в двигун. Підвищує ефективність роботи двигуна.',
        specs: [
            'Тип: панельний',
            'Ступінь фільтрації: 99.9%',
            'Розміри: 250x200x50 мм',
            'Термін служби: 15,000 км',
            'Країна виробництва: Німеччина'
        ]
    },
    7: { 
        id: 7, 
        name: 'Датчик ABS Bosch', 
        price: 950, 
        category: 'electronics', 
        brand: 'bosch',
        description: 'Електронний датчик ABS Bosch для системи антиблокування гальм. Забезпечує точний контроль швидкості обертання коліс.',
        specs: [
            'Тип: магніторезистивний',
            'Напруга живлення: 12V',
            'Робоча температура: -40°C до +150°C',
            'Довжина кабелю: 1.5 м',
            'Країна виробництва: Німеччина'
        ]
    },
    8: { 
        id: 8, 
        name: 'Комплект зчеплення Sachs', 
        price: 3200, 
        category: 'engine', 
        brand: 'sachs',
        description: 'Повний комплект зчеплення Sachs включає диск, кошик та випускний підшипник. Забезпечує плавне перемикання передач.',
        specs: [
            'Діаметр диска: 240 мм',
            'Кількість шліців: 24',
            'Максимальний крутний момент: 350 Нм',
            'Комплектація: диск + кошик + підшипник',
            'Країна виробництва: Німеччина'
        ]
    }
};

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
 * Get product ID from URL
 * @returns {number} Product ID
 */
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

/**
 * Load product details
 */
function loadProductDetails() {
    const productId = getProductIdFromURL();
    const product = productsData[productId];
    
    if (!product) {
        showToast('Товар не знайдено', 'error');
        setTimeout(() => {
            window.location.href = '/catalog';
        }, 2000);
        return;
    }
    
    // Update page content
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `${product.price} грн`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productCategory').textContent = getCategoryName(product.category);
    document.getElementById('productBrand').textContent = getBrandName(product.brand);
    
    // Update specs
    const specsList = document.getElementById('productSpecs');
    specsList.innerHTML = '';
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
    
    // Update page title
    document.title = `${product.name} - AutoParts`;
}

/**
 * Get category display name
 * @param {string} category - Category code
 * @returns {string} Category name
 */
function getCategoryName(category) {
    const categories = {
        'engine': 'Двигун',
        'brakes': 'Гальмівна система',
        'electronics': 'Електроніка',
        'suspension': 'Підвіска'
    };
    return categories[category] || category;
}

/**
 * Get brand display name
 * @param {string} brand - Brand code
 * @returns {string} Brand name
 */
function getBrandName(brand) {
    const brands = {
        'bosch': 'Bosch',
        'brembo': 'Brembo',
        'mann': 'Mann Filter',
        'sachs': 'Sachs'
    };
    return brands[brand] || brand;
}

/**
 * Add product to cart from detail page
 */
function addToCartFromDetail() {
    const productId = getProductIdFromURL();
    const product = productsData[productId];
    
    if (!product) {
        showToast('Помилка додавання товару', 'error');
        return;
    }
    
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
    loadProductDetails();
    updateCartCount();
    checkAuth();
});

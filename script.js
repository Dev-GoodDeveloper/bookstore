// Book data from XML
const books = [
    {
        title: "The Art of not Overthinking",
        author: "Shaurya Kapoor",
        year: 2001,
        price: 12.99,
        isbn: "9780743273565",
        stock: 25,
        category: "fiction"
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        year: 2011,
        price: 15.50,
        isbn: "9780062316097",
        stock: 18,
        category: "non-fiction"
    },
    {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        year: 1997,
        price: 10.99,
        isbn: "9780747532743",
        stock: 32,
        category: "children"
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        year: 1965,
        price: 14.25,
        isbn: "9780441172719",
        stock: 12,
        category: "science-fiction"
    }
];

// Cart state
let cart = [];

// DOM elements
const searchBox = document.getElementById('searchBox');
const categoryFilter = document.getElementById('categoryFilter');
const booksGrid = document.getElementById('booksGrid');
const cartInfo = document.getElementById('cartInfo');

// Utility functions
function getStockStatus(stock) {
    if (stock === 0) return { class: 'out-of-stock', text: '❌ Out of Stock' };
    if (stock < 15) return { class: 'low-stock', text: `⚠️ Low Stock (${stock})` };
    return { class: 'in-stock', text: `✅ In Stock (${stock})` };
}

function formatCategory(category) {
    return category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartInfo.textContent = `🛒 Cart: ${totalItems} items ($${totalPrice.toFixed(2)})`;
}

function addToCart(book) {
    const existingItem = cart.find(item => item.isbn === book.isbn);

    if (existingItem) {
        if (existingItem.quantity < book.stock) {
            existingItem.quantity++;
            updateCart();
            renderBooks();
        }
    } else {
        cart.push({ ...book, quantity: 1 });
        updateCart();
        renderBooks();
    }
}

function getCartQuantity(isbn) {
    const item = cart.find(item => item.isbn === isbn);
    return item ? item.quantity : 0;
}

function createBookCard(book) {
    const stockStatus = getStockStatus(book.stock);
    const cartQuantity = getCartQuantity(book.isbn);
    const remainingStock = book.stock - cartQuantity;

    return `
                <div class="book-card animate-in">
                    <div class="category-badge">${formatCategory(book.category)}</div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    
                    <div class="book-details">
                        <div class="book-detail">
                            <span class="detail-label">Year:</span>
                            <span class="detail-value">${book.year}</span>
                        </div>
                        <div class="book-detail">
                            <span class="detail-label">ISBN:</span>
                            <span class="detail-value">${book.isbn}</span>
                        </div>
                        <div class="book-detail">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value">
                                <span class="stock-indicator ${stockStatus.class}">
                                    ${stockStatus.text}
                                </span>
                            </span>
                        </div>
                        <div class="book-detail">
                            <span class="detail-label">🛒 In Cart:</span>
                            <span class="detail-value">${cartQuantity}</span>
                        </div>
                    </div>
                    
                    <div class="book-price">$${book.price.toFixed(2)}</div>
                    
                    <button class="add-to-cart" 
                            onclick="addToCart(${JSON.stringify(book).replace(/"/g, '&quot;')})"
                            ${remainingStock <= 0 ? 'disabled' : ''}>
                        ${remainingStock <= 0 ? '❌ Cannot Add More' : '🛒 Add to Cart'}
                    </button>
                </div>
            `;
}

function renderBooks() {
    const searchTerm = searchBox.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = `
                    <div class="no-results">
                        <h2>📚 No books found</h2>
                        <p>Try adjusting your search terms or category filter.</p>
                    </div>
                `;
    } else {
        booksGrid.innerHTML = filteredBooks.map(createBookCard).join('');
    }
}

// Event listeners
searchBox.addEventListener('input', renderBooks);
categoryFilter.addEventListener('change', renderBooks);

// Initialize the page
renderBooks();
updateCart();

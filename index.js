// index.js — corrected and improved with localStorage support

// helpers
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));


let lowerIconCart = qs('.lowerCart')
let iconCart = qs('.icon-cart');
let closeCart = qs('.close');
let body = qs('body');
let listProductHTML = qs('.listProduct');
let listCartHTML = qs('.listCart');
let iconCartSpan = qs('.icon-cart span');
let lowerCartSpan = qs('.lowerCart span')

let listProducts = [];
let carts = []; // array of { product_id: "...", quantity: n }

// safe addEventListener
if (iconCart) iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
if (lowerIconCart) lowerIconCart.addEventListener('click', () => body.classList.toggle('showCart'))
if (closeCart) closeCart.addEventListener('click', () => body.classList.toggle('showCart'));

// format price as Naira with commas
const formatPrice = (n) => {
    if (typeof n !== 'number') n = Number(n) || 0;
    return '₦' + n.toLocaleString('en-NG');
};

// ✅ Save cart to localStorage
const saveCartToLocal = () => {
    localStorage.setItem('cartData', JSON.stringify(carts));
};

// ✅ Load cart from localStorage
const loadCartFromLocal = () => {
    const saved = localStorage.getItem('cartData');
    if (saved) {
        try {
            carts = JSON.parse(saved);
        } catch {
            carts = [];
        }
    }
};

const addDataToHTML = () => {
    if (!listProductHTML) return;
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            const img = product.image || '';
            const name = product.name || '';
            const price = typeof product.price === 'number' ? product.price : Number(product.price) || 0;
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
        <img src="${img}" alt="${name}">
        <h2>${name}</h2>
        <div class="price">${formatPrice(price)}</div>
        <button class="addCart">Add To Cart</button>
      `;
            listProductHTML.appendChild(newProduct);
        });
    } else {
        listProductHTML.innerHTML = '<p>No products available.</p>';
    }
};

// delegate add-to-cart clicks
if (listProductHTML) {
    listProductHTML.addEventListener('click', (event) => {
        const el = event.target;
        if (el.classList && el.classList.contains('addCart')) {
            const productId = el.parentElement.dataset.id;
            if (productId) addToCart(productId);
        }
    });
}

const addToCart = (product_id) => {
    const idx = carts.findIndex(c => c.product_id == product_id);
    if (idx < 0) {
        carts.push({ product_id: product_id, quantity: 1 });
    } else {
        carts[idx].quantity += 1;
    }
    addCartToHtml();
    saveCartToLocal(); // ✅ save after each change
};

const addCartToHtml = () => {
    if (!listCartHTML) return;
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    
    if (carts.length === 0) {
        listCartHTML.innerHTML = '<p>Your cart is empty</p>';
    } else {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            
            const positionProduct = listProducts.findIndex(p => p.id == cart.product_id);
            if (positionProduct < 0) return;
            
            const info = listProducts[positionProduct];
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            
            newCart.innerHTML = `
        <div class="image">
          <img src="${info.image || ''}" alt="${info.name || ''}">
        </div>
        <div class="name">${info.name || ''}</div>
        <div class="totalPrice">${formatPrice((info.price || 0) * cart.quantity)}</div>
        <div class="quantity">
          <span class="minus">‹</span>
          <span class="qty">${cart.quantity}</span>
          <span class="plus">›</span>
        </div>
      `;
            
            const minusBtn = newCart.querySelector('.minus');
            const plusBtn = newCart.querySelector('.plus');
            
            minusBtn && minusBtn.addEventListener('click', () => {
                const idx = carts.findIndex(c => c.product_id == cart.product_id);
                if (idx >= 0) {
                    carts[idx].quantity = Math.max(0, carts[idx].quantity - 1);
                    if (carts[idx].quantity === 0) carts.splice(idx, 1);
                    addCartToHtml();
                    saveCartToLocal(); // ✅ update saved cart
                }
            });
            
            plusBtn && plusBtn.addEventListener('click', () => {
                const idx = carts.findIndex(c => c.product_id == cart.product_id);
                if (idx >= 0) {
                    carts[idx].quantity += 1;
                    addCartToHtml();
                    saveCartToLocal(); // ✅ update saved cart
                }
            });
            
            listCartHTML.appendChild(newCart);
        });
    }
    
    if (iconCartSpan) iconCartSpan.innerText = totalQuantity;
    if (lowerCartSpan) lowerCartSpan.innerText = totalQuantity;
};


// load products.json
const initApp = () => {
    loadCartFromLocal(); // ✅ restore saved cart before loading products
    
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
            addCartToHtml(); // refresh cart UI
        })
        .catch(err => {
            console.error('Failed to load products.json', err);
            if (listProductHTML) listProductHTML.innerHTML = '<p>Failed to load products.</p>';
        });
};

initApp();
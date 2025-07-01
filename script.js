// --- Global Variables ---
let cart = []; // An array to store items added to the cart

// Get references to the custom message box elements
const messageBox = document.getElementById("custom-message-box");
const messageText = document.getElementById("custom-message-text");

// Get references to the modal elements
const cartModal = document.getElementById("cart-modal");
const loginModal = document.getElementById("login-modal");

// --- Helper Function: Show Custom Message (Notification) ---
function showMessage(message, duration = 3000) {
    messageText.textContent = message;
    messageBox.style.display = 'flex';
    setTimeout(() => {
        messageBox.style.opacity = '1';
    }, 10);
    setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 300);
    }, duration);
}

// --- Event Listener: When the whole page is loaded ---
document.addEventListener("DOMContentLoaded", function() {
    const products = [
        { id: 101, name: "Luxury Sofa Set", price: 500, img: "images/luxury_sofa.jfif" },
        { id: 102, name: "Modern Dining Table", price: 300, img: "images/modern_dining.jfif" },
        { id: 103, name: "Elegant Ceiling Lights", price: 120, img: "images/lights.jfif" },
        { id: 104, name: "Cozy Armchair", price: 250, img: "images/chairs.jfif" },
        { id: 105, name: "Minimalist Bookshelf", price: 180, img: "images/bookshelf.jfif" },
        { id: 106, name: "Modern Coffee Table", price: 150, img: "images/coffeetable.jfif" },
        { id: 107, name: "Accent Lamp", price: 75, img: "images/lamp.jfif" },
        { id: 108, name: "Abstract Wall Art", price: 90, img: "images/art.jfif" },
        { id: 109, name: "Bedroom Dresser", price: 320, img: "images/dresser.avif" },
        { id: 110, name: "Plush Area Rug", price: 110, img: "images/rug.jfif" },
        { id: 111, name: "Vintage Console Table", price: 280, img: "images/vintagetable.jfif" },
        { id: 112, name: "Pendant Lights (Set of 3)", price: 180, img: "images/lightsets3.jfif" },
        { id: 113, name: "Scandinavian Dining Chairs (Pair)", price: 200, img: "images/chairsets.jfif" },
        { id: 114, name: "Geometric Floor Lamp", price: 95, img: "images/floorlamp.jfif" },
        { id: 115, name: "Velvet Storage Bench", price: 160, img: "images/bench.jfif" }
    ];

    let productContainer = document.getElementById("product-list");

    products.forEach(product => {
        let productCard = `
            <div class="col-md-4 flex justify-center">
                <div class="card w-full bg-white rounded-xl shadow-md overflow-hidden">
                    <img src="${product.img}" class="card-img-top w-full" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/cccccc/333333?text=Image+Error';">
                    <div class="card-body p-5">
                        <h5 class="card-title text-xl font-semibold mb-2">${product.name}</h5>
                        <p class="card-text text-blue-600 text-lg font-bold mb-1">$${product.price.toFixed(2)}</p>
                        <p class="text-xs text-gray-500 mt-1">ID: ${product.id}</p>
                        <button class="btn-primary px-5 py-2 rounded-lg mt-4" onclick="handleAddToCartClick(${product.id}, '${product.name}', ${product.price})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>`;
        productContainer.innerHTML += productCard;
    });
});

// --- Cart Functions ---

function handleAddToCartClick(id, name, price) {
    const product = { id: id, name: name, price: price };
    addToCart(product);

    // GTM DataLayer push for 'add_to_cart' event (as you had it)
    gtag('event', 'add_to_cart', {
        itemname: name,
        itemid: id,
        itemprice: price
    });

    // NEW: Adobe Analytics DataLayer push for 'addToCart' event
    // This will be read by your 'E-commerce - Add to Cart' Rule in Launch.
    window.dataLayer.push({
        'event': 'addToCart', // This custom event name will trigger your Launch rule
        'cartProduct': {       // This object holds data for the specific product added
            id: id,
            name: name,
            price: price,
            quantity: 1 // Assuming 1 for add to cart
        }
    });
    console.log('Adobe DataLayer push for addToCart:', window.dataLayer);
}

function addToCart(product) {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
        showMessage(`Added another ${product.name} to your cart!`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showMessage(`${product.name} has been added to your cart!`);
    }

    updateCartCount();
}

function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1);
        showMessage(`${removedItem[0].name} removed from cart.`);
        updateCartDisplay();
        updateCartCount();
    }
}

function updateCartDisplay() {
    let cartItemsElement = document.getElementById("cart-items");
    let cartTotalElement = document.getElementById("cart-total");
    cartItemsElement.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = `<li class="text-gray-500 text-center py-4">Your cart is empty.</li>`;
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItemsElement.innerHTML += `
                <li class="flex justify-between items-center py-2 px-1 border-b border-dashed border-gray-200 last:border-b-0">
                    <span class="flex-grow text-left">${item.name} (ID: ${item.id}) (${item.quantity}) - $${item.price.toFixed(2)}</span>
                    <span class="font-semibold text-right">$${itemTotal.toFixed(2)}</span>
                    <button class="ml-4 text-red-500 hover:text-red-700 transition duration-150" onclick="removeItemFromCart(${index})">
                        <i class="fa fa-trash"></i>
                    </button>
                </li>
            `;
        });
    }

    cartTotalElement.innerText = `Total: $${total.toFixed(2)}`;
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = totalItems;
}

function showCart() {
    updateCartDisplay();
    cartModal.classList.remove("hidden");
}

function closeCart() {
    cartModal.classList.add("hidden");
}

function checkout() {
    if (cart.length === 0) {
        showMessage("Your cart is empty. Please add items before checking out.");
        return;
    }
    
    // NEW: Adobe Analytics DataLayer push for 'purchase' event
    // This will be read by your 'E-commerce - Purchase' Rule in Launch.
    // Assuming a simple order ID for this example; in real life, this comes from your backend.
    const orderId = 'ORDER-' + Math.floor(Math.random() * 1000000); // Simple random ID for demo
    const orderRevenue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderProducts = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    window.dataLayer.push({
        'event': 'purchase', // This custom event name will trigger your Launch rule
        'order': {            // This object holds all purchase details
            id: orderId,
            revenue: orderRevenue,
            currency: 'USD', // IMPORTANT: Adjust to 'INR' or your actual currency
            products: orderProducts
        }
    });
    console.log('Adobe DataLayer push for purchase:', window.dataLayer);

    showMessage("Thank you for your purchase! Your order has been placed.");
    cart = [];
    updateCartCount();
    closeCart();
}

function showLogin() {
    loginModal.classList.remove("hidden");
}

function closeLogin() {
    loginModal.classList.add("hidden");
}

function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const age = parseInt(document.getElementById('contact-age').value);
    const productIdInput = document.getElementById('contact-product-id').value;
    const message = document.getElementById('contact-message').value;

    if (!name || !email || !message) {
        showMessage("Please fill in Name, Email, and Message fields.", 4000);
        return;
    }
    if (isNaN(age) && document.getElementById('contact-age').value !== '') {
        showMessage("Please enter a valid age (number).", 4000);
        return;
    }

    let productId = null;
    if (productIdInput !== '') {
        const parsedProductId = parseInt(productIdInput);
        if (!isNaN(parsedProductId)) {
            productId = parsedProductId;
        } else {
            showMessage("Please enter a valid numeric Product ID.", 4000);
            return;
        }
    }

    console.log("Contact Form Submitted:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Age:", age || 'Not provided');
    console.log("Product ID:", productId || 'Not provided');
    console.log("Message:", message);

    gtag('event' , 'contactform_event' , {
        user_name: name,
        user_email: email,
        user_age : age,
        user_product_ID : productId,
        user_message: message,
        submission_count: 1
    })
    console.log('contactform_event sent successfully')

    // DataLayer push for Google Tag Manager's 'contact_form_submission' event (as you had it)
    // Adobe Analytics Data Elements can be configured to read from this structure.
    window.dataLayer.push({
        'event': 'contact_form_submission',
        'form_name': 'Contact Us Form',
        'contact_details': {
            'user_name': name,
            'user_email': email,
            'user_message': message,
            'user_age': isNaN(age) ? null : age,
            'product_id_inquiry': productId
        }
    });

    showMessage("Your message has been sent successfully!");

    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-age').value = '';
    document.getElementById('contact-product-id').value = '';
    document.getElementById('contact-message').value = '';
}

window.onclick = function(event) {
    if (event.target == cartModal) {
        closeCart();
    }
    if (event.target == loginModal) {
        closeLogin();
    }
}

// Global variables for Firebase (these are typically provided by the Canvas environment
// and are included here for completeness, though not not used in this specific e-commerce logic).
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

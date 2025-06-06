// --- Global Variables ---
let cart = []; // An array to store items added to the cart

// Get references to the custom message box elements
const messageBox = document.getElementById("custom-message-box");
const messageText = document.getElementById("custom-message-text");

// Get references to the modal elements
const cartModal = document.getElementById("cart-modal");
const loginModal = document.getElementById("login-modal"); // Keep login modal reference if it's still in HTML

// code for form submission
// let Nameval = document.getElementById('contact-name')
// let email = document.getElementById('contact-email')
// let age = document.getElementById('contact-age')
// let productid = document.getElementById('contact-product-id')
// let message = document.getElementById('contact-message')

// document.getElementById('contactform').addEventListener('submit' , (e)=>{
//     e.preventDefault()
//     console.log(Nameval.value , email.value , age.value , productid.value , message.value)
// })
// --- Helper Function: Show Custom Message (Notification) ---
/**
 * Displays a temporary message at the top of the screen.
 * This function uses direct style manipulation for maximum reliability
 * in triggering CSS transitions.
 * @param {string} message - The text message to display.
 * @param {number} duration - How long the message should be visible in milliseconds (default: 3000ms = 3 seconds).
 */
function showMessage(message, duration = 3000) {
    messageText.textContent = message; // Set the message text

    // Set display to flex FIRST to make the element renderable
    messageBox.style.display = 'flex';

    setTimeout(() => {
        messageBox.style.opacity = '1'; // Trigger fade-in
    }, 10); // Minimal delay

    // Set a timeout to start fading out after the main duration
    setTimeout(() => {
        messageBox.style.opacity = '0'; // Trigger fade-out

        // Set another timeout to completely hide the box after the fade-out transition finishes
        setTimeout(() => {
            messageBox.style.display = 'none'; // Fully hide the box
        }, 300); // This delay should match the CSS 'transition-opacity' duration
    }, duration);
}


// --- Event Listener: When the whole page is loaded ---
document.addEventListener("DOMContentLoaded", function() {
    // --- Product Data: A list of all available products with details and image URLs ---
    // IMPORTANT: Prices are now numbers for calculation!
    // IDs are now numeric as requested
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

    // Get the container where products will be displayed
    let productContainer = document.getElementById("product-list");

    // Loop through each product and create its HTML card
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
        productContainer.innerHTML += productCard; // Add the created card to the display area
    });
});

// --- Cart Functions ---

// NEW: Wrapper function for the onclick event in HTML
function handleAddToCartClick(id, name, price) {
    const product = { id: id, name: name, price: price }; // Recreate product object
    addToCart(product); // Add to local cart

    sendAddToCartToGTM(product, 1); // Send to GTM (quantity 1 for single add)
}


/**
 * Adds a selected product to the shopping cart.
 * If the item is already in the cart, it increments the quantity.
 * @param {object} product - The product object { id, name, price, img }.
 */
function addToCart(product) {
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // Item exists, increment quantity
        cart[existingItemIndex].quantity++;
        showMessage(`Added another ${product.name} to your cart!`);
    } else {
        // Item does not exist, add new item with quantity 1
        cart.push({ ...product, quantity: 1 });
        showMessage(`${product.name} has been added to your cart!`);
    }

    updateCartCount(); // Update the cart count in the navbar
}

/**
 * Removes an item from the cart by its index.
 * @param {number} index - The index of the item in the cart array to remove.
 */
function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1); // Remove 1 item at the given index
        showMessage(`${removedItem[0].name} removed from cart.`);
        updateCartDisplay(); // Refresh the cart modal
        updateCartCount(); // Update the cart count in the navbar
    }
}

/**
 * Updates the cart item display in the modal and calculates total.
 */
function updateCartDisplay() {
    let cartItemsElement = document.getElementById("cart-items");
    let cartTotalElement = document.getElementById("cart-total");
    cartItemsElement.innerHTML = ""; // Clear existing items

    let total = 0;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = `<li class="text-gray-500 text-center py-4">Your cart is empty.</li>`;
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal; // Add to overall total

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
    cartTotalElement.innerText = `Total: $${total.toFixed(2)}`; // Update total price
}

/**
 * Updates the number displayed in the cart icon in the navbar.
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = totalItems;
}


/**
 * Displays the shopping cart modal.
 */
function showCart() {
    updateCartDisplay(); // Populate cart items before showing modal
    cartModal.classList.remove("hidden"); // Make the cart modal visible
}

/**
 * Closes the shopping cart modal.
 */
function closeCart() {
    cartModal.classList.add("hidden"); // Hide the cart modal
}

/**
 * Handles the checkout process.
 * Displays a thank you message, clears the cart, and closes the modal.
 */
function checkout() {
    if (cart.length === 0) {
        showMessage("Your cart is empty. Please add items before checking out.");
        return; // Stop the function if cart is empty
    }
    // Optional: send 'begin_checkout' or 'purchase' event here
    // sendCheckoutEventToGTM(cart); // Assuming you'd create this function

    showMessage("Thank you for your purchase! Your order has been placed."); // Show thank you message
    cart = []; // Clear all items from the cart array
    updateCartCount(); // Reset the cart count to 0
    closeCart(); // Close the cart modal
}

// --- Login Functions (No Age Input here anymore) ---
/**
 * Displays the login modal.
 */
function showLogin() {
    loginModal.classList.remove("hidden");
}

/**
 * Closes the login modal.
 */
function closeLogin() {
    loginModal.classList.add("hidden");
}

// --- NEW FUNCTION: Handle Contact Form Submission ---
/**
 * Captures contact form data and pushes a custom event to the Data Layer.
 * @param {Event} event - The DOM event object (used to prevent default form submission).
 */
function handleContactSubmit(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    // Get values from the form fields
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const age = parseInt(document.getElementById('contact-age').value); // Convert to number
    const productIdInput = document.getElementById('contact-product-id').value; // Get the raw string value
    const message = document.getElementById('contact-message').value;

    // Basic validation
    if (!name || !email || !message) {
        showMessage("Please fill in Name, Email, and Message fields.", 4000);
        return;
    }
    if (isNaN(age) && document.getElementById('contact-age').value !== '') {
        showMessage("Please enter a valid age (number).", 4000);
        return;
    }

    // Convert product ID to number, handling empty/invalid input
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
    console.log("Age:", age || 'Not provided'); // Display "Not provided" if age is NaN or empty
    console.log("Product ID:", productId || 'Not provided');
    console.log("Message:", message);

    gtag('event' , 'contactform_event' , {
        user_name: name,
        user_email: email,
        user_age : age,
        user_product_ID : productId,
        user_message: message
    })

    console.log('contactform_event sent successfully')

    // Push data to Google Tag Manager's Data Layer
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        'event': 'contact_form_submission', // Custom event name
        'form_name': 'Contact Us Form',
        'contact_details': {
            'user_name': name,
            'user_email': email,
            'user_message': message,
            'user_age': isNaN(age) ? null : age, // Send null if age is not a valid number
            'product_id_inquiry': productId // Send null if empty or invalid, otherwise the number
        }
    });

    showMessage("Your message has been sent successfully!");

    // Optional: Clear the form after submission
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-age').value = '';
    document.getElementById('contact-product-id').value = '';
    document.getElementById('contact-message').value = '';
}


// --- Event Listener: Close Modal when clicking outside ---
// This allows users to close any open modal by clicking anywhere on the overlay.
window.onclick = function(event) {
    if (event.target == cartModal) { // If the click was on the cart modal background itself
        closeCart();
    }
    if (event.target == loginModal) { // If the click was on the login modal background itself
        closeLogin();
    }
}

// --- Function: Send Add to Cart data to Google Tag Manager ---
/**
 * Pushes an 'add_to_cart' event to the GTM Data Layer with product details.
 * @param {object} product - The product object { id, name, price }.
 * @param {number} quantity - The quantity of the product added (usually 1 for this event).
 */
function sendAddToCartToGTM(product, quantity) {
    window.dataLayer = window.dataLayer || []; // Ensure dataLayer exists

    dataLayer.push({
        'event': 'add_to_cart', // Custom event name for GTM Trigger
        'ecommerce': {
            'items': [{
                'item_id': String(product.id), // IMPORTANT: Convert to string for GA4 specification even if numeric in source
                'item_name': product.name,
                'currency': 'USD', // IMPORTANT: Use 'INR' for Indian Rupees, 'USD' for Dollars based on your site's price display
                'price': product.price,
                'quantity': quantity
            }],
            'value': product.price * quantity,
            'currency': 'USD' // Match the currency with 'items'
        }
    });

    console.log('DataLayer push for add_to_cart:', dataLayer); // For debugging in browser console
}


// Global variables for Firebase (these are typically provided by the Canvas environment
// and are included here for completeness, though not not used in this specific e-commerce logic).
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// ==========================================================================
// 1. VARIABLE DECLARATIONS & CONFIGURATION MATRIX
// ==========================================================================
let currentBilling = 'monthly'; // Default state
let currentCurrency = 'USD';    // Default currency
let activeFeatureIndex = 0;     // Context lock pointer (Default tracker)

// Matrix Rates (Judges framework compliant)
const pricingMatrix = {
    USD: { symbol: '$', basePrice: 19 },
    INR: { symbol: '₹', basePrice: 1599 },
    EUR: { symbol: '€', basePrice: 18 }
};

// ==========================================================================
// 2. FEATURE 1: DYNAMIC PRICING CORE LOGIC
// ==========================================================================

function changePrice() {
    currentCurrency = document.getElementById('currency').value;
    calculatePrice();
}
function changeBilling(type) {
    currentBilling = type;
    const btnMonthly = document.getElementById('btn-monthly');
    const btnAnnual = document.getElementById('btn-annual');
    
    if (type === 'monthly') {
        btnMonthly.style.background = '#FFC801';
        btnMonthly.style.color = '#172836';
        btnAnnual.style.background = '#114C5A';
        btnAnnual.style.color = '#F1F6F4';
    } else {
        btnAnnual.style.background = '#FFC801';
        btnAnnual.style.color = '#172836';
        btnMonthly.style.background = '#114C5A';
        btnMonthly.style.color = '#F1F6F4';
    }
    changePrice();
}
function calculatePrice() {
    const data = pricingMatrix[currentCurrency];
    let finalPrice = data.basePrice;

    // Apply 20% Discount if Annual billing is toggled
    if (currentBilling === 'annual') {
        finalPrice = Math.round(finalPrice * 12 * 0.8); 
    }

    // Live update the browser text elements
    document.getElementById('symbol').innerText = data.symbol;
    document.getElementById('amount').innerText = finalPrice;
}

// ==========================================================================
// 3. FEATURE 2: ACCORDION ENGINE (WITH CONTEXT LOCK)
// ==========================================================================
function toggleAccordion(index) {
    // Desktop layout rules are managed via CSS, JS handles mobile expansion toggles
    if (window.innerWidth <= 768) {
        const boxes = document.querySelectorAll('.bento-box');
        
        // Agar pehle se wahi panel open hai toh use close karo
        if (boxes[index].classList.contains('active')) {
            boxes[index].classList.remove('active');
        } else {
            // Saare panels ko clear karke naye panel ko kholo
            boxes.forEach(box => box.classList.remove('active'));
            boxes[index].classList.add('active');
            activeFeatureIndex = index; // Synchronize State
        }
    } else {
        // Desktop par click karne par hum index save rakhte hain for cross-device switching
        activeFeatureIndex = index;
    }
}

// ==========================================================================
// 4. PERFORMANCE TUNED CONTEXT LOCK WITH DEBOUNCE SYSTEM
// ==========================================================================
let resizeTimer;

window.addEventListener('resize', () => {
    // Clear timeout loops to secure browser engine threads
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
        const boxes = document.querySelectorAll('.bento-box');
        
        if (window.innerWidth <= 768) {
            // Check if any box is already open on mobile screen
            let anyActive = Array.from(boxes).some(box => box.classList.contains('active'));
            
            // Dynamic Synchronization Rule: Automatically lock viewport state
            if (!anyActive) {
                boxes[activeFeatureIndex].classList.add('active');
                console.log(`State Synchronized: Panel ${activeFeatureIndex} locked.`);
            }
        } else {
            // Clean active classes if user scales back to large layout mode
            boxes.forEach(box => box.classList.remove('active'));
        }
    }, 100); // 100ms Debounce restriction barrier
});

// Initial trigger on load to setup default matrix calculation values
document.addEventListener("DOMContentLoaded", () => {
    calculatePrice();
});

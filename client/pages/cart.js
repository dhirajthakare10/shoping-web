import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderCart = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8';

  const user = store.getState().user;
  if (!user) {
    container.innerHTML = `
      <div class="text-center py-16 glass-panel rounded-2xl max-w-md mx-auto">
        <span class="text-4xl mb-3">🛒</span>
        <h3 class="text-base font-bold text-slate-800 dark:text-white">Sign in to view your cart</h3>
        <p class="text-xs text-slate-400 mt-1">Add items to bag, checkout, and track past orders.</p>
        <button onclick="window.location.hash = '#/login'" class="btn-primary mt-5 w-full">Sign In Now</button>
      </div>
    `;
    return container;
  }

  // Loading initial cart state
  container.innerHTML = getSpinner('large');

  // Trigger lazy loading
  setTimeout(async () => {
    try {
      const response = await api.cart.get();
      if (!response.success) {
        throw new Error(response.message);
      }

      // Update state store
      store.setCart(response.cart);
      const { products, totalPrice } = response.cart;

      if (products.length === 0) {
        container.innerHTML = `
          <div class="text-center py-20 glass-panel rounded-2xl max-w-lg mx-auto flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-3xl shadow-inner">🛍️</div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">Your Cart Bag is Empty</h3>
            <p class="text-xs text-slate-400 max-w-xs leading-relaxed">It looks like you haven't added any luxury goods to your basket yet. Head to our catalogue and pick some.</p>
            <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-2">Start Shopping</button>
          </div>
        `;
        return;
      }

      // Layout construction
      container.innerHTML = `
        <div class="border-b border-slate-200/40 dark:border-slate-800/40 pb-4 text-left">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">Shopping Cart Bag</h1>
          <p class="text-xs text-slate-400 mt-1">Review items, edit quantities, and checkout.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <!-- Line Items List -->
          <div class="lg:col-span-2 flex flex-col gap-4">
            ${products.map(item => {
              const p = item.productId;
              const hasDiscount = p.discountPrice && p.discountPrice > 0;
              const displayPrice = hasDiscount ? p.discountPrice : p.price;
              const itemTotal = displayPrice * item.quantity;
              const mainImg = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300';
              
              return `
                <div class="glass-panel p-4.5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-left relative transition-all hover:border-slate-350 dark:hover:border-slate-800">
                  
                  <!-- Image thumbnail -->
                  <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 cursor-pointer" onclick="window.location.hash = '#/productDetails?id=${p._id}'">
                    <img src="${mainImg}" alt="${p.title}" class="w-full h-full object-cover" />
                  </div>

                  <!-- Details -->
                  <div class="flex-1 flex flex-col gap-1 w-full min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-primary-400 font-bold">${p.category}</span>
                    <h4 
                      class="text-sm font-bold truncate hover:text-primary-500 cursor-pointer transition-colors text-slate-800 dark:text-white"
                      onclick="window.location.hash = '#/productDetails?id=${p._id}'"
                    >
                      ${p.title}
                    </h4>
                    
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">$${displayPrice.toFixed(2)} each</span>
                      ${hasDiscount ? `
                        <span class="text-[10px] text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-md font-bold">Discounted</span>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Action controls (Quantity Spinner & Trash) -->
                  <div class="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                    
                    <!-- Qty adjustments -->
                    <div class="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                      <button class="cart-qty-minus px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-500 font-bold" data-id="${p._id}" data-qty="${item.quantity}">-</button>
                      <span class="px-3 text-xs font-bold text-slate-800 dark:text-white">${item.quantity}</span>
                      <button class="cart-qty-plus px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-500 font-bold" data-id="${p._id}" data-qty="${item.quantity}" data-stock="${p.stock}">+</button>
                    </div>

                    <!-- Line Total -->
                    <span class="text-sm font-extrabold text-slate-800 dark:text-white min-w-[70px] text-right">$${itemTotal.toFixed(2)}</span>

                    <!-- Remove Btn -->
                    <button 
                      class="cart-remove-btn p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                      data-id="${p._id}"
                      title="Remove Item"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>

                  </div>

                </div>
              `;
            }).join('')}
          </div>

          <!-- Checkout summary sidebar -->
          <div class="lg:col-span-1 flex flex-col gap-6 text-left">
            <div class="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <h3 class="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans">Summary</h3>
              
              <div class="flex flex-col gap-3 py-3 border-y border-slate-100 dark:border-slate-800/40 text-xs font-semibold">
                <div class="flex justify-between text-slate-500">
                  <span>Bag Subtotal</span>
                  <span>$${totalPrice.toFixed(2)}</span>
                </div>
                ${store.getState().appliedCoupon ? `
                <div class="flex justify-between text-rose-500 font-bold">
                  <span>Discount (${store.getState().appliedCoupon.code} - ${store.getState().appliedCoupon.discountPercent}%)</span>
                  <span>-$${(totalPrice * (store.getState().appliedCoupon.discountPercent / 100)).toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="flex justify-between text-slate-500">
                  <span>Shipping Estimation</span>
                  <span class="text-emerald-500">FREE</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>Tax (Included)</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div class="flex justify-between items-baseline py-1">
                <span class="text-sm font-bold text-slate-800 dark:text-white">Total Amount</span>
                <span class="text-xl font-black text-primary-500">
                  $${(totalPrice - (store.getState().appliedCoupon ? (totalPrice * (store.getState().appliedCoupon.discountPercent / 100)) : 0)).toFixed(2)}
                </span>
              </div>

              <!-- Promo Section -->
              ${store.getState().appliedCoupon ? `
                <div class="flex items-center justify-between p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-600 dark:text-rose-450 mt-1">
                  <div class="flex items-center gap-1.5 font-semibold">
                    <span class="text-base">🎟️</span>
                    <span class="uppercase">${store.getState().appliedCoupon.code} Applied</span>
                  </div>
                  <button id="remove-coupon-btn" class="px-2.5 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold hover:bg-rose-600 transition-colors uppercase">Remove</button>
                </div>
              ` : `
                <div class="flex gap-2 mt-2">
                  <input type="text" id="coupon-input" placeholder="Promo code (e.g. CRAZY50)" class="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-800 dark:text-white" />
                  <button id="apply-coupon-btn" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors">Apply</button>
                </div>
              `}

              <!-- Secure Checkout button -->
              <button 
                onclick="window.location.hash = '#/checkout'"
                class="btn-primary w-full text-center mt-3 text-sm flex items-center justify-center gap-2"
              >
                Secure Checkout
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              </button>
            </div>
          </div>

        </div>
      `;

      // BIND EVENTS

      // 1. Quantity adjust minus
      container.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pId = btn.getAttribute('data-id');
          const currentQty = Number(btn.getAttribute('data-qty'));

          if (currentQty <= 1) {
            // Remove instead
            btn.innerHTML = getSpinner('small', 'primary');
            try {
              const res = await api.cart.remove(pId);
              if (res.success) {
                store.showToast('Item removed from cart', 'info');
                store.navigateTo('cart');
              }
            } catch (err) {
              store.showToast(err.message, 'error');
            }
            return;
          }

          try {
            const res = await api.cart.updateQty(pId, currentQty - 1);
            if (res.success) {
              store.setCart(res.cart);
              store.navigateTo('cart');
            }
          } catch (err) {
            store.showToast(err.message, 'error');
          }
        });
      });

      // 2. Quantity adjust plus
      container.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pId = btn.getAttribute('data-id');
          const currentQty = Number(btn.getAttribute('data-qty'));
          const stock = Number(btn.getAttribute('data-stock'));

          if (currentQty >= stock) {
            store.showToast(`Insufficient stock (Only ${stock} available)`, 'error');
            return;
          }

          try {
            const res = await api.cart.updateQty(pId, currentQty + 1);
            if (res.success) {
              store.setCart(res.cart);
              store.navigateTo('cart');
            }
          } catch (err) {
            store.showToast(err.message, 'error');
          }
        });
      });

      // 3. Remove Button Click
      container.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pId = btn.getAttribute('data-id');
          btn.innerHTML = getSpinner('small', 'primary');
          try {
            const res = await api.cart.remove(pId);
            if (res.success) {
              store.showToast('Product removed from cart successfully', 'info');
              store.navigateTo('cart');
            }
          } catch (err) {
            store.showToast(err.message, 'error');
          }
        });
      });

      // 4. Apply Coupon Button Click
      const applyCouponBtn = container.querySelector('#apply-coupon-btn');
      if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
          const code = container.querySelector('#coupon-input').value.trim();
          if (!code) {
            store.showToast('Please enter a coupon code.', 'error');
            return;
          }
          const success = store.applyCoupon(code);
          if (success) {
            store.navigateTo('cart');
          }
        });
      }

      // 5. Remove Coupon Button Click
      const removeCouponBtn = container.querySelector('#remove-coupon-btn');
      if (removeCouponBtn) {
        removeCouponBtn.addEventListener('click', () => {
          store.removeCoupon();
          store.navigateTo('cart');
        });
      }

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="text-center py-16 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
          <p class="text-sm font-semibold">Failed to load shopping cart: ${error.message}</p>
          <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-4">Go to Catalogue</button>
        </div>
      `;
    }
  }, 100);

  return container;
};

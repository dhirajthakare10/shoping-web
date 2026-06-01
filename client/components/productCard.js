import store from '../context/store.js';

export const renderProductCard = (product) => {
  const { _id, title, category, price, discountPrice, images, stock, ratings } = product;
  
  const isWishlisted = store.isInWishlist(_id);
  const image = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400';
  const hasDiscount = discountPrice && discountPrice > 0;
  
  // Calculate discount percentage
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const displayPrice = hasDiscount ? discountPrice : price;
  const isOutOfStock = stock <= 0;

  // Star Ratings renderer
  let starsHtml = '';
  const roundedRating = Math.round(ratings || 0);
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      starsHtml += `<svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    } else {
      starsHtml += `<svg class="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.173-.439.81-.439.982 0l3.07 7.625 8.27.828c.502.05.702.676.338 1.017l-6.19 5.8 1.84 8.168c.112.502-.423.89-.875.602L12 18.735l-7.625 4.793c-.452.288-.987-.1-.875-.602l1.84-8.168-6.19-5.8c-.364-.341-.164-.967.338-1.017l8.27-.828 3.07-7.625z"/></svg>`;
    }
  }

  return `
    <div class="group relative flex flex-col w-full glass-card hover:shadow-xl hover:shadow-primary-500/5 transform hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-id="${_id}">
      
      <!-- Badges and Image -->
      <div class="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        
        <!-- Discount Badge -->
        ${hasDiscount ? `
          <span class="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-semibold tracking-wider text-white bg-rose-500 rounded-lg shadow-md animate-pulse-subtle">
            -${discountPercent}%
          </span>
        ` : ''}

        <!-- Out of Stock Overlay -->
        ${isOutOfStock ? `
          <div class="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <span class="px-4 py-2 text-xs font-bold tracking-wider text-white bg-slate-900 border border-slate-700 rounded-xl uppercase">
              Sold Out
            </span>
          </div>
        ` : ''}
        
        <!-- Wishlist Button -->
        <button 
          class="wishlist-btn absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/40 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 shadow-md transform hover:scale-110 active:scale-95 transition-all duration-200"
          data-id="${_id}"
          title="Add to Wishlist"
        >
          <svg class="w-5 h-5 ${isWishlisted ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'stroke-current'}" fill="none" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        <!-- Product Image -->
        <img 
          src="${image}" 
          alt="${title}"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onclick="window.location.hash = '#/productDetails?id=${_id}'"
        />
      </div>

      <!-- Information details -->
      <div class="flex flex-col flex-1 p-5">
        
        <!-- Category -->
        <span class="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1.5">${category}</span>
        
        <!-- Title -->
        <h3 
          class="text-sm font-semibold tracking-wide hover:text-primary-500 line-clamp-2 cursor-pointer transition-colors mb-2"
          onclick="window.location.hash = '#/productDetails?id=${_id}'"
        >
          ${title}
        </h3>

        <!-- Rating Stars -->
        <div class="flex items-center gap-1 mb-4">
          <div class="flex">${starsHtml}</div>
          <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">(${ratings || 0})</span>
        </div>

        <!-- Pricing & Buy button at bottom -->
        <div class="flex items-end justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/40">
          <div class="flex flex-col">
            ${hasDiscount ? `
              <span class="text-xs text-slate-400 line-through mb-0.5">$${price.toFixed(2)}</span>
            ` : ''}
            <span class="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
              $${displayPrice.toFixed(2)}
            </span>
          </div>

          <!-- Add to Cart trigger -->
          <button 
            class="add-to-cart-btn flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              isOutOfStock 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 text-white shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-95 transform hover:-translate-y-0.5'
            }"
            data-id="${_id}"
            ${isOutOfStock ? 'disabled' : ''}
            title="Add to Cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  `;
};

export default renderProductCard;

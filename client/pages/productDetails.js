import api from '../services/api.js';
import store from '../context/store.js';
import { renderProductCard } from '../components/productCard.js';
import { getSpinner } from '../components/spinner.js';

export const renderProductDetails = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-12';

  const productId = store.getState().activeProductParams;
  
  if (!productId) {
    container.innerHTML = `
      <div class="text-center py-16 glass-panel rounded-2xl">
        <p class="text-slate-400 font-medium">Invalid Product Parameters. Please return to Shop.</p>
        <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-4">Go to Shop</button>
      </div>
    `;
    return container;
  }

  // Render initial loading spinner
  container.innerHTML = getSpinner('large');

  // Trigger API calls
  setTimeout(async () => {
    try {
      const response = await api.products.getById(productId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to load details');
      }

      const { product, relatedProducts } = response;
      const { title, description, category, price, discountPrice, images, stock, ratings, reviews } = product;

      const hasDiscount = discountPrice && discountPrice > 0;
      const displayPrice = hasDiscount ? discountPrice : price;
      const isOutOfStock = stock <= 0;
      const isLowStock = !isOutOfStock && stock <= 5;
      const isWishlisted = store.isInWishlist(product._id);

      // Star Ratings renderer
      let starsHtml = '';
      const roundedRating = Math.round(ratings || 0);
      for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
          starsHtml += `<svg class="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
        } else {
          starsHtml += `<svg class="w-5 h-5 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.173-.439.81-.439.982 0l3.07 7.625 8.27.828c.502.05.702.676.338 1.017l-6.19 5.8 1.84 8.168c.112.502-.423.89-.875.602L12 18.735l-7.625 4.793c-.452.288-.987-.1-.875-.602l1.84-8.168-6.19-5.8c-.364-.341-.164-.967.338-1.017l8.27-.828 3.07-7.625z"/></svg>`;
        }
      }

      const mainImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800';

      // Complete layout rendering
      container.innerHTML = `
        
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span class="cursor-pointer hover:text-primary-500" onclick="window.location.hash = '#/home'">Home</span>
          <span>/</span>
          <span class="cursor-pointer hover:text-primary-500" onclick="store.setState({ selectedCategory: '${category}' }); window.location.hash = '#/shop';">${category}</span>
          <span>/</span>
          <span class="text-slate-600 dark:text-slate-300 truncate max-w-xs">${title}</span>
        </div>

        <!-- Product Presentation Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          <!-- Product Media Gallery -->
          <div class="flex flex-col gap-4">
            <div class="w-full aspect-square rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative shadow-lg">
              <img id="main-product-image" src="${mainImage}" alt="${title}" class="w-full h-full object-cover" />
              
              <!-- Zoom ambient scale overlay -->
              <div class="absolute bottom-4 right-4 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] uppercase font-bold tracking-widest shadow-md">
                Enlarge View
              </div>
            </div>

            <!-- Thumbnail Slider -->
            ${images && images.length > 1 ? `
              <div class="flex gap-3">
                ${images.map((img, i) => `
                  <button 
                    class="thumb-btn w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? 'border-primary-500 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-primary-500'}"
                    data-src="${img}"
                  >
                    <img src="${img}" class="w-full h-full object-cover" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Product Details Block -->
          <div class="flex flex-col gap-6 text-left">
            <div class="flex flex-col gap-2">
              <span class="text-xs uppercase tracking-widest text-primary-500 font-extrabold">${category}</span>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">${title}</h1>
              
              <!-- Stars & ratings -->
              <div class="flex items-center gap-2 mt-2">
                <div class="flex">${starsHtml}</div>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${ratings || '0.0'} / 5.0</span>
                <span class="text-slate-300 dark:text-slate-700 font-bold">|</span>
                <span class="text-xs text-slate-400 dark:text-slate-500 font-semibold">${reviews.length} Verified Reviews</span>
              </div>
            </div>

            <!-- Pricing Details -->
            <div class="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800/20 flex flex-col gap-2">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-black text-slate-900 dark:text-white">$${displayPrice.toFixed(2)}</span>
                ${hasDiscount ? `
                  <span class="text-base text-slate-400 line-through font-semibold">$${price.toFixed(2)}</span>
                  <span class="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg">Discount Active</span>
                ` : ''}
              </div>
              
              <!-- Stock status badge -->
              <div class="mt-2.5 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full ${
                  isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                }"></span>
                <span class="text-xs font-bold uppercase tracking-wider ${
                  isOutOfStock ? 'text-rose-500' : isLowStock ? 'text-amber-500' : 'text-emerald-500'
                }">
                  ${isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock (Only ${stock} left!)` : 'In Stock & Ready to Ship'}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-2">
              <h4 class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Product Story</h4>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">${description}</p>
            </div>

            <!-- Quantity Selector & Actions -->
            ${!isOutOfStock ? `
              <div class="flex flex-col gap-3.5 pt-4 border-t border-slate-150 dark:border-slate-800/40">
                <div class="flex items-center gap-4">
                  <span class="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Select Qty:</span>
                  <div class="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden w-32 bg-white dark:bg-slate-950">
                    <button id="qty-minus" class="px-3.5 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-500 font-bold transition-colors">-</button>
                    <span id="qty-val" class="flex-1 text-center font-bold text-sm text-slate-800 dark:text-white">1</span>
                    <button id="qty-plus" class="px-3.5 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-500 font-bold transition-colors">+</button>
                  </div>
                </div>

                <div class="flex flex-wrap gap-4 mt-3">
                  <!-- Buy Now/Add To Cart Button -->
                  <button id="add-to-cart-action-btn" class="btn-primary flex-1 min-w-[200px] flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    Add to Cart Bag
                  </button>

                  <!-- Toggle Wishlist -->
                  <button 
                    id="wishlist-action-btn" 
                    class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:border-rose-500/30 flex items-center justify-center transition-all"
                  >
                    <svg class="w-6 h-6 ${isWishlisted ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'stroke-current'}" fill="none" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              </div>
            ` : `
              <div class="col-span-full border-t border-slate-200/40 dark:border-slate-800/40 pt-4 flex gap-4">
                <button disabled class="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed rounded-xl font-bold uppercase tracking-wider flex-1 text-center">
                  Out of Stock
                </button>
                <button 
                  id="wishlist-action-btn"
                  class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all"
                >
                  <svg class="w-6 h-6 ${isWishlisted ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'stroke-current'}" fill="none" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
            `}

          </div>
        </div>

        <!-- Reviews & Ratings Section -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 border-t border-slate-200/40 dark:border-slate-800/40 pt-12">
          
          <!-- Rating Stats Widget -->
          <div class="lg:col-span-1 flex flex-col gap-5 text-left">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">Verified Ratings</h3>
            <div class="glass-panel p-6 rounded-2xl text-center flex flex-col justify-center items-center gap-3">
              <span class="text-5xl font-black text-slate-900 dark:text-white leading-none">${ratings || '0.0'}</span>
              <div class="flex">${starsHtml}</div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Average User Rating</span>
            </div>
            
            <!-- Submit Review Form Block -->
            ${store.getState().user ? `
              <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <h4 class="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Leave a Review</h4>
                <div class="flex items-center gap-1.5" id="review-stars-selection">
                  ${[1, 2, 3, 4, 5].map(s => `
                    <button class="review-star-select-btn text-slate-300 dark:text-slate-700 hover:text-amber-400 transition-colors" data-star="${s}">
                      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </button>
                  `).join('')}
                </div>
                <textarea 
                  id="review-comment-input" 
                  placeholder="Share your thoughts about this premium goods..." 
                  class="w-full p-3 text-xs bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white font-sans"
                  rows="3"
                ></textarea>
                <button 
                  id="submit-review-btn"
                  class="w-full py-2.5 bg-slate-850 hover:bg-slate-750 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Submit Feedback
                </button>
              </div>
            ` : `
              <div class="glass-panel p-5 rounded-2xl text-center flex flex-col items-center justify-center py-8">
                <p class="text-xs text-slate-400 font-semibold leading-relaxed">Want to submit feedback?<br>Please sign in to leave reviews.</p>
                <button onclick="window.location.hash = '#/login'" class="mt-3.5 px-4 py-2 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold tracking-wide">
                  Sign In
                </button>
              </div>
            `}
          </div>

          <!-- Reviews Feed List -->
          <div class="lg:col-span-2 flex flex-col gap-6 text-left">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">User Feedback (${reviews.length})</h3>
            
            <div class="flex flex-col gap-4" id="reviews-feed-mount">
              ${reviews.length > 0 ? reviews.map(rev => {
                let revStars = '';
                for (let i = 1; i <= 5; i++) {
                  revStars += `<svg class="w-3.5 h-3.5 ${i <= rev.rating ? 'text-amber-400 fill-current' : 'text-slate-200 dark:text-slate-800'}" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
                }
                const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                
                return `
                  <div class="glass-panel p-4.5 rounded-2xl flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                      <div>
                        <h5 class="text-xs font-bold text-slate-800 dark:text-white">${rev.name}</h5>
                        <div class="flex gap-0.5 mt-0.5">${revStars}</div>
                      </div>
                      <span class="text-[10px] text-slate-400 font-bold">${formattedDate}</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-300 leading-normal font-sans">${rev.comment}</p>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-10 glass-panel rounded-2xl">
                  <p class="text-xs text-slate-400 font-semibold">No reviews submitted yet. Be the first to review!</p>
                </div>
              `}
            </div>
          </div>

        </section>

        <!-- Related Products Section -->
        ${relatedProducts.length > 0 ? `
          <section class="flex flex-col gap-6 pt-12 border-t border-slate-200/40 dark:border-slate-800/40">
            <div class="flex flex-col gap-1.5 text-left">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">You May Also Like</h3>
              <p class="text-xs text-slate-400">Discover handpicked premium pairs in same styling collections.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              ${relatedProducts.map(p => renderProductCard(p)).join('')}
            </div>
          </section>
        ` : ''}

      `;

      // 1. Thumbnail Buttons Event
      container.querySelectorAll('.thumb-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const newSrc = btn.getAttribute('data-src');
          container.querySelector('#main-product-image').src = newSrc;
          
          container.querySelectorAll('.thumb-btn').forEach(b => {
            b.classList.remove('border-primary-500', 'scale-[1.02]');
            b.classList.add('border-slate-200', 'dark:border-slate-800');
          });
          btn.classList.add('border-primary-500', 'scale-[1.02]');
        });
      });

      // 2. Quantity Adjusters
      let selectedQty = 1;
      const qtyMinus = container.querySelector('#qty-minus');
      const qtyPlus = container.querySelector('#qty-plus');
      const qtyVal = container.querySelector('#qty-val');

      if (qtyMinus && qtyPlus) {
        qtyMinus.addEventListener('click', () => {
          if (selectedQty > 1) {
            selectedQty--;
            qtyVal.innerText = selectedQty;
          }
        });

        qtyPlus.addEventListener('click', () => {
          if (selectedQty < stock) {
            selectedQty++;
            qtyVal.innerText = selectedQty;
          } else {
            store.showToast(`Only ${stock} items left in stock`, 'error');
          }
        });
      }

      // 3. Add to Cart action click
      const cartActionBtn = container.querySelector('#add-to-cart-action-btn');
      if (cartActionBtn) {
        cartActionBtn.addEventListener('click', async () => {
          if (!store.getState().user) {
            store.showToast('Please sign in to shop items.', 'error');
            store.navigateTo('login');
            return;
          }

          cartActionBtn.innerHTML = getSpinner('small', 'white');
          try {
            const result = await api.cart.add(product._id, selectedQty);
            if (result.success) {
              store.setCart(result.cart);
              store.showToast(`Successfully added ${selectedQty}x items to your cart!`, 'success');
            }
          } catch (error) {
            store.showToast(error.message, 'error');
          } finally {
            cartActionBtn.innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              Add to Cart Bag
            `;
          }
        });
      }

      // 4. Wishlist action click
      const wishlistActionBtn = container.querySelector('#wishlist-action-btn');
      if (wishlistActionBtn) {
        wishlistActionBtn.addEventListener('click', () => {
          store.toggleWishlist(product);
          // Re-render detailing pages triggers
          store.navigateTo('productDetails', product._id);
        });
      }

      // 5. Review Stars Selection Binding
      let selectedStarRating = 0;
      const starBtns = container.querySelectorAll('.review-star-select-btn');
      starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          selectedStarRating = Number(btn.getAttribute('data-star'));
          starBtns.forEach(b => {
            const index = Number(b.getAttribute('data-star'));
            if (index <= selectedStarRating) {
              b.className = 'review-star-select-btn text-amber-400 transition-colors';
            } else {
              b.className = 'review-star-select-btn text-slate-300 dark:text-slate-700 hover:text-amber-400 transition-colors';
            }
          });
        });
      });

      // 6. Submit Review Actions
      const submitReviewBtn = container.querySelector('#submit-review-btn');
      if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', async () => {
          const commentInput = container.querySelector('#review-comment-input');
          const comment = commentInput.value.trim();

          if (selectedStarRating === 0) {
            store.showToast('Please select star rating scale.', 'error');
            return;
          }

          if (!comment) {
            store.showToast('Please write review comment.', 'error');
            return;
          }

          submitReviewBtn.innerHTML = getSpinner('small', 'white');
          try {
            const result = await api.products.submitReview(product._id, selectedStarRating, comment);
            if (result.success) {
              store.showToast('Review submitted successfully!', 'success');
              // Reload page details view
              store.navigateTo('productDetails', product._id);
            }
          } catch (error) {
            store.showToast(error.message, 'error');
          } finally {
            submitReviewBtn.innerText = 'Submit Feedback';
          }
        });
      }

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="text-center py-16 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
          <p class="text-sm font-semibold">Failed to fetch product details: ${error.message}</p>
          <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-4.5">Back to Catalogue</button>
        </div>
      `;
    }
  }, 100);

  return container;
};

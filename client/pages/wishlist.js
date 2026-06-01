import store from '../context/store.js';
import { renderProductCard } from '../components/productCard.js';

export const renderWishlist = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8';

  const wishlist = store.getState().wishlist || [];

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="text-center py-20 glass-panel rounded-2xl max-w-lg mx-auto flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-3xl shadow-inner">💖</div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">Your Wishlist is Empty</h3>
        <p class="text-xs text-slate-400 max-w-xs leading-relaxed font-sans">You haven't saved any of our premium lifestyle products to your wishlist yet. Explore our latest drops and bookmark them.</p>
        <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-2">Explore Catalogue</button>
      </div>
    `;
    return container;
  }

  container.innerHTML = `
    <div class="border-b border-slate-200/40 dark:border-slate-800/40 pb-4 text-left">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">My Wishlist Saves</h1>
      <p class="text-xs text-slate-400 mt-1">Review saved items and add them to your cart.</p>
    </div>

    <!-- Saved items list grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${wishlist.map(p => renderProductCard(p)).join('')}
    </div>
  `;

  return container;
};

import store from './context/store.js';
import router from './utils/router.js'; // Ensures router registers global window hashes
import { renderHeader } from './layouts/header.js';
import { renderFooter } from './layouts/footer.js';

// Import Page Views
import { renderHome } from './pages/home.js';
import { renderShop } from './pages/shop.js';
import { renderProductDetails } from './pages/productDetails.js';
import { renderCart } from './pages/cart.js';
import { renderWishlist } from './pages/wishlist.js';
import { renderCheckout } from './pages/checkout.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderProfile } from './pages/profile.js';
import { renderOrders } from './pages/orders.js';
import { renderAdminDashboard } from './pages/adminDashboard.js';
import { renderProductManagement } from './pages/productManagement.js';
import { renderUserManagement } from './pages/userManagement.js';

// Import API and custom component helpers
import api from './services/api.js';

const pageRenderers = {
  home: renderHome,
  shop: renderShop,
  productDetails: renderProductDetails,
  cart: renderCart,
  wishlist: renderWishlist,
  checkout: renderCheckout,
  login: renderLogin,
  register: renderRegister,
  profile: renderProfile,
  orders: renderOrders,
  adminDashboard: renderAdminDashboard,
  productManagement: renderProductManagement,
  userManagement: renderUserManagement
};

// Main dynamic application renderer
const renderApp = async (state) => {
  const appMount = document.getElementById('app');
  if (!appMount) return;

  // Clear App Container
  appMount.innerHTML = '';

  // 1. Render and append sticky premium header
  const headerHtml = renderHeader(state);
  const headerWrapper = document.createElement('div');
  headerWrapper.innerHTML = headerHtml.trim();
  const headerNode = headerWrapper.firstChild;
  appMount.appendChild(headerNode);

  // 2. Render and append dynamic page content main block
  const mainContentNode = document.createElement('main');
  mainContentNode.className = 'flex-grow min-h-[50vh] flex flex-col items-center bg-slate-50 dark:bg-[#0b0b0f] text-slate-800 dark:text-slate-100 transition-colors duration-300';
  
  const pageName = state.activePage || 'home';
  const pageGenerator = pageRenderers[pageName] || renderHome;
  
  // Call the dynamic asynchronous page element generator
  const activePageElement = await pageGenerator();
  mainContentNode.appendChild(activePageElement);
  appMount.appendChild(mainContentNode);

  // 3. Render and append elegant structured footer
  const footerHtml = renderFooter();
  const footerWrapper = document.createElement('div');
  footerWrapper.innerHTML = footerHtml.trim();
  const footerNode = footerWrapper.firstChild;
  appMount.appendChild(footerNode);

  // 4. BIND GLOBAL NAVBAR & LAYOUT LISTENERS (Re-bound on DOM rebuild)
  bindLayoutEvents(appMount, state);
};

// Bind UI actions dynamically
const bindLayoutEvents = (appMount, state) => {
  // A. Theme Toggle Button
  const themeToggle = appMount.querySelector('#theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      store.toggleTheme();
    });
  }

  // B. Logout Button
  const logoutBtn = appMount.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }

  // C. Mobile Menu Expand
  const mobileMenuBtn = appMount.querySelector('#mobile-menu-btn');
  const mobileNavPanel = appMount.querySelector('#mobile-nav-panel');
  if (mobileMenuBtn && mobileNavPanel) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavPanel.classList.toggle('hidden');
    });
  }

  // D. Quick Search Inputs
  const searchInput = appMount.querySelector('#nav-search-input');
  const mobileSearchInput = appMount.querySelector('#mobile-search-input');

  const triggerQuickSearch = (keyword) => {
    store.setState({ searchKeyword: keyword });
    store.navigateTo('shop');
  };

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        triggerQuickSearch(e.target.value.trim());
      }
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        triggerQuickSearch(e.target.value.trim());
      }
    });
  }

  // E. Dynamic Product Cards Event Delegator (Handles card triggers: Add to cart & Wishlist clicks from ANY view!)
  appMount.addEventListener('click', async (e) => {
    
    // Add to Cart Bag Delegated Click
    const addToCartBtn = e.target.closest('.add-to-cart-btn');
    if (addToCartBtn) {
      e.stopPropagation();
      
      if (!store.getState().user) {
        store.showToast('Please sign in to buy items.', 'error');
        store.navigateTo('login');
        return;
      }

      const pId = addToCartBtn.getAttribute('data-id');
      const originalHtml = addToCartBtn.innerHTML;
      
      // Inline visual load transition
      addToCartBtn.innerHTML = `
        <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;

      try {
        const result = await api.cart.add(pId, 1);
        if (result.success) {
          store.setCart(result.cart);
          store.showToast('Item successfully added to cart!', 'success');
        }
      } catch (err) {
        store.showToast(err.message, 'error');
      } finally {
        addToCartBtn.innerHTML = originalHtml;
      }
    }

    // Wishlist Delegated Click
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
      e.stopPropagation();
      const pId = wishlistBtn.getAttribute('data-id');
      
      // Find full product details from DOM grids attributes or cards datasets (to toggle locally instantly!)
      // Simply trigger getById or fallback mock properties
      try {
        const res = await api.products.getById(pId);
        if (res.success) {
          store.toggleWishlist(res.product);
        }
      } catch (err) {
        console.error('Failed to toggle wishlist:', err);
      }
    }

  });
};

// 1. Subscribe dynamic UI renderer to active Store changes
store.subscribe((state) => {
  renderApp(state);
});

// 2. Initialize Roster Sync on cold start
const initApplicationSession = async () => {
  const token = store.getState().token;
  if (token) {
    try {
      // Sync Cart totals with database
      const cartRes = await api.cart.get();
      if (cartRes.success) {
        store.setCart(cartRes.cart);
      }
    } catch (err) {
      console.warn('Cold startup session validation expired/failed:', err.message);
      store.logout();
    }
  }

  // Initial cold mount trigger
  renderApp(store.getState());
};

// Launch cold session loader
initApplicationSession();

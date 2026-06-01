// Premium Reactive Global State Store for Vanilla JS SPA

class GlobalStore {
  constructor() {
    // 1. Initial State from persistence
    this.state = {
      user: JSON.parse(localStorage.getItem('crazydeal_user')) || null,
      token: localStorage.getItem('crazydeal_token') || null,
      cart: { products: [], totalPrice: 0 },
      wishlist: JSON.parse(localStorage.getItem('crazydeal_wishlist')) || [],
      theme: localStorage.getItem('crazydeal_theme') || 'dark', // default dark mode for luxury look
      toasts: [],
      activePage: 'home',
      activeProductParams: null, // to pass ID to detail page
      searchKeyword: '',
      selectedCategory: 'All',
      sortOption: 'newest',
      appliedCoupon: null
    };

    // 2. State Change Subscribers
    this.listeners = [];

    // Initialize Theme
    this.applyTheme();
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Trigger state updates
  setState(newState) {
    this.state = { ...this.state, ...newState };
    
    // Persist critical nodes
    if (newState.user !== undefined) {
      if (this.state.user) {
        localStorage.setItem('crazydeal_user', JSON.stringify(this.state.user));
      } else {
        localStorage.removeItem('crazydeal_user');
      }
    }
    
    if (newState.token !== undefined) {
      if (this.state.token) {
        localStorage.setItem('crazydeal_token', this.state.token);
      } else {
        localStorage.removeItem('crazydeal_token');
      }
    }

    if (newState.wishlist !== undefined) {
      localStorage.setItem('crazydeal_wishlist', JSON.stringify(this.state.wishlist));
    }

    if (newState.theme !== undefined) {
      localStorage.setItem('crazydeal_theme', this.state.theme);
      this.applyTheme();
    }

    // Call all active rendering listeners
    this.listeners.forEach(listener => listener(this.state));
  }

  // Retrieve current active state values
  getState() {
    return this.state;
  }

  // Theme Sync Layer
  applyTheme() {
    const isDark = this.state.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  // Toggle Theme
  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: nextTheme });
    this.showToast(`Theme changed to ${nextTheme} mode`, 'info');
  }

  // Global Cart Sync Helpers
  setCart(cartData) {
    this.setState({ cart: cartData });
  }

  // Wishlist Handling
  toggleWishlist(product) {
    let list = [...this.state.wishlist];
    const index = list.findIndex(p => p._id === product._id);
    
    if (index > -1) {
      list = list.filter(p => p._id !== product._id);
      this.showToast(`${product.title} removed from wishlist`, 'info');
    } else {
      list.push(product);
      this.showToast(`${product.title} added to wishlist!`, 'success');
    }
    this.setState({ wishlist: list });
  }

  isInWishlist(productId) {
    return this.state.wishlist.some(p => p._id === productId);
  }

  // Coupon Operations
  applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'CRAZY50' || cleanCode === '50OFF') {
      this.setState({
        appliedCoupon: {
          code: cleanCode,
          discountPercent: 50
        }
      });
      this.showToast('50% discount coupon applied successfully!', 'success');
      return true;
    } else {
      this.showToast('Invalid coupon code.', 'error');
      return false;
    }
  }

  removeCoupon() {
    this.setState({ appliedCoupon: null });
    this.showToast('Coupon removed.', 'info');
  }

  // Toast Trigger Queue
  showToast(message, type = 'success') {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, message, type };
    
    // Add to state toasts
    this.setState({ toasts: [...this.state.toasts, newToast] });

    // Mount toast in DOM stack immediately via the component trigger
    const toastRoot = document.getElementById('toast-root');
    if (toastRoot) {
      const toastEl = document.createElement('div');
      toastEl.id = id;
      toastEl.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transform translate-x-12 opacity-0 transition-all duration-300 ${
        type === 'success' 
          ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
          : type === 'error'
          ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400'
          : 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
      }`;

      // Set icons based on style
      const icon = type === 'success' 
        ? `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>`
        : type === 'error'
        ? `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path></svg>`
        : `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg>`;

      toastEl.innerHTML = `
        ${icon}
        <span class="text-sm font-medium pr-2">${message}</span>
        <button class="ml-auto text-current opacity-60 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      `;

      toastRoot.appendChild(toastEl);
      
      // Animate In
      setTimeout(() => {
        toastEl.classList.remove('translate-x-12', 'opacity-0');
        toastEl.classList.add('translate-x-0', 'opacity-100');
      }, 50);

      // Auto Destroy Timer
      setTimeout(() => {
        toastEl.classList.add('translate-x-12', 'opacity-0');
        setTimeout(() => toastEl.remove(), 300);
        this.setState({ toasts: this.state.toasts.filter(t => t.id !== id) });
      }, 4000);
    }
  }

  // Perform Log Out cleanup
  logout() {
    this.setState({
      user: null,
      token: null,
      cart: { products: [], totalPrice: 0 },
      appliedCoupon: null
    });
    this.showToast('Logged out successfully', 'info');
    this.navigateTo('home');
  }

  // Navigate Trigger
  navigateTo(pageName, params = null) {
    this.setState({ 
      activePage: pageName, 
      activeProductParams: params 
    });
    // Scroll to top automatically
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Update hash for browser back/forward buttons
    window.location.hash = `#/${pageName}${params ? `?id=${params}` : ''}`;
  }
}

const store = new GlobalStore();
export default store;
export { store };

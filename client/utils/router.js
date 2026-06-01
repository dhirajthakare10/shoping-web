import store from '../context/store.js';

// Route definition mapping
// meta: { requiresAuth: boolean, requiresAdmin: boolean }
const routes = {
  home: { title: 'Home | Antigravity Store', requiresAuth: false, requiresAdmin: false },
  shop: { title: 'Shop | Catalogue', requiresAuth: false, requiresAdmin: false },
  productDetails: { title: 'Product Details', requiresAuth: false, requiresAdmin: false },
  cart: { title: 'Shopping Cart', requiresAuth: false, requiresAdmin: false },
  wishlist: { title: 'Wishlist | My Saves', requiresAuth: false, requiresAdmin: false },
  checkout: { title: 'Secure Checkout', requiresAuth: true, requiresAdmin: false },
  login: { title: 'Sign In | Antigravity', requiresAuth: false, requiresAdmin: false },
  register: { title: 'Create Account', requiresAuth: false, requiresAdmin: false },
  profile: { title: 'My Profile', requiresAuth: true, requiresAdmin: false },
  orders: { title: 'Order Tracking', requiresAuth: true, requiresAdmin: false },
  adminDashboard: { title: 'Admin | Dashboard', requiresAuth: true, requiresAdmin: true },
  productManagement: { title: 'Admin | Products', requiresAuth: true, requiresAdmin: true },
  userManagement: { title: 'Admin | Users', requiresAuth: true, requiresAdmin: true }
};

class SPARouter {
  constructor() {
    this.currentRoute = null;
    
    // Bind hash change listeners
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('load', () => this.handleRouting());
  }

  // Parse hash parameters, e.g. #/productDetails?id=6607062bf6a5a04
  parseHash() {
    const hash = window.location.hash || '#/home';
    const pathParts = hash.slice(2).split('?');
    const page = pathParts[0] || 'home';
    
    let params = null;
    if (pathParts[1]) {
      const searchParams = new URLSearchParams(pathParts[1]);
      params = searchParams.get('id'); // Get target object ID if provided
    }

    return { page, params };
  }

  // Route controller logic
  async handleRouting() {
    const { page, params } = this.parseHash();
    
    // Fallback if requested page doesn't exist
    const routeConfig = routes[page] || routes['home'];
    const targetPage = routes[page] ? page : 'home';

    const user = store.getState().user;

    // 1. Guard check: Authentication required
    if (routeConfig.requiresAuth && !user) {
      store.showToast('Authentication required. Please sign in.', 'error');
      store.setState({ activePage: 'login' });
      window.location.hash = '#/login';
      return;
    }

    // 2. Guard check: Admin authorization required
    if (routeConfig.requiresAdmin && (!user || user.role !== 'admin')) {
      store.showToast('Access denied. Administrator privileges required.', 'error');
      store.setState({ activePage: 'home' });
      window.location.hash = '#/home';
      return;
    }

    // Set page title
    document.title = routeConfig.title;

    // Save routing inside global store states
    store.setState({
      activePage: targetPage,
      activeProductParams: params
    });
  }
}

const router = new SPARouter();
export default router;

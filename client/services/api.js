import store from '../context/store.js';

// Base Request Wrapper that injects JWT tokens & handles errors centrally
const request = async (url, options = {}) => {
  const token = store.getState().token;
  
  // Prepare headers
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Setup content type if not uploading binary files (Multipart Data)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Auto logout if token expires or is invalid
      if (response.status === 401 && token) {
        store.logout();
        store.showToast('Session expired. Please log in again.', 'error');
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${url}:`, error.message);
    throw error;
  }
};

// API Services Layer
export const api = {
  // Authentication
  auth: {
    login: (email, password) => request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    register: (name, email, password) => request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),
    getProfile: () => request('/api/auth/profile'),
    updateProfile: (profileData) => request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  // Products Catalogue
  products: {
    getAll: (params = {}) => {
      // Construct query parameters string
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/api/products${queryString}`);
    },
    getById: (id) => request(`/api/products/${id}`),
    submitReview: (id, rating, comment) => request(`/api/products/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    }),
    // Admin CRUD
    create: (formData) => request('/api/products', {
      method: 'POST',
      body: formData // Must be FormData for file uploads
    }),
    update: (id, formData) => request(`/api/products/${id}`, {
      method: 'PUT',
      body: formData
    }),
    delete: (id) => request(`/api/products/${id}`, {
      method: 'DELETE'
    })
  },

  // Shopping Cart Actions
  cart: {
    get: () => request('/api/cart'),
    add: (productId, quantity = 1) => request('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    }),
    updateQty: (productId, quantity) => request('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity })
    }),
    remove: (productId) => request(`/api/cart/${productId}`, {
      method: 'DELETE'
    })
  },

  // Checkout and Orders
  orders: {
    place: (orderData) => request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
    createRazorpay: (amount) => request('/api/orders/razorpay/create', {
      method: 'POST',
      body: JSON.stringify({ amount })
    }),
    verifyRazorpay: (paymentData) => request('/api/orders/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),
    getMyOrders: () => request('/api/orders/my-orders'),
    getById: (id) => request(`/api/orders/${id}`),
    // Admin orders management
    adminGetAll: () => request('/api/orders/admin/all'),
    adminUpdateStatus: (id, orderStatus, paymentStatus) => request(`/api/orders/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus, paymentStatus })
    })
  },

  // Administrator Controls
  admin: {
    getAnalytics: () => request('/api/admin/dashboard'),
    getUsers: () => request('/api/admin/users'),
    toggleUserRole: (id) => request(`/api/admin/users/${id}/role`, {
      method: 'PUT'
    }),
    deleteUser: (id) => request(`/api/admin/users/${id}`, {
      method: 'DELETE'
    })
  }
};

export default api;

import store from '../context/store.js';

export const renderHeader = (state) => {
  const { user, cart, theme, activePage } = state;
  
  // Calculate total items in cart
  const cartCount = cart && cart.products 
    ? cart.products.reduce((acc, item) => acc + item.quantity, 0) 
    : 0;

  const isLoggedIn = !!user;
  const isAdmin = isLoggedIn && user.role === 'admin';

  return `
    <header class="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/40 dark:border-slate-800/40 backdrop-blur-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.hash = '#/home'">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span class="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <span class="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent sm:block">
              CRAZY DEAL
            </span>
          </div>

          <!-- Main Nav Links - Desktop -->
          <nav class="hidden md:flex items-center gap-8">
            <button onclick="window.location.hash = '#/home'" class="text-sm font-medium transition-colors ${activePage === 'home' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'}">Home</button>
            <button onclick="window.location.hash = '#/shop'" class="text-sm font-medium transition-colors ${activePage === 'shop' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'}">Shop</button>
            <button onclick="window.location.hash = '#/wishlist'" class="text-sm font-medium transition-colors ${activePage === 'wishlist' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'}">Wishlist</button>
            ${isAdmin ? `
              <button onclick="window.location.hash = '#/adminDashboard'" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-200">
                Admin Panel
              </button>
            ` : ''}
          </nav>

          <!-- Interactive Actions Layer -->
          <div class="flex items-center gap-2 sm:gap-4">
            
            <!-- Quick Search Input (Desktop) -->
            <div class="hidden sm:relative sm:block w-48 lg:w-64">
              <input 
                type="text" 
                id="nav-search-input" 
                placeholder="Search products..." 
                class="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-100/80 dark:bg-slate-800/80 border border-transparent dark:border-slate-800 rounded-xl focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all duration-200 text-slate-800 dark:text-white"
                value="${state.searchKeyword || ''}"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Light/Dark Mode Switch -->
            <button 
              id="theme-toggle-btn"
              class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              title="Toggle Theme"
            >
              ${theme === 'dark' 
                ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`
                : `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`
              }
            </button>

            <!-- Wishlist Icon (Mobile Shortcut) -->
            <button 
              onclick="window.location.hash = '#/wishlist'"
              class="relative sm:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              title="My Wishlist"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              ${state.wishlist.length > 0 ? `
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              ` : ''}
            </button>

            <!-- Shopping Cart Icon -->
            <button 
              onclick="window.location.hash = '#/cart'"
              class="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              title="Shopping Cart"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              ${cartCount > 0 ? `
                <span class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-md animate-fade-in">
                  ${cartCount}
                </span>
              ` : ''}
            </button>

            <!-- Separator -->
            <div class="h-6 w-px bg-slate-200 dark:bg-slate-800/80"></div>

            <!-- Profile Menu / Login Options -->
            ${isLoggedIn ? `
              <div class="relative group">
                <button 
                  class="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="profile-dropdown-btn"
                >
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold font-sans uppercase">
                    ${user.name.substring(0, 2)}
                  </div>
                  <span class="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[80px] truncate">${user.name.split(' ')[0]}</span>
                  <svg class="hidden sm:block w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>
                
                <!-- Dropdown Card -->
                <div class="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl glass-panel border border-slate-200/40 dark:border-slate-800/40 shadow-xl py-2 hidden group-hover:block hover:block z-50 animate-slide-up">
                  <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800/40">
                    <p class="text-xs font-bold tracking-tight text-slate-400 uppercase">Signed In As</p>
                    <p class="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">${user.email}</p>
                  </div>
                  
                  <button onclick="window.location.hash = '#/profile'" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/55 dark:hover:bg-slate-800/50 hover:text-primary-500 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                    My Profile
                  </button>

                  <button onclick="window.location.hash = '#/orders'" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/55 dark:hover:bg-slate-800/50 hover:text-primary-500 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    My Orders
                  </button>
                  
                  ${isAdmin ? `
                    <div class="h-px bg-slate-100 dark:bg-slate-800/40 my-1"></div>
                    <button onclick="window.location.hash = '#/adminDashboard'" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-all">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"/></svg>
                      Dashboard
                    </button>
                    <button onclick="window.location.hash = '#/productManagement'" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-all">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
                      Manage Products
                    </button>
                  ` : ''}

                  <div class="h-px bg-slate-100 dark:bg-slate-800/40 my-1"></div>

                  <button id="logout-btn" class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            ` : `
              <button 
                onclick="window.location.hash = '#/login'" 
                class="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 text-xs font-semibold tracking-wide hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200"
              >
                Sign In
              </button>
            `}

            <!-- Mobile Menu Toggle -->
            <button 
              id="mobile-menu-btn"
              class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden hover:text-primary-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

          </div>

        </div>
      </div>

      <!-- Mobile Expandable Nav Menu -->
      <div id="mobile-nav-panel" class="hidden border-t border-slate-200/40 dark:border-slate-800/40 bg-white/90 dark:bg-[#0b0b0f]/90 backdrop-blur-xl px-4 py-4 md:hidden animate-slide-up flex flex-col gap-3">
        
        <!-- Mobile Search -->
        <div class="relative w-full mb-2">
          <input 
            type="text" 
            id="mobile-search-input" 
            placeholder="Search products..." 
            class="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl outline-none text-slate-800 dark:text-white"
            value="${state.searchKeyword || ''}"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button onclick="window.location.hash = '#/home'" class="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activePage === 'home' ? 'text-primary-500 bg-primary-500/5' : 'text-slate-600 dark:text-slate-300'}">Home</button>
        <button onclick="window.location.hash = '#/shop'" class="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activePage === 'shop' ? 'text-primary-500 bg-primary-500/5' : 'text-slate-600 dark:text-slate-300'}">Shop</button>
        <button onclick="window.location.hash = '#/wishlist'" class="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activePage === 'wishlist' ? 'text-primary-500 bg-primary-500/5' : 'text-slate-600 dark:text-slate-300'}">Wishlist</button>
        
        ${isAdmin ? `
          <div class="h-px bg-slate-100 dark:bg-slate-800/40 my-1"></div>
          <button onclick="window.location.hash = '#/adminDashboard'" class="flex w-full items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl">
            Admin Panel
          </button>
        ` : ''}
      </div>
    </header>
  `;
};

export default renderHeader;

import api from '../services/api.js';
import store from '../context/store.js';
import { renderProductCard } from '../components/productCard.js';
import { getSpinner } from '../components/spinner.js';

export const renderShop = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8';

  const state = store.getState();
  const selectedCategory = state.selectedCategory || 'All';
  const searchKeyword = state.searchKeyword || '';
  let activePageNum = 1;
  let activeMinPrice = '';
  let activeMaxPrice = '';
  let activeSort = 'newest';

  // Base page shell structure
  container.innerHTML = `
    <!-- Top Shop Header and Search Stats -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">Catalogue</h1>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1" id="results-count-text">Finding premium items...</p>
      </div>

      <!-- Quick Search + Sort Controls -->
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        <!-- Local Catalogue Search -->
        <div class="relative flex-1 sm:flex-initial min-w-[200px]">
          <input 
            type="text" 
            id="shop-search-input" 
            placeholder="Search matching title..." 
            class="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-500 outline-none text-slate-800 dark:text-white"
            value="${searchKeyword}"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Sort Select -->
        <select 
          id="shop-sort-select"
          class="px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-slate-300 focus:border-primary-500 cursor-pointer"
        >
          <option value="newest" ${activeSort === 'newest' ? 'selected' : ''}>New Arrivals</option>
          <option value="priceAsc" ${activeSort === 'priceAsc' ? 'selected' : ''}>Price: Low to High</option>
          <option value="priceDesc" ${activeSort === 'priceDesc' ? 'selected' : ''}>Price: High to Low</option>
          <option value="rating" ${activeSort === 'rating' ? 'selected' : ''}>Top Rated</option>
        </select>

      </div>
    </div>

    <!-- Main Catalogue Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- Sidebar Filters Form (Desktop) -->
      <aside class="flex flex-col gap-6 lg:col-span-1">
        
        <!-- Category Filter Card -->
        <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Categories</h3>
          <div class="flex flex-col gap-2" id="categories-filter-mount">
            ${['All', 'Baby Products', 'Personal Care', 'Home Cleaning', 'Jewellery', 'Skincare', 'Haircare', 'Household Essentials', 'Electronics', 'Fashion', 'Sneakers', 'Watches', 'Accessories'].map(cat => `
              <button 
                class="category-btn flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }"
                data-category="${cat}"
              >
                <span>${cat}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Price Range Filter Card -->
        <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Price Range ($)</h3>
          <div class="flex items-center gap-2">
            <input 
              type="number" 
              id="price-min-input" 
              placeholder="Min" 
              class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-800 dark:text-white"
              value="${activeMinPrice}"
            />
            <span class="text-slate-400 text-xs font-bold">-</span>
            <input 
              type="number" 
              id="price-max-input" 
              placeholder="Max" 
              class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-800 dark:text-white"
              value="${activeMaxPrice}"
            />
          </div>
          <button 
            id="apply-price-btn"
            class="w-full py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold tracking-wider transition-colors"
          >
            Apply Budget
          </button>
        </div>

      </aside>

      <!-- Products Grid View -->
      <main class="lg:col-span-3 flex flex-col gap-8">
        
        <!-- Active Filter Chips -->
        <div class="flex flex-wrap items-center gap-2" id="active-chips-mount"></div>

        <!-- Products Mount -->
        <div id="shop-products-mount" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          ${getSpinner('medium')}
        </div>

        <!-- Pagination Controls mount -->
        <div id="shop-pagination-mount" class="flex justify-center items-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-800/40"></div>

      </main>

    </div>
  `;

  // Dynamic Query Fetch controller
  const fetchCatalogue = async () => {
    const productsMount = container.querySelector('#shop-products-mount');
    const paginationMount = container.querySelector('#shop-pagination-mount');
    const resultsCountMount = container.querySelector('#results-count-text');
    const chipsMount = container.querySelector('#active-chips-mount');

    productsMount.innerHTML = getSpinner('medium');
    paginationMount.innerHTML = '';

    // Build chip filters list
    let chipsHtml = '';
    const activeState = store.getState();
    const activeCat = activeState.selectedCategory || 'All';
    const activeKW = activeState.searchKeyword || '';

    if (activeCat !== 'All') {
      chipsHtml += `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-500 border border-primary-500/20">${activeCat}</span>`;
    }
    if (activeKW) {
      chipsHtml += `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Search: "${activeKW}"</span>`;
    }
    if (activeMinPrice || activeMaxPrice) {
      chipsHtml += `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">$${activeMinPrice || '0'} - $${activeMaxPrice || '∞'}</span>`;
    }
    chipsMount.innerHTML = chipsHtml;

    try {
      const response = await api.products.getAll({
        keyword: activeKW,
        category: activeCat,
        minPrice: activeMinPrice,
        maxPrice: activeMaxPrice,
        sort: activeSort,
        page: activePageNum,
        limit: 6 // 6 products per page is extremely clean for grid layouts
      });

      if (response.success && response.products.length > 0) {
        // Render Product Cards
        productsMount.innerHTML = response.products.map(p => renderProductCard(p)).join('');
        resultsCountMount.innerText = `Showing ${response.products.length} of ${response.totalProducts} items available`;

        // Render Pagination Nodes
        let paginationHtml = '';
        if (response.totalPages > 1) {
          // Prev button
          paginationHtml += `
            <button 
              class="page-nav-btn p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors ${activePageNum === 1 ? 'opacity-40 cursor-not-allowed' : ''}" 
              data-page="${activePageNum - 1}"
              ${activePageNum === 1 ? 'disabled' : ''}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
          `;

          // Page index numbers
          for (let i = 1; i <= response.totalPages; i++) {
            paginationHtml += `
              <button 
                class="page-num-btn w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                  activePageNum === i 
                    ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20' 
                    : 'border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }"
                data-page="${i}"
              >
                ${i}
              </button>
            `;
          }

          // Next button
          paginationHtml += `
            <button 
              class="page-nav-btn p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors ${activePageNum === response.totalPages ? 'opacity-40 cursor-not-allowed' : ''}" 
              data-page="${activePageNum + 1}"
              ${activePageNum === response.totalPages ? 'disabled' : ''}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          `;
        }
        paginationMount.innerHTML = paginationHtml;

        // Bind Pagination Clicks
        paginationMount.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const targetPage = Number(btn.getAttribute('data-page'));
            if (targetPage && targetPage !== activePageNum) {
              activePageNum = targetPage;
              fetchCatalogue();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
        });

      } else {
        productsMount.innerHTML = `
          <div class="col-span-full flex flex-col items-center justify-center py-16 text-center glass-panel rounded-2xl">
            <span class="text-4xl mb-3">🔍</span>
            <h4 class="text-sm font-bold text-slate-700 dark:text-white">No products found</h4>
            <p class="text-xs text-slate-400 mt-1">Try resetting your filter inputs or matching keywords.</p>
          </div>
        `;
        resultsCountMount.innerText = 'Showing 0 items';
      }
    } catch (error) {
      console.error(error);
      productsMount.innerHTML = `
        <div class="col-span-full text-center py-12 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <p class="text-sm font-semibold">Failed to fetch catalogue items: ${error.message}</p>
        </div>
      `;
    }
  };

  // Event Binding for Categories
  container.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      store.setState({ selectedCategory: cat });
      
      // Update sidebar visual active styles
      container.querySelectorAll('.category-btn').forEach(b => {
        b.className = `category-btn flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          b.getAttribute('data-category') === cat 
            ? 'bg-primary-500 text-white shadow-md' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
        }`;
      });

      activePageNum = 1;
      fetchCatalogue();
    });
  });

  // Event Binding for Searches (Debounced inputs check)
  const searchInput = container.querySelector('#shop-search-input');
  let debouncedTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debouncedTimer);
    debouncedTimer = setTimeout(() => {
      store.setState({ searchKeyword: e.target.value.trim() });
      activePageNum = 1;
      fetchCatalogue();
    }, 400);
  });

  // Event Binding for Price Ranges
  container.querySelector('#apply-price-btn').addEventListener('click', () => {
    activeMinPrice = container.querySelector('#price-min-input').value.trim();
    activeMaxPrice = container.querySelector('#price-max-input').value.trim();
    activePageNum = 1;
    fetchCatalogue();
  });

  // Event Binding for Sorting
  container.querySelector('#shop-sort-select').addEventListener('change', (e) => {
    activeSort = e.target.value;
    activePageNum = 1;
    fetchCatalogue();
  });

  // Initial trigger fetch
  setTimeout(fetchCatalogue, 50);

  return container;
};

import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderProductManagement = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8 text-left';

  // Render initial skeleton loader
  container.innerHTML = getSpinner('large');

  // Trigger lazy loading
  setTimeout(async () => {
    try {
      const response = await api.products.getAll({ limit: 100 }); // List all products
      if (!response.success) {
        throw new Error(response.message);
      }

      const products = response.products;

      container.innerHTML = `
        
        <!-- Header Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
          <div>
            <span class="text-xs uppercase font-extrabold tracking-widest text-rose-500">Security Access Verified</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans mt-0.5">Product Management</h1>
          </div>
          
          <button 
            id="open-add-modal-btn"
            class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-550 text-white rounded-xl text-xs font-semibold shadow-lg uppercase tracking-wider flex items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Add New Product
          </button>
        </div>

        <!-- Products Grid Table -->
        <section class="glass-panel rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800/40">
          <div class="overflow-x-auto w-full">
            <table class="w-full text-xs font-medium text-slate-600 dark:text-slate-300">
              <thead>
                <tr class="bg-slate-100/50 dark:bg-slate-900/60 uppercase tracking-widest text-[9px] text-slate-400 border-b border-slate-150 dark:border-slate-800/40">
                  <th class="py-3.5 px-6 text-left">Product Details</th>
                  <th class="py-3.5 px-6 text-left">Category</th>
                  <th class="py-3.5 px-6 text-left">Price Details</th>
                  <th class="py-3.5 px-6 text-left">Stock Quantity</th>
                  <th class="py-3.5 px-6 text-left">Average Ratings</th>
                  <th class="py-3.5 px-6 text-center">Manage Actions</th>
                </tr>
              </thead>
              <tbody>
                ${products.length > 0 ? products.map(p => {
                  const img = p.images && p.images.length > 0 ? p.images[0] : '';
                  const hasDiscount = p.discountPrice && p.discountPrice > 0;
                  
                  return `
                    <tr class="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                      
                      <!-- Info -->
                      <td class="py-4 px-6 text-left flex items-center gap-3">
                        <div class="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                          <img src="${img}" class="w-full h-full object-cover" />
                        </div>
                        <div class="min-w-0">
                          <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title="${p.title}">${p.title}</h4>
                          <span class="text-[9px] text-slate-450 block truncate max-w-[180px] mt-0.5">${p.description}</span>
                        </div>
                      </td>

                      <!-- Category -->
                      <td class="py-4 px-6 text-left">
                        <span class="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-primary-500/10 text-primary-500 border border-primary-500/20">
                          ${p.category}
                        </span>
                      </td>

                      <!-- Prices -->
                      <td class="py-4 px-6 text-left font-bold font-sans">
                        ${hasDiscount ? `
                          <p class="text-slate-800 dark:text-white">$${p.discountPrice.toFixed(2)}</p>
                          <p class="text-[10px] text-slate-400 line-through font-semibold mt-0.5">$${p.price.toFixed(2)}</p>
                        ` : `
                          <p class="text-slate-800 dark:text-white">$${p.price.toFixed(2)}</p>
                        `}
                      </td>

                      <!-- Stock -->
                      <td class="py-4 px-6 text-left">
                        <span class="font-extrabold text-sm ${p.stock <= 0 ? 'text-rose-500' : p.stock <= 5 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}">
                          ${p.stock} units
                        </span>
                        <span class="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                          ${p.stock <= 0 ? 'Sold Out' : p.stock <= 5 ? 'Low Stock' : 'Stable'}
                        </span>
                      </td>

                      <!-- Ratings -->
                      <td class="py-4 px-6 text-left">
                        <div class="flex items-center gap-1">
                          <span class="font-bold text-slate-800 dark:text-white">${p.ratings || '0.0'}</span>
                          <svg class="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        </div>
                        <span class="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">(${p.reviews.length} reviews)</span>
                      </td>

                      <!-- Actions -->
                      <td class="py-4 px-6 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            class="edit-product-btn p-2 rounded-xl text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 transition-all"
                            data-product='${JSON.stringify(p).replace(/'/g, "&apos;")}'
                            title="Edit Product"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                          </button>
                          
                          <button 
                            class="delete-product-btn p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            data-id="${p._id}"
                            title="Delete Product"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                        </div>
                      </td>

                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="6" class="text-center py-10 text-slate-400">No products found in DB. Click Add New Product above!</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Product Add/Edit Dialog Modal -->
        <div id="product-crud-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[999] hidden animate-fade-in p-4">
          <div class="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col gap-5 border border-white/20 shadow-2xl relative animate-slide-up text-left max-h-[90vh] overflow-y-auto">
            
            <button id="close-modal-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans border-b border-slate-100 dark:border-slate-800/40 pb-2" id="modal-title-text">
              Add New Product Collection
            </h3>

            <!-- CRUD Form -->
            <form id="product-form" class="flex flex-col gap-4">
              <input type="hidden" id="form-product-id" />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5 col-span-full">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Title</label>
                  <input type="text" id="form-title" placeholder="iPhone 15 Pro Max" class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white" required />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</label>
                  <select id="form-category" class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white cursor-pointer uppercase" required>
                    <option value="Baby Products">Baby Products</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Household Essentials">Household Essentials</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Watches">Watches</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stock Qty</label>
                  <input type="number" id="form-stock" placeholder="25" class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white" min="0" required />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Regular Price ($)</label>
                  <input type="number" id="form-price" placeholder="1399" class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white" min="0" step="0.01" required />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Discount Price ($ - Optional)</label>
                  <input type="number" id="form-discount-price" placeholder="1299" class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white" min="0" step="0.01" />
                </div>

                <div class="flex flex-col gap-1.5 col-span-full">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Images (Upload files or write direct URL)</label>
                  <input type="file" id="form-image-files" multiple class="px-3.5 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none text-slate-800 dark:text-white" />
                  <input type="text" id="form-image-url" placeholder="https://images.unsplash.com/photo-..." class="px-3.5 py-2.5 text-[10px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white mt-1.5" />
                </div>

                <div class="flex flex-col gap-1.5 col-span-full">
                  <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</label>
                  <textarea id="form-description" placeholder="Specify item parameters..." class="w-full p-3.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white font-sans" rows="3" required></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                id="form-submit-btn"
                class="btn-primary w-full text-center mt-3 text-xs uppercase tracking-wider font-semibold py-3"
              >
                Save Product
              </button>
            </form>

          </div>
        </div>
      `;

      // MODAL BINDINGS
      const modal = container.querySelector('#product-crud-modal');
      const openAddBtn = container.querySelector('#open-add-modal-btn');
      const closeBtn = container.querySelector('#close-modal-btn');
      const formNode = container.querySelector('#product-form');

      const openModal = (titleStr = 'Add New Product Collection', data = null) => {
        container.querySelector('#modal-title-text').innerText = titleStr;
        formNode.reset();
        
        if (data) {
          container.querySelector('#form-product-id').value = data._id;
          container.querySelector('#form-title').value = data.title;
          container.querySelector('#form-category').value = data.category;
          container.querySelector('#form-price').value = data.price;
          container.querySelector('#form-discount-price').value = data.discountPrice || '';
          container.querySelector('#form-stock').value = data.stock;
          container.querySelector('#form-image-url').value = data.images && data.images.length > 0 ? data.images[0] : '';
          container.querySelector('#form-description').value = data.description;
        } else {
          container.querySelector('#form-product-id').value = '';
        }

        modal.classList.remove('hidden');
      };

      const closeModal = () => {
        modal.classList.add('hidden');
      };

      openAddBtn.addEventListener('click', () => openModal('Add New Product Collection'));
      closeBtn.addEventListener('click', closeModal);

      // Bind Edit Clicks
      container.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const productObj = JSON.parse(btn.getAttribute('data-product'));
          openModal('Edit Product Parameters', productObj);
        });
      });

      // Bind Delete Clicks
      container.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pId = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to permanently delete this product?')) {
            btn.innerHTML = getSpinner('small', 'primary');
            try {
              const res = await api.products.delete(pId);
              if (res.success) {
                store.showToast('Product successfully deleted!', 'success');
                store.navigateTo('productManagement');
              }
            } catch (err) {
              store.showToast(err.message, 'error');
            }
          }
        });
      });

      // Submit Form (supports Multipart/FormData images)
      formNode.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pId = container.querySelector('#form-product-id').value;
        const title = container.querySelector('#form-title').value.trim();
        const category = container.querySelector('#form-category').value;
        const price = container.querySelector('#form-price').value;
        const discountPrice = container.querySelector('#form-discount-price').value;
        const stock = container.querySelector('#form-stock').value;
        const directUrl = container.querySelector('#form-image-url').value.trim();
        const description = container.querySelector('#form-description').value.trim();
        const fileInput = container.querySelector('#form-image-files');

        const submitBtn = container.querySelector('#form-submit-btn');
        submitBtn.innerHTML = getSpinner('small', 'white');
        submitBtn.disabled = true;

        // Construct standard FormData to support Multer file uploads
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('price', price);
        if (discountPrice) formData.append('discountPrice', discountPrice);
        formData.append('stock', stock);
        formData.append('description', description);

        // Append images
        if (fileInput.files.length > 0) {
          for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('images', fileInput.files[i]);
          }
        } else if (directUrl) {
          // Fallback to text link URL
          formData.append('images', directUrl);
        }

        try {
          let result;
          if (pId) {
            // Update operation
            result = await api.products.update(pId, formData);
            if (result.success) {
              store.showToast('Product successfully updated!', 'success');
            }
          } else {
            // Create operation
            result = await api.products.create(formData);
            if (result.success) {
              store.showToast('New product successfully created!', 'success');
            }
          }

          closeModal();
          store.navigateTo('productManagement');

        } catch (err) {
          store.showToast(`Operation failed: ${err.message}`, 'error');
          submitBtn.innerText = 'Save Product';
          submitBtn.disabled = false;
        }
      });

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="text-center py-16 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
          <p class="text-sm font-semibold">Security Error: Failed to fetch inventory list: ${error.message}</p>
          <button onclick="window.location.hash = '#/adminDashboard'" class="btn-primary mt-4.5">Back to Dashboard</button>
        </div>
      `;
    }
  }, 100);

  return container;
};

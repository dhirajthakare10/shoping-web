import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderOrders = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8 text-left';

  const user = store.getState().user;
  if (!user) {
    container.innerHTML = `
      <div class="text-center py-16 glass-panel rounded-2xl">
        <p class="text-slate-400 font-medium">Please sign in to view your orders.</p>
        <button onclick="window.location.hash = '#/login'" class="btn-primary mt-4">Sign In</button>
      </div>
    `;
    return container;
  }

  // Load initial orders
  container.innerHTML = getSpinner('large');

  // Trigger lazy loading
  setTimeout(async () => {
    try {
      const response = await api.orders.getMyOrders();
      if (!response.success) {
        throw new Error(response.message);
      }

      const { count, orders } = response;

      if (count === 0) {
        container.innerHTML = `
          <div class="text-center py-20 glass-panel rounded-2xl flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-3xl shadow-inner">📦</div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">No Orders Placed Yet</h3>
            <p class="text-xs text-slate-400 max-w-xs leading-relaxed font-sans">You haven't ordered any luxury products from us yet. Shop catalog items and track their delivery pipeline here.</p>
            <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-2">Go to Catalogue</button>
          </div>
        `;
        return;
      }

      // Render Order Catalogue list
      container.innerHTML = `
        <div class="border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">My Order History</h1>
          <p class="text-xs text-slate-400 mt-1">Track dynamic delivery status and payment invoices.</p>
        </div>

        <div class="flex flex-col gap-8">
          ${orders.map(order => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const isCancelled = order.orderStatus === 'Cancelled';
            const status = order.orderStatus;
            
            // Determine active index for pipeline tracker
            // 0: Pending/Ordered, 1: Processing, 2: Shipped, 3: Delivered
            let activeIndex = 0;
            if (status === 'Processing') activeIndex = 1;
            else if (status === 'Shipped') activeIndex = 2;
            else if (status === 'Delivered') activeIndex = 3;

            // Pipeline tracking checkpoints
            const checkpoints = [
              { label: 'Ordered', icon: '📝' },
              { label: 'Processing', icon: '⚙️' },
              { label: 'Shipped', icon: '🚚' },
              { label: 'Delivered', icon: '🎁' }
            ];

            return `
              <div class="glass-panel rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 flex flex-col shadow-lg">
                
                <!-- Order Header Block -->
                <div class="bg-slate-100/60 dark:bg-slate-900/60 px-6 py-4.5 border-b border-slate-200/30 dark:border-slate-800/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span class="text-slate-400 uppercase text-[9px] font-bold tracking-wider">Date Placed</span>
                    <p class="text-slate-800 dark:text-white mt-1">${formattedDate}</p>
                  </div>
                  <div>
                    <span class="text-slate-400 uppercase text-[9px] font-bold tracking-wider">Order ID</span>
                    <p class="text-slate-800 dark:text-white mt-1 truncate max-w-[130px]" title="${order._id}">#${order._id}</p>
                  </div>
                  <div>
                    <span class="text-slate-400 uppercase text-[9px] font-bold tracking-wider">Grand Total</span>
                    <p class="text-primary-500 font-extrabold mt-1">$${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span class="text-slate-400 uppercase text-[9px] font-bold tracking-wider">Payment Status</span>
                    <p class="mt-1">
                      <span class="px-2 py-0.5 rounded text-[10px] tracking-wide font-bold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : order.paymentStatus === 'Failed'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }">
                        ${order.paymentStatus} (${order.paymentMethod})
                      </span>
                    </p>
                  </div>
                </div>

                <!-- Order Content (Line Items) -->
                <div class="p-6 border-b border-slate-150 dark:border-slate-800/40 flex flex-col gap-4">
                  ${order.products.map(item => `
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                        <img src="${item.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150'}" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${item.title}</h4>
                        <span class="text-[10px] text-slate-400 font-semibold">Quantity: ${item.quantity}x @ $${item.price.toFixed(2)} each</span>
                      </div>
                      <span class="text-xs font-bold text-slate-800 dark:text-white">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>

                <!-- Visual Delivery Progress Pipeline Tracker -->
                <div class="p-6 bg-slate-50/40 dark:bg-slate-950/20">
                  ${isCancelled ? `
                    <div class="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-semibold leading-relaxed">
                      <span class="text-2xl">⚠️</span>
                      <div>
                        <p class="font-bold">Order Cancelled</p>
                        <p class="text-[10px] opacity-75 mt-0.5">This transaction order was terminated. We have refunded/cancelled any active capture calls.</p>
                      </div>
                    </div>
                  ` : `
                    <div class="flex flex-col gap-2.5">
                      <span class="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest text-center sm:text-left mb-2">Delivery Pipeline Tracker</span>
                      
                      <!-- Visual Connector Line & Dots -->
                      <div class="relative flex items-center justify-between mt-3 w-full px-4">
                        
                        <!-- Connecting Line BG -->
                        <div class="absolute left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800/80 top-1/2 transform -translate-y-1/2 z-0 mx-8"></div>
                        
                        <!-- Connecting Line Active fill -->
                        <div class="absolute left-0 h-1 bg-gradient-to-r from-primary-500 to-emerald-500 top-1/2 transform -translate-y-1/2 z-0 mx-8 transition-all duration-500" style="width: ${
                          activeIndex === 0 ? '0%' : activeIndex === 1 ? '33.33%' : activeIndex === 2 ? '66.66%' : '100%'
                        }"></div>

                        <!-- Checkpoint Nodes -->
                        ${checkpoints.map((pt, idx) => {
                          const isVisited = idx <= activeIndex;
                          const isCurrent = idx === activeIndex;

                          return `
                            <div class="flex flex-col items-center gap-1.5 relative z-10">
                              
                              <!-- Dot -->
                              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md border-2 transition-all duration-300 ${
                                isCurrent 
                                  ? 'bg-primary-600 border-primary-500 text-white scale-110 ring-4 ring-primary-500/20'
                                  : isVisited
                                  ? 'bg-emerald-500 border-emerald-400 text-white'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                              }">
                                ${isVisited ? '✓' : pt.icon}
                              </div>

                              <!-- Label -->
                              <span class="text-[9px] uppercase font-extrabold tracking-wider ${
                                isCurrent 
                                  ? 'text-primary-500' 
                                  : isVisited
                                  ? 'text-emerald-500'
                                  : 'text-slate-400 dark:text-slate-600'
                              }">
                                ${pt.label}
                              </span>

                            </div>
                          `;
                        }).join('')}

                      </div>

                    </div>
                  `}
                </div>

              </div>
            `;
          }).join('')}
        </div>
      `;

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="text-center py-16 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
          <p class="text-sm font-semibold">Failed to fetch order history: ${error.message}</p>
          <button onclick="window.location.hash = '#/shop'" class="btn-primary mt-4.5">Back to Shop</button>
        </div>
      `;
    }
  }, 100);

  return container;
};

import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderAdminDashboard = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-10 text-left';

  // Render initial loader
  container.innerHTML = getSpinner('large');

  // Trigger lazy loading
  setTimeout(async () => {
    try {
      const response = await api.admin.getAnalytics();
      if (!response.success) {
        throw new Error(response.message || 'Failed to load dashboard metrics');
      }

      const { stats, recentOrders, salesByCategory, salesTrend } = response;

      // Card statistics metrics mapping
      const statCards = [
        { label: 'Total Revenue', val: `$${stats.totalSalesRevenue.toFixed(2)}`, desc: 'Paid sales overall', icon: '💰', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20' },
        { label: 'Active Roster', val: stats.totalUsers, desc: 'Registered user profiles', icon: '👥', color: 'from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20' },
        { label: 'Total Orders', val: stats.totalOrders, desc: 'Checked out orders', icon: '📦', color: 'from-amber-500/10 to-yellow-500/10 text-amber-500 border-amber-500/20' },
        { label: 'Active Catalogue', val: stats.totalProducts, desc: 'Products in inventory', icon: '💻', color: 'from-purple-500/10 to-violet-500/10 text-purple-500 border-purple-500/20' }
      ];

      container.innerHTML = `
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
          <div>
            <span class="text-xs uppercase font-extrabold tracking-widest text-rose-500">Security Access Verified</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans mt-0.5">Control Center</h1>
          </div>
          
          <!-- Submenu links for quick navigation -->
          <div class="flex gap-2">
            <button onclick="window.location.hash = '#/productManagement'" class="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
              Manage Products
            </button>
            <button onclick="window.location.hash = '#/userManagement'" class="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
              Manage Users
            </button>
          </div>
        </div>

        <!-- 4 Grid Stats Widget -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          ${statCards.map(c => `
            <div class="glass-panel p-5 sm:p-6 rounded-3xl border ${c.color} flex flex-col justify-between shadow-md">
              <div class="flex justify-between items-start">
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">${c.label}</span>
                <span class="text-xl sm:text-2xl">${c.icon}</span>
              </div>
              <div class="mt-4">
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">${c.val}</h3>
                <p class="text-[10px] text-slate-400 font-bold mt-1.5">${c.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Charts Trends and breakdown details -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Weekly Revenue Trend CSS graph widget -->
          <div class="glass-panel p-6 rounded-3xl lg:col-span-2 flex flex-col gap-4">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans border-b border-slate-100 dark:border-slate-800/40 pb-2">Sales Revenue Trend (Past 30 Days)</h3>
            
            <div class="flex flex-col gap-3 mt-2">
              ${salesTrend.length > 0 ? salesTrend.slice(-6).map(day => {
                const maxVal = Math.max(...salesTrend.map(t => t.totalSales)) || 1;
                const fillPercent = (day.totalSales / maxVal) * 100;
                
                return `
                  <div class="flex items-center gap-4 text-xs font-semibold">
                    <span class="w-20 text-slate-400 font-bold">${day.date}</span>
                    <div class="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                      <div class="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full" style="width: ${fillPercent}%"></div>
                    </div>
                    <span class="w-16 text-right font-extrabold text-slate-700 dark:text-slate-200">$${day.totalSales.toFixed(0)}</span>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-10">
                  <p class="text-xs text-slate-400">No sales record trend generated yet.</p>
                </div>
              `}
            </div>
          </div>

          <!-- Sales Category share distribution -->
          <div class="glass-panel p-6 rounded-3xl lg:col-span-1 flex flex-col gap-4">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans border-b border-slate-100 dark:border-slate-800/40 pb-2">Category Breakdown</h3>
            
            <div class="flex flex-col gap-4 mt-2">
              ${salesByCategory.length > 0 ? salesByCategory.map(cat => {
                const maxRevenue = Math.max(...salesByCategory.map(c => c.revenue)) || 1;
                const sharePercent = (cat.revenue / maxRevenue) * 100;
                
                return `
                  <div class="flex flex-col gap-1 text-xs font-semibold">
                    <div class="flex justify-between font-bold text-slate-600 dark:text-slate-300">
                      <span>${cat.category}</span>
                      <span>$${cat.revenue.toFixed(0)} (${cat.salesCount} sold)</span>
                    </div>
                    <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" style="width: ${sharePercent}%"></div>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-10">
                  <p class="text-xs text-slate-400">No categorical sales recorded.</p>
                </div>
              `}
            </div>
          </div>

        </div>

        <!-- Recent system orders management table -->
        <section class="glass-panel rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800/40">
          <div class="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans">Recent System Orders</h3>
            <span class="px-2.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">Active Tracker</span>
          </div>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-xs font-medium text-slate-600 dark:text-slate-300">
              <thead>
                <tr class="bg-slate-100/50 dark:bg-slate-900/60 uppercase tracking-widest text-[9px] text-slate-400 border-b border-slate-150 dark:border-slate-800/40">
                  <th class="py-3.5 px-6 text-left">Order ID</th>
                  <th class="py-3.5 px-6 text-left">Customer</th>
                  <th class="py-3.5 px-6 text-left">Amount</th>
                  <th class="py-3.5 px-6 text-left">Payment Status</th>
                  <th class="py-3.5 px-6 text-left">Order Status</th>
                  <th class="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${recentOrders.length > 0 ? recentOrders.map(order => {
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  
                  return `
                    <tr class="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                      <td class="py-4 px-6 text-left font-bold font-sans">
                        <span class="text-slate-800 dark:text-white truncate block max-w-[120px]" title="${order._id}">#${order._id}</span>
                        <span class="text-[9px] text-slate-400 font-bold mt-0.5 block">${formattedDate}</span>
                      </td>
                      <td class="py-4 px-6 text-left">
                        <p class="font-bold text-slate-700 dark:text-slate-200">${order.userId?.name || 'Deleted Account'}</p>
                        <p class="text-[10px] text-slate-400 mt-0.5">${order.userId?.email || 'deleted@shop.com'}</p>
                      </td>
                      <td class="py-4 px-6 text-left font-bold text-primary-500">$${order.totalAmount.toFixed(2)}</td>
                      <td class="py-4 px-6 text-left">
                        <span class="px-2 py-0.5 rounded text-[10px] tracking-wide font-bold ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }">
                          ${order.paymentStatus}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-left">
                        <select 
                          class="status-select px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[10px] font-bold tracking-wider cursor-pointer uppercase ${
                            order.orderStatus === 'Delivered' 
                              ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' 
                              : order.orderStatus === 'Cancelled'
                              ? 'text-rose-500 border-rose-500/20 bg-rose-500/5'
                              : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                          }"
                          data-id="${order._id}"
                        >
                          <option value="Pending" ${order.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                          <option value="Processing" ${order.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                          <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                          <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                          <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                      </td>
                      <td class="py-4 px-6 text-center">
                        <button 
                          onclick="store.navigateTo('orders', '${order._id}')"
                          class="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors"
                        >
                          Track View
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="6" class="text-center py-10 text-slate-400">No active system orders logged yet.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </section>
      `;

      // Bind status select updates
      container.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const orderId = select.getAttribute('data-id');
          const newStatus = e.target.value;

          // Auto mark payment as Paid if order is Delivered
          const paymentStatus = newStatus === 'Delivered' ? 'Paid' : undefined;

          try {
            const result = await api.orders.adminUpdateStatus(orderId, newStatus, paymentStatus);
            if (result.success) {
              store.showToast(`Order status updated to ${newStatus}!`, 'success');
              // Reload page details view
              store.navigateTo('adminDashboard');
            }
          } catch (err) {
            store.showToast(`Update failed: ${err.message}`, 'error');
          }
        });
      });

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="text-center py-16 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
          <p class="text-sm font-semibold">Security Error: Failed to fetch administration dashboard: ${error.message}</p>
          <button onclick="window.location.hash = '#/home'" class="btn-primary mt-4.5">Back to Home</button>
        </div>
      `;
    }
  }, 100);

  return container;
};

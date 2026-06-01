export const renderFooter = () => {
  return `
    <footer class="mt-auto w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12 pb-12 border-b border-slate-800">
          
          <!-- Column 1: Brand Info -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.hash = '#/home'">
              <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span class="text-white font-black text-lg tracking-tighter">C</span>
              </div>
              <span class="text-base font-bold tracking-tight text-white">CRAZY DEAL</span>
            </div>
            <p class="text-xs leading-relaxed text-slate-500">
              Crafting state-of-the-art consumer goods, premium garments, and classic accessories with micro-engineered visual interfaces. Engineered to deliver wow.
            </p>
          </div>

          <!-- Column 2: Quick Shop -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Collections</h4>
            <ul class="flex flex-col gap-2.5 text-xs">
              <li><button onclick="store.setState({ selectedCategory: 'Electronics' }); window.location.hash = '#/shop';" class="hover:text-primary-400 transition-colors">Premium Electronics</button></li>
              <li><button onclick="store.setState({ selectedCategory: 'Fashion' }); window.location.hash = '#/shop';" class="hover:text-primary-400 transition-colors">High-End Fashion</button></li>
              <li><button onclick="store.setState({ selectedCategory: 'Sneakers' }); window.location.hash = '#/shop';" class="hover:text-primary-400 transition-colors">Collector Sneakers</button></li>
              <li><button onclick="store.setState({ selectedCategory: 'Watches' }); window.location.hash = '#/shop';" class="hover:text-primary-400 transition-colors">Luxury Watches</button></li>
            </ul>
          </div>

          <!-- Column 3: Customer Care -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul class="flex flex-col gap-2.5 text-xs">
              <li><button onclick="window.location.hash = '#/orders'" class="hover:text-primary-400 transition-colors">Order Tracking</button></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Shipping & Deliveries</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Return Policy</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Support Center</a></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter -->
          <div class="flex flex-col gap-4">
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-2">Join the Club</h4>
            <p class="text-xs leading-normal text-slate-500">Subscribe for early alerts on collections drops, sales notices, and limited releases.</p>
            <div class="flex w-full gap-2">
              <input 
                type="email" 
                placeholder="Enter email address" 
                class="flex-1 px-3.5 py-2.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl outline-none focus:border-primary-500 text-white transition-colors"
              />
              <button 
                onclick="store.showToast('Subscribed to newsletter!', 'success')"
                class="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition-all duration-200"
              >
                Join
              </button>
            </div>
          </div>

        </div>

        <!-- Footnote copyright and policies -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-600">
          <p>&copy; 2026 Crazy Deal Store. Designed by Google DeepMind team. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-slate-400 transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  `;
};

export default renderFooter;

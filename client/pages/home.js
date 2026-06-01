import api from '../services/api.js';
import store from '../context/store.js';
import { renderProductCard } from '../components/productCard.js';
import { getSpinner } from '../components/spinner.js';

export const renderHome = async () => {
  const container = document.createElement('div');
  container.className = 'flex flex-col gap-0 w-full animate-fade-in';

  // ── 1. HERO SECTION ──────────────────────────────────────────────────────────
  const heroHtml = `
    <section class="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-[#100d24] to-slate-950 py-24 md:py-36 px-4 sm:px-6 lg:px-8 flex items-center min-h-[560px]">
      <!-- Animated background orbs -->
      <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary-600/8 blur-[130px] pointer-events-none animate-pulse"></div>
      <div class="absolute bottom-[-20%] left-[-8%] w-[500px] h-[500px] rounded-full bg-rose-500/8 blur-[110px] pointer-events-none"></div>
      <div class="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none"></div>

      <!-- Grid overlay pattern -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <div class="flex flex-col gap-6 text-left">
          <!-- Live deal indicator -->
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 max-w-fit backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            🔥 MEGA SALE — 50% OFF EVERYTHING
          </span>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Shop Smarter,<br>
            <span class="relative inline-block">
              <span class="bg-gradient-to-r from-rose-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">Save Bigger</span>
            </span>
          </h1>

          <p class="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
            Your one-stop destination for baby products, personal care, home essentials, jewellery, skincare, electronics, and trending fashion — all at crazy low prices.
          </p>

          <!-- Coupon callout -->
          <div class="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-fit">
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Launch Coupon</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="font-mono text-base font-extrabold text-rose-400 tracking-widest">CRAZY50</span>
                <span class="text-slate-500 text-xs">or</span>
                <span class="font-mono text-base font-extrabold text-amber-400 tracking-widest">50OFF</span>
              </div>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <span class="text-2xl font-black text-white">50%</span>
          </div>

          <div class="flex flex-wrap gap-3 mt-2">
            <button onclick="window.location.hash = '#/shop'" class="px-6 py-3 bg-gradient-to-r from-rose-500 via-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 font-semibold text-sm">
              🛍️ Shop Now
            </button>
            <button onclick="store.setState({ selectedCategory: 'All' }); window.location.hash = '#/shop';" class="px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/20 text-white backdrop-blur-md rounded-xl transition-all duration-200 text-sm font-medium">
              Browse All Products
            </button>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-wrap items-center gap-4 mt-1">
            <div class="flex items-center gap-1.5 text-slate-400 text-xs"><span class="text-emerald-400">✓</span> Free Shipping</div>
            <div class="flex items-center gap-1.5 text-slate-400 text-xs"><span class="text-emerald-400">✓</span> Easy Returns</div>
            <div class="flex items-center gap-1.5 text-slate-400 text-xs"><span class="text-emerald-400">✓</span> Secure Payments</div>
          </div>
        </div>

        <!-- Hero Product Cards Cluster -->
        <div class="relative flex justify-center md:justify-end" style="height: 420px;">
          <!-- Main card -->
          <div class="absolute right-4 top-0 w-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-4 flex flex-col justify-between group transform hover:-rotate-1 hover:scale-[1.03] transition-all duration-500 cursor-pointer" onclick="window.location.hash = '#/shop'">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"
              alt="Trending Watch"
              class="w-full h-48 object-cover rounded-2xl group-hover:scale-[1.04] transition-transform duration-500"
            />
            <div class="mt-3 flex flex-col gap-1.5">
              <span class="text-[10px] uppercase font-bold tracking-widest text-rose-400">⭐ Trending Drop</span>
              <div class="flex justify-between items-baseline">
                <h3 class="text-sm font-bold text-white tracking-wide">Premium Luxury Watch</h3>
                <span class="text-xs font-semibold text-slate-400 line-through">$320</span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-lg font-extrabold text-amber-400">$159.00</span>
                <span class="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-lg">50% OFF</span>
              </div>
            </div>
          </div>
          <!-- Floating accent cards -->
          <div class="absolute left-0 top-12 w-40 rounded-2xl bg-gradient-to-br from-rose-500/20 to-violet-600/20 border border-white/10 backdrop-blur-xl p-3 shadow-xl transform -rotate-3 group hover:-rotate-1 hover:scale-105 transition-all duration-300 cursor-pointer hidden sm:flex flex-col gap-2" onclick="window.location.hash = '#/shop'">
            <span class="text-2xl">🍼</span>
            <span class="text-xs font-bold text-white leading-tight">Baby Products</span>
            <span class="text-[10px] text-slate-400">2 items available</span>
          </div>
          <div class="absolute left-4 bottom-4 w-40 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-white/10 backdrop-blur-xl p-3 shadow-xl transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer hidden sm:flex flex-col gap-2" onclick="window.location.hash = '#/shop'">
            <span class="text-2xl">💍</span>
            <span class="text-xs font-bold text-white leading-tight">Jewellery</span>
            <span class="text-[10px] text-slate-400">2 items available</span>
          </div>
        </div>
      </div>
    </section>
  `;

  // ── 2. MARQUEE TICKER ────────────────────────────────────────────────────────
  const marqueeHtml = `
    <div class="w-full bg-gradient-to-r from-rose-500 via-violet-600 to-indigo-600 py-2.5 overflow-hidden relative">
      <div class="marquee-track flex items-center gap-12 whitespace-nowrap">
        ${Array(3).fill(`
          <span class="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">🔥 50% OFF with code CRAZY50</span>
          <span class="text-white/40">•</span>
          <span class="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">🚀 Free Shipping on All Orders</span>
          <span class="text-white/40">•</span>
          <span class="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">✨ New Arrivals Every Week</span>
          <span class="text-white/40">•</span>
          <span class="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">💎 Premium Quality Guaranteed</span>
          <span class="text-white/40">•</span>
          <span class="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">🎁 Use code 50OFF for Mega Savings</span>
          <span class="text-white/40">•</span>
        `).join('')}
      </div>
    </div>
  `;

  // ── 3. TRENDING CATEGORIES ────────────────────────────────────────────────────
  const categories = [
    { name: 'Baby Products',        icon: '🍼', gradient: 'from-sky-500 to-blue-600',     glow: 'shadow-sky-500/30',     desc: 'Safe & gentle' },
    { name: 'Personal Care',        icon: '🧴', gradient: 'from-pink-500 to-rose-600',    glow: 'shadow-pink-500/30',    desc: 'Look your best' },
    { name: 'Home Cleaning',        icon: '🧹', gradient: 'from-teal-500 to-emerald-600', glow: 'shadow-teal-500/30',    desc: 'Spotless home' },
    { name: 'Jewellery',            icon: '💍', gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30',   desc: 'Shine bright' },
    { name: 'Skincare',             icon: '🧼', gradient: 'from-emerald-400 to-green-600',glow: 'shadow-emerald-500/30', desc: 'Glow up daily' },
    { name: 'Haircare',             icon: '💇', gradient: 'from-violet-500 to-purple-700',glow: 'shadow-violet-500/30',  desc: 'Healthy locks' },
    { name: 'Household Essentials', icon: '🏠', gradient: 'from-slate-500 to-zinc-700',   glow: 'shadow-slate-400/20',   desc: 'Home comfort' },
    { name: 'Electronics',          icon: '💻', gradient: 'from-blue-500 to-indigo-700',  glow: 'shadow-blue-500/30',    desc: 'Tech & gadgets' },
    { name: 'Fashion',              icon: '👗', gradient: 'from-rose-500 to-pink-700',    glow: 'shadow-rose-500/30',    desc: 'Style forward' },
    { name: 'Sneakers',             icon: '👟', gradient: 'from-lime-500 to-green-600',   glow: 'shadow-lime-500/30',    desc: 'Step in style' },
    { name: 'Watches',              icon: '⌚', gradient: 'from-yellow-500 to-amber-600', glow: 'shadow-yellow-500/30',  desc: 'Timeless pieces' },
    { name: 'Accessories',          icon: '🕶️', gradient: 'from-purple-500 to-fuchsia-700',glow: 'shadow-purple-500/30', desc: 'Complete the look' },
  ];

  const categoryHtml = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div class="flex flex-col gap-2">
          <span class="text-xs uppercase tracking-widest font-bold text-primary-500">Categories</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">🔥 Trending Right Now</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Tap any category to explore products</p>
        </div>
        <button onclick="window.location.hash = '#/shop'" class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-wider flex-shrink-0">
          View All Products
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        ${categories.map((c, i) => `
          <button
            id="cat-btn-${i}"
            onclick="store.setState({ selectedCategory: '${c.name}' }); window.location.hash = '#/shop';"
            class="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 dark:border-slate-800/60 text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 bg-white dark:bg-slate-900/50 hover:border-transparent hover:shadow-xl ${c.glow} overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            style="animation-delay: ${i * 40}ms"
          >
            <!-- Gradient bg on hover -->
            <div class="absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <!-- Icon ring -->
            <div class="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span class="text-2xl">${c.icon}</span>
            </div>
            <span class="relative z-10 text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-white transition-colors duration-200 leading-tight">${c.name}</span>
            <span class="relative z-10 text-[10px] text-slate-400 group-hover:text-white/75 transition-colors duration-200 mt-0.5">${c.desc}</span>
            <!-- Arrow indicator on hover -->
            <div class="relative z-10 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <span class="text-[10px] text-white/80 font-semibold tracking-wider uppercase">Shop →</span>
            </div>
          </button>
        `).join('')}
      </div>
    </section>
  `;

  // ── 4. PROMOTIONAL STRIP ─────────────────────────────────────────────────────
  const promoHtml = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
      <div class="relative rounded-3xl overflow-hidden p-[1px] bg-gradient-to-r from-rose-500 via-violet-600 to-amber-500">
        <div class="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#120d26] to-slate-950 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <!-- Left glow -->
          <div class="absolute top-0 left-0 w-64 h-full bg-rose-600/10 blur-[60px] pointer-events-none"></div>

          <div class="flex flex-col gap-3 text-left relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 max-w-fit">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-rose-400">Limited Time Offer</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-white">Get 50% Off Your Entire Order! 🎉</h3>
            <p class="text-sm text-slate-400 max-w-xl">
              Apply coupon 
              <span class="font-mono font-black text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-lg mx-1">CRAZY50</span>
              or 
              <span class="font-mono font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg mx-1">50OFF</span>
              at checkout — instant 50% savings on everything!
            </p>
          </div>

          <div class="flex flex-col items-center gap-3 relative z-10 flex-shrink-0">
            <div class="text-center">
              <div class="text-5xl font-black text-white">50<span class="text-rose-400">%</span></div>
              <div class="text-xs text-slate-400 uppercase tracking-widest">Off Everything</div>
            </div>
            <button onclick="window.location.hash = '#/shop'" class="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transform transition-all duration-200 text-sm">
              Claim Your Discount
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  // ── 5. STATS STRIP ───────────────────────────────────────────────────────────
  const statsHtml = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${[
          { icon: '📦', value: '25+', label: 'Products', color: 'text-blue-500' },
          { icon: '😊', value: '500+', label: 'Happy Customers', color: 'text-emerald-500' },
          { icon: '🏷️', value: '50%', label: 'Max Discount', color: 'text-rose-500' },
          { icon: '⚡', value: '24/7', label: 'Support', color: 'text-amber-500' },
        ].map(s => `
          <div class="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 text-center hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/5">
            <span class="text-3xl mb-2 transform group-hover:scale-125 transition-transform duration-300">${s.icon}</span>
            <span class="text-2xl font-black ${s.color}">${s.value}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">${s.label}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Assemble HTML
  container.innerHTML = heroHtml + marqueeHtml + categoryHtml + promoHtml + statsHtml;

  // ── 6. FEATURED PRODUCTS ─────────────────────────────────────────────────────
  const productsSection = document.createElement('section');
  productsSection.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20';
  productsSection.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div class="flex flex-col gap-2">
        <span class="text-xs uppercase tracking-widest font-bold text-primary-500">Fresh In Store</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">✨ Latest Arrivals</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Freshly added premium products, handpicked for you.</p>
      </div>
      <button onclick="window.location.hash = '#/shop'" class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-wider flex-shrink-0">
        View Entire Shop
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg>
      </button>
    </div>
    <div id="featured-products-mount" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${getSpinner('medium')}
    </div>
  `;

  container.appendChild(productsSection);

  // Lazy fetch products
  setTimeout(async () => {
    const mountNode = container.querySelector('#featured-products-mount');
    try {
      const response = await api.products.getAll({ limit: 8 });
      if (response.success && response.products.length > 0) {
        mountNode.innerHTML = response.products.map(p => renderProductCard(p)).join('');
      } else {
        mountNode.innerHTML = `
          <div class="col-span-full text-center py-16 glass-panel rounded-2xl">
            <span class="text-5xl block mb-4">📦</span>
            <p class="text-slate-400 font-semibold">No products yet. Seed the database to get started.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error(error);
      mountNode.innerHTML = `
        <div class="col-span-full text-center py-12 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <p class="text-sm font-semibold">⚠️ Failed to load products: ${error.message}</p>
        </div>
      `;
    }
  }, 100);

  // ── MARQUEE ANIMATION ────────────────────────────────────────────────────────
  // Start marquee scroll after DOM insertion
  setTimeout(() => {
    const track = container.querySelector('.marquee-track');
    if (track) {
      let pos = 0;
      const speed = 0.5;
      const scroll = () => {
        pos -= speed;
        if (Math.abs(pos) >= track.scrollWidth / 3) pos = 0;
        track.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(scroll);
      };
      requestAnimationFrame(scroll);
    }
  }, 200);

  return container;
};

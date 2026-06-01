import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderLogin = () => {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto my-12 px-4 w-full animate-fade-in text-left';

  container.innerHTML = `
    <div class="glass-panel p-8 rounded-3xl flex flex-col gap-6 relative shadow-2xl overflow-hidden border border-white/20">
      
      <!-- Background Ambient Glow -->
      <div class="absolute top-[-20%] right-[-10%] w-56 h-56 rounded-full bg-primary-600/10 blur-[60px] pointer-events-none"></div>

      <div class="text-center flex flex-col gap-2">
        <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">Welcome Back</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500">Sign in to your Antigravity account to checkout items.</p>
      </div>

      <!-- Login Form -->
      <form id="login-form" class="flex flex-col gap-4">
        
        <div class="flex flex-col gap-1.5">
          <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            id="login-email" 
            placeholder="name@example.com" 
            class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between items-baseline">
            <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Password</label>
            <a href="#" onclick="store.showToast('Demo mode: Please use standard credentials.', 'info')" class="text-[10px] font-semibold text-primary-500 hover:underline">Forgot password?</a>
          </div>
          <input 
            type="password" 
            id="login-password" 
            placeholder="••••••••" 
            class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
            required
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          id="login-submit-btn"
          class="btn-primary w-full text-center mt-3 text-xs uppercase tracking-wider font-semibold py-3"
        >
          Sign In
        </button>

      </form>

      <!-- Footnote register redirect -->
      <div class="text-center pt-4 border-t border-slate-100 dark:border-slate-800/40 text-xs">
        <span class="text-slate-400">Don't have an account?</span>
        <button onclick="window.location.hash = '#/register'" class="font-bold text-primary-500 hover:underline ml-1">Create account</button>
      </div>

    </div>
  `;

  // Submit Listener
  const form = container.querySelector('#login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = container.querySelector('#login-email').value.trim();
    const password = container.querySelector('#login-password').value.trim();
    const submitBtn = container.querySelector('#login-submit-btn');

    submitBtn.innerHTML = getSpinner('small', 'white');
    submitBtn.disabled = true;

    try {
      const result = await api.auth.login(email, password);
      
      if (result.success) {
        // Save store session
        store.setState({
          user: result.user,
          token: result.token
        });

        store.showToast(`Welcome back, ${result.user.name}!`, 'success');

        // Sync Cart bag
        try {
          const cartRes = await api.cart.get();
          if (cartRes.success) store.setCart(cartRes.cart);
        } catch (cErr) {
          console.error('Failed to sync cart bag on login:', cErr);
        }

        // Navigate page
        if (result.user.role === 'admin') {
          store.navigateTo('adminDashboard');
        } else {
          store.navigateTo('home');
        }
      }
    } catch (error) {
      store.showToast(error.message || 'Invalid email or password', 'error');
      submitBtn.innerText = 'Sign In';
      submitBtn.disabled = false;
    }
  });

  return container;
};

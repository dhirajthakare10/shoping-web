import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderRegister = () => {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto my-12 px-4 w-full animate-fade-in text-left';

  container.innerHTML = `
    <div class="glass-panel p-8 rounded-3xl flex flex-col gap-6 relative shadow-2xl overflow-hidden border border-white/20">
      
      <!-- Background Ambient Glow -->
      <div class="absolute top-[-20%] right-[-10%] w-56 h-56 rounded-full bg-primary-600/10 blur-[60px] pointer-events-none"></div>

      <div class="text-center flex flex-col gap-2">
        <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">Create Account</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500">Sign up now and join our premium shopping store.</p>
      </div>

      <!-- Register Form -->
      <form id="register-form" class="flex flex-col gap-4">
        
        <div class="flex flex-col gap-1.5">
          <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
          <input 
            type="text" 
            id="register-name" 
            placeholder="John Doe" 
            class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            id="register-email" 
            placeholder="name@example.com" 
            class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Password (Min 6 Characters)</label>
          <input 
            type="password" 
            id="register-password" 
            placeholder="••••••••" 
            class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
            minlength="6"
            required
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          id="register-submit-btn"
          class="btn-primary w-full text-center mt-3 text-xs uppercase tracking-wider font-semibold py-3"
        >
          Sign Up
        </button>

      </form>

      <!-- Footnote sign in redirect -->
      <div class="text-center pt-4 border-t border-slate-100 dark:border-slate-800/40 text-xs">
        <span class="text-slate-400">Already have an account?</span>
        <button onclick="window.location.hash = '#/login'" class="font-bold text-primary-500 hover:underline ml-1">Sign In</button>
      </div>

    </div>
  `;

  // Submit Listener
  const form = container.querySelector('#register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = container.querySelector('#register-name').value.trim();
    const email = container.querySelector('#register-email').value.trim();
    const password = container.querySelector('#register-password').value.trim();
    const submitBtn = container.querySelector('#register-submit-btn');

    submitBtn.innerHTML = getSpinner('small', 'white');
    submitBtn.disabled = true;

    try {
      const result = await api.auth.register(name, email, password);
      
      if (result.success) {
        // Save store session
        store.setState({
          user: result.user,
          token: result.token
        });

        store.showToast(`Account successfully registered, ${result.user.name}!`, 'success');
        
        // Auto init empty cart
        store.setCart({ products: [], totalPrice: 0 });

        // Navigate page
        store.navigateTo('home');
      }
    } catch (error) {
      store.showToast(error.message || 'Registration failed. Email might be in use.', 'error');
      submitBtn.innerText = 'Sign Up';
      submitBtn.disabled = false;
    }
  });

  return container;
};

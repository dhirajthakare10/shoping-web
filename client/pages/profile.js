import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderProfile = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8 text-left';

  const user = store.getState().user;

  if (!user) {
    container.innerHTML = `
      <div class="text-center py-16 glass-panel rounded-2xl">
        <p class="text-slate-400 font-medium">Please sign in to view your profile.</p>
        <button onclick="window.location.hash = '#/login'" class="btn-primary mt-4">Sign In</button>
      </div>
    `;
    return container;
  }

  container.innerHTML = `
    <div class="border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">My Account Profile</h1>
      <p class="text-xs text-slate-400 mt-1">Manage personal contact parameters and delivery addresses.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      
      <!-- User Summary Widget -->
      <div class="md:col-span-1 glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 text-center">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/20">
          ${user.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white font-sans">${user.name}</h3>
          <span class="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-lg mt-1 inline-block ${
            user.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
          }">
            ${user.role} Account
          </span>
        </div>
        <p class="text-xs text-slate-400 truncate w-full">${user.email}</p>
        
        <div class="w-full h-px bg-slate-100 dark:bg-slate-800/40 my-2"></div>
        
        <button onclick="window.location.hash = '#/orders'" class="btn-secondary w-full py-2 text-xs flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Track My Orders
        </button>
      </div>

      <!-- Settings Form -->
      <form id="profile-settings-form" class="md:col-span-2 flex flex-col gap-6">
        
        <!-- Contact details -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans border-b border-slate-100 dark:border-slate-800/40 pb-2">Personal Parameters</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                id="profile-name" 
                placeholder="John Doe" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.name || ''}"
                required
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
              <input 
                type="text" 
                id="profile-phone" 
                placeholder="+919999999999" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.phone || ''}"
              />
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Email (Not Changeable)</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                class="px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
                value="${user.email || ''}"
                disabled
              />
            </div>
          </div>
        </div>

        <!-- Default Shipping parameters -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans border-b border-slate-100 dark:border-slate-800/40 pb-2">Default Address</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5 col-span-full">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Street Address</label>
              <input 
                type="text" 
                id="profile-street" 
                placeholder="123 Luxury Avenue, Penthouse" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.address?.street || ''}"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">City</label>
              <input 
                type="text" 
                id="profile-city" 
                placeholder="Bangalore" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.address?.city || ''}"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">State / Province</label>
              <input 
                type="text" 
                id="profile-state" 
                placeholder="Karnataka" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.address?.state || ''}"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">ZIP / Postal Code</label>
              <input 
                type="text" 
                id="profile-zip" 
                placeholder="560001" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.address?.zipCode || ''}"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">Country</label>
              <input 
                type="text" 
                id="profile-country" 
                placeholder="India" 
                class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                value="${user.address?.country || ''}"
              />
            </div>
          </div>
        </div>

        <!-- Optional: Change Password details -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans border-b border-slate-100 dark:border-slate-800/40 pb-2">Change Password</h3>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-slate-400 font-bold uppercase tracking-wider">New Password (Leave blank to keep same)</label>
            <input 
              type="password" 
              id="profile-password" 
              placeholder="••••••••" 
              class="px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none focus:border-primary-500 text-slate-800 dark:text-white"
              minlength="6"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          id="profile-submit-btn"
          class="btn-primary w-full text-center py-3 uppercase tracking-wider font-semibold text-xs mt-2"
        >
          Save Settings Profile
        </button>

      </form>

    </div>
  `;

  // Submit Listener
  const form = container.querySelector('#profile-settings-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = container.querySelector('#profile-name').value.trim();
    const phone = container.querySelector('#profile-phone').value.trim();
    const street = container.querySelector('#profile-street').value.trim();
    const city = container.querySelector('#profile-city').value.trim();
    const stateVal = container.querySelector('#profile-state').value.trim();
    const zipCode = container.querySelector('#profile-zip').value.trim();
    const country = container.querySelector('#profile-country').value.trim();
    const password = container.querySelector('#profile-password').value.trim();

    const submitBtn = container.querySelector('#profile-submit-btn');
    submitBtn.innerHTML = getSpinner('small', 'white');
    submitBtn.disabled = true;

    const payload = {
      name,
      phone,
      address: { street, city, state: stateVal, zipCode, country }
    };

    if (password) {
      payload.password = password;
    }

    try {
      const result = await api.auth.updateProfile(payload);
      if (result.success) {
        // Save new user state
        store.setState({ user: result.user });
        store.showToast('Profile settings saved successfully!', 'success');
        // Reload page details view
        store.navigateTo('profile');
      }
    } catch (error) {
      store.showToast(error.message, 'error');
    } finally {
      submitBtn.innerText = 'Save Settings Profile';
      submitBtn.disabled = false;
    }
  });

  return container;
};

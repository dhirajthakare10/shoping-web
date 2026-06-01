import api from '../services/api.js';
import store from '../context/store.js';
import { getSpinner } from '../components/spinner.js';

export const renderUserManagement = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in flex flex-col gap-8 text-left';

  // Render initial skeleton
  container.innerHTML = getSpinner('large');

  // Trigger lazy loading
  setTimeout(async () => {
    try {
      const response = await api.admin.getUsers();
      if (!response.success) {
        throw new Error(response.message);
      }

      const users = response.users;

      container.innerHTML = `
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
          <div>
            <span class="text-xs uppercase font-extrabold tracking-widest text-rose-500">Security Access Verified</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans mt-0.5">User Roster Controls</h1>
          </div>
          
          <button 
            onclick="window.location.hash = '#/adminDashboard'" 
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"/></svg>
            Dashboard Analytics
          </button>
        </div>

        <!-- Users list table -->
        <section class="glass-panel rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800/40">
          <div class="overflow-x-auto w-full">
            <table class="w-full text-xs font-medium text-slate-600 dark:text-slate-300">
              <thead>
                <tr class="bg-slate-100/50 dark:bg-slate-900/60 uppercase tracking-widest text-[9px] text-slate-400 border-b border-slate-150 dark:border-slate-800/40">
                  <th class="py-3.5 px-6 text-left">User Profile</th>
                  <th class="py-3.5 px-6 text-left">Role Access</th>
                  <th class="py-3.5 px-6 text-left">Phone Number</th>
                  <th class="py-3.5 px-6 text-left">City & Country</th>
                  <th class="py-3.5 px-6 text-left">Joined Date</th>
                  <th class="py-3.5 px-6 text-center">Roster Actions</th>
                </tr>
              </thead>
              <tbody>
                ${users.length > 0 ? users.map(u => {
                  const formattedDate = new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                  const city = u.address?.city || '-';
                  const country = u.address?.country || '-';

                  return `
                    <tr class="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                      
                      <!-- Info -->
                      <td class="py-4 px-6 text-left">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-slate-400 to-slate-500 flex items-center justify-center text-white text-[11px] font-bold uppercase">
                            ${u.name.substring(0, 2)}
                          </div>
                          <div class="min-w-0">
                            <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[150px]">${u.name}</h4>
                            <span class="text-[9px] text-slate-400 dark:text-slate-550 block mt-0.5 truncate max-w-[160px]">${u.email}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Role -->
                      <td class="py-4 px-6 text-left">
                        <span class="px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${
                          u.role === 'admin' 
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                            : 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                        }">
                          ${u.role}
                        </span>
                      </td>

                      <!-- Phone -->
                      <td class="py-4 px-6 text-left font-bold font-sans text-[11px]">
                        ${u.phone || '-'}
                      </td>

                      <!-- Address -->
                      <td class="py-4 px-6 text-left">
                        ${city !== '-' || country !== '-' ? `
                          <p class="font-bold text-slate-700 dark:text-slate-200">${city}</p>
                          <p class="text-[9px] text-slate-400 font-semibold mt-0.5">${country}</p>
                        ` : '-'}
                      </td>

                      <!-- Joined -->
                      <td class="py-4 px-6 text-left font-bold font-sans text-slate-400 dark:text-slate-500">
                        ${formattedDate}
                      </td>

                      <!-- Actions -->
                      <td class="py-4 px-6 text-center">
                        <div class="flex items-center justify-center gap-2">
                          
                          <!-- Change Role button -->
                          <button 
                            class="toggle-role-btn px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
                            data-id="${u._id}"
                            title="Toggle user role credentials"
                          >
                            Swap Role
                          </button>

                          <!-- Delete account -->
                          <button 
                            class="delete-user-btn p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            data-id="${u._id}"
                            title="Delete User"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>

                        </div>
                      </td>

                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="6" class="text-center py-10 text-slate-400">No registered users logged yet.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </section>
      `;

      // BIND EVENTS

      // 1. Toggle Roles Click
      container.querySelectorAll('.toggle-role-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const uId = btn.getAttribute('data-id');
          btn.innerHTML = getSpinner('small', 'primary');
          try {
            const res = await api.admin.toggleUserRole(uId);
            if (res.success) {
              store.showToast(res.message, 'success');
              store.navigateTo('userManagement');
            }
          } catch (err) {
            store.showToast(err.message, 'error');
            btn.innerText = 'Swap Role';
          }
        });
      });

      // 2. Delete User Click
      container.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const uId = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to permanently delete this user account?')) {
            btn.innerHTML = getSpinner('small', 'primary');
            try {
              const res = await api.admin.deleteUser(uId);
              if (res.success) {
                store.showToast('User account successfully deleted!', 'success');
                store.navigateTo('userManagement');
              }
            } catch (err) {
              store.showToast(err.message, 'error');
            }
          }
        });
      });

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="text-center py-16 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
          <p class="text-sm font-semibold">Security Error: Failed to fetch user directory: ${error.message}</p>
          <button onclick="window.location.hash = '#/adminDashboard'" class="btn-primary mt-4.5">Back to Dashboard</button>
        </div>
      `;
    }
  }, 100);

  return container;
};

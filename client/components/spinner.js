// Reusable Antigravity UI SVG Spinner Loading Indicator

export const getSpinner = (size = 'medium', color = 'primary') => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400',
    gold: 'text-amber-500 dark:text-yellow-400',
    white: 'text-white'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  const colorClass = colorClasses[color] || colorClasses.primary;

  return `
    <div class="flex justify-center items-center py-8">
      <svg class="animate-spin ${sizeClass} ${colorClass}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  `;
};

export default getSpinner;

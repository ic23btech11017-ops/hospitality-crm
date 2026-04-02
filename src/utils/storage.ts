const STORAGE_PREFIX = 'hospitality_crm_';

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export const STORAGE_KEYS = {
  USER: 'user',
  THEME: 'theme',
  ROOMS: 'rooms',
  BOOKINGS: 'bookings',
  GUESTS: 'guests',
  EVENTS: 'events',
  EVENT_HALLS: 'eventHalls',
  MENU_ITEMS: 'menuItems',
  MENU_PACKAGES: 'menuPackages',
  EVENT_FOOD_PLANS: 'eventFoodPlans',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  INTEGRATIONS: 'integrations',
  EXTERNAL_BOOKINGS: 'externalBookings',
  SYNC_LOGS: 'syncLogs',
} as const;

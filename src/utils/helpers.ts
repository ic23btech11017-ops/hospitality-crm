import { format, parseISO, differenceInDays, addDays, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy h:mm a');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const getDaysDifference = (startDate: string, endDate: string): number => {
  return differenceInDays(parseISO(endDate), parseISO(startDate));
};

export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return isWithinInterval(date, { start: startDate, end: endDate });
};

export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const getPercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatStatus = (status: string): string => {
  return status.split('_').map(capitalizeFirst).join(' ');
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    available: 'success',
    confirmed: 'success',
    checked_in: 'info',
    active: 'success',
    paid: 'success',
    synced: 'success',
    occupied: 'warning',
    partial: 'warning',
    pending: 'warning',
    inquiry: 'warning',
    in_progress: 'info',
    maintenance: 'error',
    cancelled: 'error',
    error: 'error',
    overdue: 'error',
    disconnected: 'error',
    cleaning: 'info',
    checked_out: 'default',
    completed: 'default',
    paused: 'default',
  };
  return statusMap[status.toLowerCase()] || 'default';
};

export const getRoomTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    single: 'Single Room',
    double: 'Double Room',
    suite: 'Suite',
    deluxe: 'Deluxe Room',
    presidential: 'Presidential Suite',
  };
  return labels[type] || type;
};

export const getEventTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    wedding: 'Wedding',
    conference: 'Conference',
    party: 'Party',
    meeting: 'Meeting',
    seminar: 'Seminar',
    other: 'Other',
  };
  return labels[type] || type;
};

export const getFoodCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',
    beverages: 'Beverages',
    desserts: 'Desserts',
  };
  return labels[category] || category;
};

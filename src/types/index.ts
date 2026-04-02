// User & Auth Types
export type UserRole = 'admin' | 'front_desk' | 'event_manager' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Room Types
export type RoomType = 'single' | 'double' | 'suite' | 'deluxe' | 'presidential';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  floor: number;
  amenities: string[];
  description?: string;
  images?: string[];
}

// Booking Types
export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'pending';

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  source: 'direct' | 'website' | 'airbnb' | 'booking_com' | 'expedia' | 'oyo';
  createdAt: string;
  updatedAt: string;
}

// Event Types
export type EventType = 'wedding' | 'conference' | 'party' | 'meeting' | 'seminar' | 'other';
export type EventStatus = 'inquiry' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface EventHall {
  id: string;
  name: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  description?: string;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  hallId: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: EventStatus;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  allocatedRoomIds: string[];
  foodPlanId?: string;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Food Types
export type FoodCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages' | 'desserts';
export type FoodType = 'veg' | 'non_veg' | 'vegan';
export type MealTime = 'breakfast' | 'lunch' | 'dinner';

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  type: FoodType;
  price: number;
  description?: string;
  isAvailable: boolean;
  image?: string;
}

export interface MenuPackage {
  id: string;
  name: string;
  description: string;
  menuItemIds: string[];
  pricePerPerson: number;
  minGuests: number;
  maxGuests: number;
}

export interface EventFoodPlan {
  id: string;
  eventId: string;
  menuPackageId?: string;
  customMenuItemIds: string[];
  guestCount: number;
  mealTimes: MealTime[];
  specialRequirements?: string;
  totalAmount: number;
}

// Guest Types
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  idType?: 'passport' | 'national_id' | 'driver_license';
  idNumber?: string;
  preferences: GuestPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface GuestPreferences {
  roomType?: RoomType;
  foodType?: FoodType;
  specialRequests?: string;
  allergies?: string[];
}

// Billing Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  guestId: string;
  bookingId?: string;
  eventId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  createdAt: string;
}

// Integration Types
export type IntegrationPlatform = 'airbnb' | 'booking_com' | 'expedia' | 'google_calendar' | 'website' | 'oyo';
export type SyncStatus = 'active' | 'paused' | 'error' | 'disconnected';

export interface Integration {
  id: string;
  platform: IntegrationPlatform;
  status: SyncStatus;
  apiKey?: string;
  lastSyncAt?: string;
  errorMessage?: string;
  settings: Record<string, unknown>;
}

export interface ExternalBooking {
  id: string;
  externalId: string;
  source: IntegrationPlatform;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  roomId?: string;
  checkIn: string;
  checkOut: string;
  syncStatus: 'pending' | 'synced' | 'error';
  rawData: Record<string, unknown>;
  createdAt: string;
  syncedAt?: string;
}

export interface SyncLog {
  id: string;
  type: 'booking' | 'event' | 'availability';
  platform: IntegrationPlatform;
  status: 'success' | 'failure';
  message: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  upcomingEvents: number;
  monthlyRevenue: number;
  pendingPayments: number;
}

export interface RevenueData {
  date: string;
  rooms: number;
  events: number;
  food: number;
  total: number;
}

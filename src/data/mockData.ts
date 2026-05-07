
import type {
  Room,
  Booking,
  Event,
  EventHall,
  Guest,
  MenuItem,
  MenuPackage,
  EventFoodPlan,
  Invoice,
  Payment,
  Integration,
  ExternalBooking,
  SyncLog,
} from '../types';
import { properties } from './propertiesData';

// Helper to generate dates
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Base Rooms
const baseRooms: Omit<Room, 'id' | 'propertyId'>[] = [
  { roomNumber: '101', type: 'single', capacity: 1, pricePerNight: 3500, status: 'available', floor: 1, amenities: ['WiFi', 'TV', 'AC'] },
  { roomNumber: '102', type: 'single', capacity: 1, pricePerNight: 3500, status: 'occupied', floor: 1, amenities: ['WiFi', 'TV', 'AC'] },
  { roomNumber: '103', type: 'double', capacity: 2, pricePerNight: 5500, status: 'available', floor: 1, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { roomNumber: '104', type: 'double', capacity: 2, pricePerNight: 5500, status: 'cleaning', floor: 1, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { roomNumber: '201', type: 'double', capacity: 2, pricePerNight: 5500, status: 'available', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { roomNumber: '202', type: 'suite', capacity: 4, pricePerNight: 9500, status: 'occupied', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'] },
  { roomNumber: '203', type: 'suite', capacity: 4, pricePerNight: 9500, status: 'available', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'] },
  { roomNumber: '204', type: 'deluxe', capacity: 3, pricePerNight: 7500, status: 'maintenance', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
  { roomNumber: '301', type: 'deluxe', capacity: 3, pricePerNight: 7500, status: 'available', floor: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
  { roomNumber: '302', type: 'presidential', capacity: 6, pricePerNight: 25000, status: 'available', floor: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchen', 'Living Room'] },
];

export const rooms: Room[] = properties.flatMap(p => 
  baseRooms.map((room, index) => ({
    ...room,
    id: `${p.id}-r${index + 1}`,
    propertyId: p.id
  }))
);


// Base Guests
const baseGuests: Omit<Guest, 'id'>[] = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@email.com', phone: '+91 98765 43210', preferences: { roomType: 'double', foodType: 'veg' }, createdAt: formatDate(addDays(today, -30)), updatedAt: formatDate(today) },
  { name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 87654 32109', preferences: { roomType: 'suite', foodType: 'non_veg' }, createdAt: formatDate(addDays(today, -25)), updatedAt: formatDate(today) },
  { name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '+91 76543 21098', preferences: { roomType: 'single' }, createdAt: formatDate(addDays(today, -20)), updatedAt: formatDate(today) },
  { name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 65432 10987', preferences: { foodType: 'vegan', allergies: ['nuts', 'dairy'] }, createdAt: formatDate(addDays(today, -15)), updatedAt: formatDate(today) },
  { name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 54321 09876', preferences: { roomType: 'deluxe', specialRequests: 'Early check-in preferred' }, createdAt: formatDate(addDays(today, -10)), updatedAt: formatDate(today) },
  { name: 'Ananya Iyer', email: 'ananya.iyer@email.com', phone: '+91 43210 98765', preferences: { roomType: 'double', foodType: 'veg' }, createdAt: formatDate(addDays(today, -5)), updatedAt: formatDate(today) },
];

export const guests: Guest[] = properties.flatMap(p => 
  baseGuests.map((guest, index) => ({
    ...guest,
    id: `${p.id}-g${index + 1}`
  }))
);

// Base Bookings
const baseBookings: Omit<Booking, 'id' | 'propertyId' | 'guestId' | 'roomId'>[] = [
  { checkIn: formatDate(today), checkOut: formatDate(addDays(today, 3)), status: 'checked_in', totalAmount: 16500, paidAmount: 16500, source: 'direct', createdAt: formatDate(addDays(today, -5)), updatedAt: formatDate(today) },
  { checkIn: formatDate(addDays(today, -1)), checkOut: formatDate(addDays(today, 2)), status: 'checked_in', totalAmount: 28500, paidAmount: 15000, source: 'booking_com', createdAt: formatDate(addDays(today, -10)), updatedAt: formatDate(today) },
  { checkIn: formatDate(addDays(today, 1)), checkOut: formatDate(addDays(today, 4)), status: 'confirmed', totalAmount: 10500, paidAmount: 5000, source: 'website', createdAt: formatDate(addDays(today, -3)), updatedAt: formatDate(today) },
  { checkIn: formatDate(addDays(today, 2)), checkOut: formatDate(addDays(today, 5)), status: 'confirmed', totalAmount: 16500, paidAmount: 0, source: 'airbnb', createdAt: formatDate(addDays(today, -2)), updatedAt: formatDate(today) },
  { checkIn: formatDate(addDays(today, 5)), checkOut: formatDate(addDays(today, 8)), status: 'confirmed', totalAmount: 22500, paidAmount: 22500, source: 'oyo', createdAt: formatDate(addDays(today, -1)), updatedAt: formatDate(today) },
  { checkIn: formatDate(addDays(today, -5)), checkOut: formatDate(addDays(today, -2)), status: 'checked_out', totalAmount: 16500, paidAmount: 16500, source: 'expedia', createdAt: formatDate(addDays(today, -15)), updatedAt: formatDate(addDays(today, -2)) },
  { checkIn: formatDate(addDays(today, 10)), checkOut: formatDate(addDays(today, 12)), status: 'confirmed', totalAmount: 19000, paidAmount: 10000, source: 'website', createdAt: formatDate(addDays(today, -1)), updatedAt: formatDate(today) },
  { checkIn: formatDate(addDays(today, 15)), checkOut: formatDate(addDays(today, 18)), status: 'confirmed', totalAmount: 75000, paidAmount: 25000, source: 'direct', createdAt: formatDate(today), updatedAt: formatDate(today) },
];

export const bookings: Booking[] = properties.flatMap(p => 
  baseBookings.map((booking, index) => {
    // Distribute across guests 1-6 and rooms 1-10
    const guestIdx = (index % 6) + 1;
    const roomIdx = (index % 10) + 1;
    return {
      ...booking,
      id: `${p.id}-b${index + 1}`,
      propertyId: p.id,
      guestId: `${p.id}-g${guestIdx}`,
      roomId: `${p.id}-r${roomIdx}`
    };
  })
);

// Base Event Halls
const baseEventHalls: Omit<EventHall, 'id'>[] = [
  { name: 'Grand Ballroom', capacity: 500, pricePerDay: 150000, amenities: ['Stage', 'Sound System', 'Projector', 'AC', 'Dance Floor'], description: 'Our largest venue perfect for grand celebrations' },
  { name: 'Crystal Hall', capacity: 200, pricePerDay: 75000, amenities: ['Stage', 'Sound System', 'Projector', 'AC'], description: 'Elegant hall with crystal chandeliers' },
  { name: 'Garden Pavilion', capacity: 150, pricePerDay: 50000, amenities: ['Open Air', 'Garden View', 'Tent Coverage'], description: 'Beautiful outdoor venue surrounded by gardens' },
  { name: 'Conference Room A', capacity: 50, pricePerDay: 25000, amenities: ['Projector', 'Video Conferencing', 'AC', 'Whiteboard'], description: 'Professional setting for business meetings' },
  { name: 'Conference Room B', capacity: 30, pricePerDay: 15000, amenities: ['Projector', 'AC', 'Whiteboard'], description: 'Compact meeting room for small groups' },
];

export const eventHalls: EventHall[] = properties.flatMap(p => 
  baseEventHalls.map((hall, index) => ({
    ...hall,
    id: `${p.id}-h${index + 1}`
  }))
);

// Base Events
const baseEvents: Omit<Event, 'id' | 'hallId' | 'allocatedRoomIds' | 'foodPlanId'>[] = [
  { name: 'Sharma-Verma Wedding', type: 'wedding', date: formatDate(addDays(today, 7)), startTime: '10:00', endTime: '23:00', guestCount: 350, status: 'confirmed', contactName: 'Rajesh Sharma', contactPhone: '+91 98765 11111', contactEmail: 'rajesh@email.com', totalAmount: 850000, paidAmount: 500000, createdAt: formatDate(addDays(today, -30)), updatedAt: formatDate(today) },
  { name: 'Tech Conference 2024', type: 'conference', date: formatDate(addDays(today, 14)), startTime: '09:00', endTime: '18:00', guestCount: 150, status: 'confirmed', contactName: 'Arun Tech', contactPhone: '+91 87654 22222', contactEmail: 'arun@techconf.com', totalAmount: 200000, paidAmount: 200000, createdAt: formatDate(addDays(today, -20)), updatedAt: formatDate(today) },
  { name: 'Birthday Celebration - 50th', type: 'party', date: formatDate(addDays(today, 3)), startTime: '18:00', endTime: '23:00', guestCount: 80, status: 'confirmed', contactName: 'Meera Gupta', contactPhone: '+91 76543 33333', contactEmail: 'meera@email.com', totalAmount: 120000, paidAmount: 60000, createdAt: formatDate(addDays(today, -15)), updatedAt: formatDate(today) },
  { name: 'Board Meeting Q1', type: 'meeting', date: formatDate(addDays(today, 1)), startTime: '10:00', endTime: '16:00', guestCount: 25, status: 'confirmed', contactName: 'Corporate Sec', contactPhone: '+91 65432 44444', contactEmail: 'corp@business.com', totalAmount: 35000, paidAmount: 35000, createdAt: formatDate(addDays(today, -7)), updatedAt: formatDate(today) },
  { name: 'Product Launch Event', type: 'seminar', date: formatDate(addDays(today, 21)), startTime: '14:00', endTime: '20:00', guestCount: 180, status: 'inquiry', contactName: 'Marketing Lead', contactPhone: '+91 54321 55555', contactEmail: 'marketing@startup.com', totalAmount: 0, paidAmount: 0, createdAt: formatDate(addDays(today, -2)), updatedAt: formatDate(today) },
];

export const events: Event[] = properties.flatMap(p => 
  baseEvents.map((e, index) => {
    const hallIdx = (index % 5) + 1;
    return {
      ...e,
      id: `${p.id}-e${index + 1}`,
      hallId: `${p.id}-h${hallIdx}`,
      allocatedRoomIds: index === 0 ? [`${p.id}-r3`, `${p.id}-r5`, `${p.id}-r7`] : [],
      foodPlanId: index < 2 ? `${p.id}-fp${index + 1}` : undefined
    };
  })
);

// Menu Items
export const menuItems: MenuItem[] = [
  // Breakfast
  { id: 'm1', name: 'Continental Breakfast', category: 'breakfast', type: 'veg', price: 450, isAvailable: true, description: 'Eggs, toast, juice, and coffee' },
  { id: 'm2', name: 'Indian Breakfast', category: 'breakfast', type: 'veg', price: 350, isAvailable: true, description: 'Poha, paratha, chai' },
  { id: 'm3', name: 'Healthy Start', category: 'breakfast', type: 'vegan', price: 400, isAvailable: true, description: 'Oats, fruits, smoothie' },
  // Lunch
  { id: 'm4', name: 'North Indian Thali', category: 'lunch', type: 'veg', price: 550, isAvailable: true, description: 'Dal, paneer, roti, rice, salad' },
  { id: 'm5', name: 'Chicken Biryani', category: 'lunch', type: 'non_veg', price: 650, isAvailable: true, description: 'Hyderabadi style biryani with raita' },
  { id: 'm6', name: 'South Indian Meals', category: 'lunch', type: 'veg', price: 450, isAvailable: true, description: 'Rice, sambar, rasam, vegetables' },
  // Dinner
  { id: 'm7', name: 'Chef Special Dinner', category: 'dinner', type: 'non_veg', price: 850, isAvailable: true, description: 'Grilled chicken, vegetables, soup' },
  { id: 'm8', name: 'Paneer Tikka Meal', category: 'dinner', type: 'veg', price: 650, isAvailable: true, description: 'Paneer tikka, dal makhani, naan' },
  { id: 'm9', name: 'Seafood Platter', category: 'dinner', type: 'non_veg', price: 1200, isAvailable: false, description: 'Assorted seafood preparations' },
  // Snacks
  { id: 'm10', name: 'Samosa (2 pcs)', category: 'snacks', type: 'veg', price: 120, isAvailable: true },
  { id: 'm11', name: 'Chicken Pakora', category: 'snacks', type: 'non_veg', price: 180, isAvailable: true },
  // Beverages
  { id: 'm12', name: 'Fresh Juice', category: 'beverages', type: 'vegan', price: 150, isAvailable: true },
  { id: 'm13', name: 'Masala Chai', category: 'beverages', type: 'veg', price: 80, isAvailable: true },
  { id: 'm14', name: 'Coffee', category: 'beverages', type: 'veg', price: 120, isAvailable: true },
  // Desserts
  { id: 'm15', name: 'Gulab Jamun', category: 'desserts', type: 'veg', price: 150, isAvailable: true },
  { id: 'm16', name: 'Ice Cream', category: 'desserts', type: 'veg', price: 180, isAvailable: true },
];

// Menu Packages
export const menuPackages: MenuPackage[] = [
  { id: 'mp1', name: 'Basic Package', description: 'Simple vegetarian menu for small gatherings', menuItemIds: ['m2', 'm4', 'm8', 'm13', 'm15'], pricePerPerson: 800, minGuests: 20, maxGuests: 100 },
  { id: 'mp2', name: 'Premium Package', description: 'Mixed menu with both veg and non-veg options', menuItemIds: ['m1', 'm5', 'm7', 'm10', 'm11', 'm12', 'm14', 'm16'], pricePerPerson: 1500, minGuests: 50, maxGuests: 300 },
  { id: 'mp3', name: 'Grand Wedding Package', description: 'Elaborate spread for wedding celebrations', menuItemIds: ['m1', 'm2', 'm4', 'm5', 'm6', 'm7', 'm8', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16'], pricePerPerson: 2500, minGuests: 100, maxGuests: 500 },
  { id: 'mp4', name: 'Corporate Package', description: 'Professional catering for business events', menuItemIds: ['m1', 'm4', 'm8', 'm10', 'm12', 'm14'], pricePerPerson: 1000, minGuests: 20, maxGuests: 200 },
];

// Base Event Food Plans
const baseEventFoodPlans: Omit<EventFoodPlan, 'id' | 'eventId'>[] = [
  { menuPackageId: 'mp3', customMenuItemIds: [], guestCount: 350, mealTimes: ['lunch', 'dinner'], totalAmount: 875000 },
  { menuPackageId: 'mp4', customMenuItemIds: [], guestCount: 150, mealTimes: ['lunch'], totalAmount: 150000 },
];

export const eventFoodPlans: EventFoodPlan[] = properties.flatMap(p => 
  baseEventFoodPlans.map((fp, index) => ({
    ...fp,
    id: `${p.id}-fp${index + 1}`,
    eventId: `${p.id}-e${index + 1}`
  }))
);

// Base Invoices
const baseInvoices: Omit<Invoice, 'id' | 'guestId' | 'bookingId' | 'eventId'>[] = [
  { invoiceNumber: 'INV-2024-001', items: [{ id: 'i1', description: 'Room Charges (3 nights)', quantity: 3, unitPrice: 5500, totalPrice: 16500 }], subtotal: 16500, tax: 2970, discount: 0, totalAmount: 19470, paidAmount: 19470, status: 'paid', dueDate: formatDate(today), createdAt: formatDate(addDays(today, -5)), updatedAt: formatDate(today) },
  { invoiceNumber: 'INV-2024-002', items: [{ id: 'i2', description: 'Suite Room (3 nights)', quantity: 3, unitPrice: 9500, totalPrice: 28500 }], subtotal: 28500, tax: 5130, discount: 1500, totalAmount: 32130, paidAmount: 15000, status: 'partial', dueDate: formatDate(addDays(today, 2)), createdAt: formatDate(addDays(today, -10)), updatedAt: formatDate(today) },
  { invoiceNumber: 'INV-2024-003', items: [{ id: 'i3', description: 'Grand Ballroom Rental', quantity: 1, unitPrice: 150000, totalPrice: 150000 }, { id: 'i4', description: 'Catering (350 guests)', quantity: 350, unitPrice: 2500, totalPrice: 875000 }], subtotal: 1025000, tax: 184500, discount: 50000, totalAmount: 1159500, paidAmount: 500000, status: 'partial', dueDate: formatDate(addDays(today, 7)), createdAt: formatDate(addDays(today, -30)), updatedAt: formatDate(today) },
];

export const invoices: Invoice[] = properties.flatMap(p => 
  baseInvoices.map((inv, index) => ({
    ...inv,
    id: `${p.id}-inv${index + 1}`,
    invoiceNumber: `${p.code}-${inv.invoiceNumber}`,
    guestId: `${p.id}-g${(index % 2) + 1}`,
    bookingId: index < 2 ? `${p.id}-b${index + 1}` : undefined,
    eventId: index === 2 ? `${p.id}-e1` : undefined
  }))
);

// Base Payments
const basePayments: Omit<Payment, 'id' | 'invoiceId'>[] = [
  { amount: 19470, method: 'card', reference: 'TXN123456', createdAt: formatDate(addDays(today, -3)) },
  { amount: 15000, method: 'bank_transfer', reference: 'NEFT987654', createdAt: formatDate(addDays(today, -8)) },
  { amount: 300000, method: 'bank_transfer', reference: 'NEFT111222', createdAt: formatDate(addDays(today, -28)) },
  { amount: 200000, method: 'cash', createdAt: formatDate(addDays(today, -14)) },
];

export const payments: Payment[] = properties.flatMap(p => 
  basePayments.map((pay, index) => ({
    ...pay,
    id: `${p.id}-p${index + 1}`,
    invoiceId: index < 2 ? `${p.id}-inv${index + 1}` : `${p.id}-inv3`
  }))
);

// Integrations
export const integrations: Integration[] = [
  { id: 'int1', platform: 'booking_com', status: 'active', lastSyncAt: new Date().toISOString(), settings: { propertyId: 'PROP123' } },
  { id: 'int2', platform: 'airbnb', status: 'active', lastSyncAt: new Date().toISOString(), settings: { listingId: 'LIST456' } },
  { id: 'int3', platform: 'expedia', status: 'paused', lastSyncAt: formatDate(addDays(today, -2)), settings: {} },
  { id: 'int4', platform: 'google_calendar', status: 'active', lastSyncAt: new Date().toISOString(), settings: { calendarId: 'primary' } },
  { id: 'int5', platform: 'website', status: 'active', lastSyncAt: new Date().toISOString(), settings: { webhookUrl: 'https://hotel.com/api/bookings' } },
];

// Base External Bookings
const baseExternalBookings: Omit<ExternalBooking, 'id' | 'roomId'>[] = [
  { externalId: 'BK-12345', source: 'booking_com', guestName: 'John Smith', guestEmail: 'john@gmail.com', checkIn: formatDate(addDays(today, 10)), checkOut: formatDate(addDays(today, 13)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -1)), syncedAt: formatDate(today) },
  { externalId: 'AIR-67890', source: 'airbnb', guestName: 'Sarah Johnson', guestEmail: 'sarah@email.com', checkIn: formatDate(addDays(today, 15)), checkOut: formatDate(addDays(today, 18)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -2)), syncedAt: formatDate(addDays(today, -1)) },
  { externalId: 'WEB-11111', source: 'website', guestName: 'Pending Guest', guestEmail: 'pending@email.com', checkIn: formatDate(addDays(today, 20)), checkOut: formatDate(addDays(today, 22)), syncStatus: 'pending', rawData: {}, createdAt: formatDate(today) },
  { externalId: 'OYO-22222', source: 'oyo', guestName: 'Ravi Kumar', guestEmail: 'ravi@gmail.com', checkIn: formatDate(addDays(today, 8)), checkOut: formatDate(addDays(today, 10)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -1)), syncedAt: formatDate(today) },
  { externalId: 'EXP-33333', source: 'expedia', guestName: 'Maria Garcia', guestEmail: 'maria@email.com', checkIn: formatDate(addDays(today, 12)), checkOut: formatDate(addDays(today, 14)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -3)), syncedAt: formatDate(addDays(today, -2)) },
  { externalId: 'WEB-44444', source: 'website', guestName: 'Deepak Joshi', guestEmail: 'deepak@email.com', checkIn: formatDate(addDays(today, 25)), checkOut: formatDate(addDays(today, 28)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -4)), syncedAt: formatDate(addDays(today, -3)) },
];

export const externalBookings: ExternalBooking[] = properties.flatMap(p => 
  baseExternalBookings.map((eb, index) => ({
    ...eb,
    id: `${p.id}-eb${index + 1}`,
    roomId: `${p.id}-r${(index % 9) + 1}`,
  }))
);

// Sync Logs
export const syncLogs: SyncLog[] = [
  { id: 'sl1', type: 'booking', platform: 'booking_com', status: 'success', message: 'Imported booking BK-12345', createdAt: new Date().toISOString() },
  { id: 'sl2', type: 'booking', platform: 'airbnb', status: 'success', message: 'Imported booking AIR-67890', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'sl3', type: 'availability', platform: 'booking_com', status: 'success', message: 'Updated availability for 10 rooms', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'sl4', type: 'booking', platform: 'expedia', status: 'failure', message: 'API rate limit exceeded', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

// Export all data as a bundle
export const initialData = {
  rooms,
  guests,
  bookings,
  eventHalls,
  events,
  menuItems,
  menuPackages,
  eventFoodPlans,
  invoices,
  payments,
  integrations,
  externalBookings,
  syncLogs,
};

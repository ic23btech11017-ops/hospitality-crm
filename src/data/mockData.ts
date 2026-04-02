
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

// Helper to generate dates
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Rooms
export const rooms: Room[] = [
  { id: 'r1', roomNumber: '101', type: 'single', capacity: 1, pricePerNight: 3500, status: 'available', floor: 1, amenities: ['WiFi', 'TV', 'AC'] },
  { id: 'r2', roomNumber: '102', type: 'single', capacity: 1, pricePerNight: 3500, status: 'occupied', floor: 1, amenities: ['WiFi', 'TV', 'AC'] },
  { id: 'r3', roomNumber: '103', type: 'double', capacity: 2, pricePerNight: 5500, status: 'available', floor: 1, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { id: 'r4', roomNumber: '104', type: 'double', capacity: 2, pricePerNight: 5500, status: 'cleaning', floor: 1, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { id: 'r5', roomNumber: '201', type: 'double', capacity: 2, pricePerNight: 5500, status: 'available', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { id: 'r6', roomNumber: '202', type: 'suite', capacity: 4, pricePerNight: 9500, status: 'occupied', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'] },
  { id: 'r7', roomNumber: '203', type: 'suite', capacity: 4, pricePerNight: 9500, status: 'available', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'] },
  { id: 'r8', roomNumber: '204', type: 'deluxe', capacity: 3, pricePerNight: 7500, status: 'maintenance', floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
  { id: 'r9', roomNumber: '301', type: 'deluxe', capacity: 3, pricePerNight: 7500, status: 'available', floor: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
  { id: 'r10', roomNumber: '302', type: 'presidential', capacity: 6, pricePerNight: 25000, status: 'available', floor: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchen', 'Living Room'] },
];

// Guests
export const guests: Guest[] = [
  { id: 'g1', name: 'Rahul Sharma', email: 'rahul.sharma@email.com', phone: '+91 98765 43210', preferences: { roomType: 'double', foodType: 'veg' }, createdAt: formatDate(addDays(today, -30)), updatedAt: formatDate(today) },
  { id: 'g2', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 87654 32109', preferences: { roomType: 'suite', foodType: 'non_veg' }, createdAt: formatDate(addDays(today, -25)), updatedAt: formatDate(today) },
  { id: 'g3', name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '+91 76543 21098', preferences: { roomType: 'single' }, createdAt: formatDate(addDays(today, -20)), updatedAt: formatDate(today) },
  { id: 'g4', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 65432 10987', preferences: { foodType: 'vegan', allergies: ['nuts', 'dairy'] }, createdAt: formatDate(addDays(today, -15)), updatedAt: formatDate(today) },
  { id: 'g5', name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 54321 09876', preferences: { roomType: 'deluxe', specialRequests: 'Early check-in preferred' }, createdAt: formatDate(addDays(today, -10)), updatedAt: formatDate(today) },
  { id: 'g6', name: 'Ananya Iyer', email: 'ananya.iyer@email.com', phone: '+91 43210 98765', preferences: { roomType: 'double', foodType: 'veg' }, createdAt: formatDate(addDays(today, -5)), updatedAt: formatDate(today) },
];

// Bookings
export const bookings: Booking[] = [
  { id: 'b1', guestId: 'g1', roomId: 'r2', checkIn: formatDate(today), checkOut: formatDate(addDays(today, 3)), status: 'checked_in', totalAmount: 16500, paidAmount: 16500, source: 'direct', createdAt: formatDate(addDays(today, -5)), updatedAt: formatDate(today) },
  { id: 'b2', guestId: 'g2', roomId: 'r6', checkIn: formatDate(addDays(today, -1)), checkOut: formatDate(addDays(today, 2)), status: 'checked_in', totalAmount: 28500, paidAmount: 15000, source: 'booking_com', createdAt: formatDate(addDays(today, -10)), updatedAt: formatDate(today) },
  { id: 'b3', guestId: 'g3', roomId: 'r1', checkIn: formatDate(addDays(today, 1)), checkOut: formatDate(addDays(today, 4)), status: 'confirmed', totalAmount: 10500, paidAmount: 5000, source: 'website', createdAt: formatDate(addDays(today, -3)), updatedAt: formatDate(today) },
  { id: 'b4', guestId: 'g4', roomId: 'r5', checkIn: formatDate(addDays(today, 2)), checkOut: formatDate(addDays(today, 5)), status: 'confirmed', totalAmount: 16500, paidAmount: 0, source: 'airbnb', createdAt: formatDate(addDays(today, -2)), updatedAt: formatDate(today) },
  { id: 'b5', guestId: 'g5', roomId: 'r9', checkIn: formatDate(addDays(today, 5)), checkOut: formatDate(addDays(today, 8)), status: 'confirmed', totalAmount: 22500, paidAmount: 22500, source: 'oyo', createdAt: formatDate(addDays(today, -1)), updatedAt: formatDate(today) },
  { id: 'b6', guestId: 'g6', roomId: 'r3', checkIn: formatDate(addDays(today, -5)), checkOut: formatDate(addDays(today, -2)), status: 'checked_out', totalAmount: 16500, paidAmount: 16500, source: 'expedia', createdAt: formatDate(addDays(today, -15)), updatedAt: formatDate(addDays(today, -2)) },
  { id: 'b7', guestId: 'g1', roomId: 'r7', checkIn: formatDate(addDays(today, 10)), checkOut: formatDate(addDays(today, 12)), status: 'confirmed', totalAmount: 19000, paidAmount: 10000, source: 'website', createdAt: formatDate(addDays(today, -1)), updatedAt: formatDate(today) },
  { id: 'b8', guestId: 'g3', roomId: 'r10', checkIn: formatDate(addDays(today, 15)), checkOut: formatDate(addDays(today, 18)), status: 'confirmed', totalAmount: 75000, paidAmount: 25000, source: 'direct', createdAt: formatDate(today), updatedAt: formatDate(today) },
];

// Event Halls
export const eventHalls: EventHall[] = [
  { id: 'h1', name: 'Grand Ballroom', capacity: 500, pricePerDay: 150000, amenities: ['Stage', 'Sound System', 'Projector', 'AC', 'Dance Floor'], description: 'Our largest venue perfect for grand celebrations' },
  { id: 'h2', name: 'Crystal Hall', capacity: 200, pricePerDay: 75000, amenities: ['Stage', 'Sound System', 'Projector', 'AC'], description: 'Elegant hall with crystal chandeliers' },
  { id: 'h3', name: 'Garden Pavilion', capacity: 150, pricePerDay: 50000, amenities: ['Open Air', 'Garden View', 'Tent Coverage'], description: 'Beautiful outdoor venue surrounded by gardens' },
  { id: 'h4', name: 'Conference Room A', capacity: 50, pricePerDay: 25000, amenities: ['Projector', 'Video Conferencing', 'AC', 'Whiteboard'], description: 'Professional setting for business meetings' },
  { id: 'h5', name: 'Conference Room B', capacity: 30, pricePerDay: 15000, amenities: ['Projector', 'AC', 'Whiteboard'], description: 'Compact meeting room for small groups' },
];

// Events
export const events: Event[] = [
  { id: 'e1', name: 'Sharma-Verma Wedding', type: 'wedding', hallId: 'h1', date: formatDate(addDays(today, 7)), startTime: '10:00', endTime: '23:00', guestCount: 350, status: 'confirmed', contactName: 'Rajesh Sharma', contactPhone: '+91 98765 11111', contactEmail: 'rajesh@email.com', allocatedRoomIds: ['r3', 'r5', 'r7', 'r9', 'r10'], foodPlanId: 'fp1', totalAmount: 850000, paidAmount: 500000, createdAt: formatDate(addDays(today, -30)), updatedAt: formatDate(today) },
  { id: 'e2', name: 'Tech Conference 2024', type: 'conference', hallId: 'h2', date: formatDate(addDays(today, 14)), startTime: '09:00', endTime: '18:00', guestCount: 150, status: 'confirmed', contactName: 'Arun Tech', contactPhone: '+91 87654 22222', contactEmail: 'arun@techconf.com', allocatedRoomIds: ['r1', 'r2'], foodPlanId: 'fp2', totalAmount: 200000, paidAmount: 200000, createdAt: formatDate(addDays(today, -20)), updatedAt: formatDate(today) },
  { id: 'e3', name: 'Birthday Celebration - 50th', type: 'party', hallId: 'h3', date: formatDate(addDays(today, 3)), startTime: '18:00', endTime: '23:00', guestCount: 80, status: 'confirmed', contactName: 'Meera Gupta', contactPhone: '+91 76543 33333', contactEmail: 'meera@email.com', allocatedRoomIds: [], totalAmount: 120000, paidAmount: 60000, createdAt: formatDate(addDays(today, -15)), updatedAt: formatDate(today) },
  { id: 'e4', name: 'Board Meeting Q1', type: 'meeting', hallId: 'h4', date: formatDate(addDays(today, 1)), startTime: '10:00', endTime: '16:00', guestCount: 25, status: 'confirmed', contactName: 'Corporate Sec', contactPhone: '+91 65432 44444', contactEmail: 'corp@business.com', allocatedRoomIds: [], totalAmount: 35000, paidAmount: 35000, createdAt: formatDate(addDays(today, -7)), updatedAt: formatDate(today) },
  { id: 'e5', name: 'Product Launch Event', type: 'seminar', hallId: 'h2', date: formatDate(addDays(today, 21)), startTime: '14:00', endTime: '20:00', guestCount: 180, status: 'inquiry', contactName: 'Marketing Lead', contactPhone: '+91 54321 55555', contactEmail: 'marketing@startup.com', allocatedRoomIds: [], totalAmount: 0, paidAmount: 0, createdAt: formatDate(addDays(today, -2)), updatedAt: formatDate(today) },
];

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

// Event Food Plans
export const eventFoodPlans: EventFoodPlan[] = [
  { id: 'fp1', eventId: 'e1', menuPackageId: 'mp3', customMenuItemIds: [], guestCount: 350, mealTimes: ['lunch', 'dinner'], totalAmount: 875000 },
  { id: 'fp2', eventId: 'e2', menuPackageId: 'mp4', customMenuItemIds: [], guestCount: 150, mealTimes: ['lunch'], totalAmount: 150000 },
];

// Invoices
export const invoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2024-001', guestId: 'g1', bookingId: 'b1', items: [{ id: 'i1', description: 'Room Charges (3 nights)', quantity: 3, unitPrice: 5500, totalPrice: 16500 }], subtotal: 16500, tax: 2970, discount: 0, totalAmount: 19470, paidAmount: 19470, status: 'paid', dueDate: formatDate(today), createdAt: formatDate(addDays(today, -5)), updatedAt: formatDate(today) },
  { id: 'inv2', invoiceNumber: 'INV-2024-002', guestId: 'g2', bookingId: 'b2', items: [{ id: 'i2', description: 'Suite Room (3 nights)', quantity: 3, unitPrice: 9500, totalPrice: 28500 }], subtotal: 28500, tax: 5130, discount: 1500, totalAmount: 32130, paidAmount: 15000, status: 'partial', dueDate: formatDate(addDays(today, 2)), createdAt: formatDate(addDays(today, -10)), updatedAt: formatDate(today) },
  { id: 'inv3', invoiceNumber: 'INV-2024-003', guestId: 'g1', eventId: 'e1', items: [{ id: 'i3', description: 'Grand Ballroom Rental', quantity: 1, unitPrice: 150000, totalPrice: 150000 }, { id: 'i4', description: 'Catering (350 guests)', quantity: 350, unitPrice: 2500, totalPrice: 875000 }], subtotal: 1025000, tax: 184500, discount: 50000, totalAmount: 1159500, paidAmount: 500000, status: 'partial', dueDate: formatDate(addDays(today, 7)), createdAt: formatDate(addDays(today, -30)), updatedAt: formatDate(today) },
];

// Payments
export const payments: Payment[] = [
  { id: 'p1', invoiceId: 'inv1', amount: 19470, method: 'card', reference: 'TXN123456', createdAt: formatDate(addDays(today, -3)) },
  { id: 'p2', invoiceId: 'inv2', amount: 15000, method: 'bank_transfer', reference: 'NEFT987654', createdAt: formatDate(addDays(today, -8)) },
  { id: 'p3', invoiceId: 'inv3', amount: 300000, method: 'bank_transfer', reference: 'NEFT111222', createdAt: formatDate(addDays(today, -28)) },
  { id: 'p4', invoiceId: 'inv3', amount: 200000, method: 'cash', createdAt: formatDate(addDays(today, -14)) },
];

// Integrations
export const integrations: Integration[] = [
  { id: 'int1', platform: 'booking_com', status: 'active', lastSyncAt: new Date().toISOString(), settings: { propertyId: 'PROP123' } },
  { id: 'int2', platform: 'airbnb', status: 'active', lastSyncAt: new Date().toISOString(), settings: { listingId: 'LIST456' } },
  { id: 'int3', platform: 'expedia', status: 'paused', lastSyncAt: formatDate(addDays(today, -2)), settings: {} },
  { id: 'int4', platform: 'google_calendar', status: 'active', lastSyncAt: new Date().toISOString(), settings: { calendarId: 'primary' } },
  { id: 'int5', platform: 'website', status: 'active', lastSyncAt: new Date().toISOString(), settings: { webhookUrl: 'https://hotel.com/api/bookings' } },
];

// External Bookings
export const externalBookings: ExternalBooking[] = [
  { id: 'eb1', externalId: 'BK-12345', source: 'booking_com', guestName: 'John Smith', guestEmail: 'john@gmail.com', roomId: 'r3', checkIn: formatDate(addDays(today, 10)), checkOut: formatDate(addDays(today, 13)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -1)), syncedAt: formatDate(today) },
  { id: 'eb2', externalId: 'AIR-67890', source: 'airbnb', guestName: 'Sarah Johnson', guestEmail: 'sarah@email.com', roomId: 'r5', checkIn: formatDate(addDays(today, 15)), checkOut: formatDate(addDays(today, 18)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -2)), syncedAt: formatDate(addDays(today, -1)) },
  { id: 'eb3', externalId: 'WEB-11111', source: 'website', guestName: 'Pending Guest', guestEmail: 'pending@email.com', checkIn: formatDate(addDays(today, 20)), checkOut: formatDate(addDays(today, 22)), syncStatus: 'pending', rawData: {}, createdAt: formatDate(today) },
  { id: 'eb4', externalId: 'OYO-22222', source: 'oyo', guestName: 'Ravi Kumar', guestEmail: 'ravi@gmail.com', roomId: 'r1', checkIn: formatDate(addDays(today, 8)), checkOut: formatDate(addDays(today, 10)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -1)), syncedAt: formatDate(today) },
  { id: 'eb5', externalId: 'EXP-33333', source: 'expedia', guestName: 'Maria Garcia', guestEmail: 'maria@email.com', roomId: 'r7', checkIn: formatDate(addDays(today, 12)), checkOut: formatDate(addDays(today, 14)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -3)), syncedAt: formatDate(addDays(today, -2)) },
  { id: 'eb6', externalId: 'WEB-44444', source: 'website', guestName: 'Deepak Joshi', guestEmail: 'deepak@email.com', roomId: 'r9', checkIn: formatDate(addDays(today, 25)), checkOut: formatDate(addDays(today, 28)), syncStatus: 'synced', rawData: {}, createdAt: formatDate(addDays(today, -4)), syncedAt: formatDate(addDays(today, -3)) },
];

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

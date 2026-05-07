import type { Property, PropertyPerformance, ChainStats, Alert, StaffMember, ReputationReview } from '../types';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const subDays = (date: Date, days: number) => { const r = new Date(date); r.setDate(r.getDate() - days); return r; };

export const properties: Property[] = [
  {
    id: 'p1', name: 'The Grand Meridian Mumbai', code: 'MUM-01',
    address: '14 Marine Drive', city: 'Mumbai', state: 'Maharashtra', country: 'India',
    type: 'luxury', status: 'active', totalRooms: 280, starRating: 5,
    region: 'West India', brand: 'Meridian Luxury Collection',
    amenities: ['Pool', 'Spa', 'Gym', '3 Restaurants', 'Conference Halls', 'Valet Parking'],
    contactPhone: '+91 22 6600 0000', contactEmail: 'gm@grandmeridianmumbai.com',
    coordinates: { lat: 18.9322, lng: 72.8264 }, createdAt: '2018-03-15',
  },
  {
    id: 'p2', name: 'Horizon Business Bangalore', code: 'BLR-01',
    address: '88 MG Road', city: 'Bangalore', state: 'Karnataka', country: 'India',
    type: 'business', status: 'active', totalRooms: 180, starRating: 4,
    region: 'South India', brand: 'Horizon Business Hotels',
    amenities: ['Gym', 'Business Center', '2 Restaurants', 'Rooftop Bar', 'EV Charging'],
    contactPhone: '+91 80 2500 0000', contactEmail: 'gm@horizonblr.com',
    coordinates: { lat: 12.9716, lng: 77.5946 }, createdAt: '2019-07-22',
  },
  {
    id: 'p3', name: 'Palmera Resort Goa', code: 'GOA-01',
    address: '32 Calangute Beach Road', city: 'Goa', state: 'Goa', country: 'India',
    type: 'resort', status: 'active', totalRooms: 120, starRating: 5,
    region: 'West India', brand: 'Palmera Beach Resorts',
    amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Water Sports', '4 Restaurants', 'Kids Club'],
    contactPhone: '+91 832 660 0000', contactEmail: 'gm@palmeragoa.com',
    coordinates: { lat: 15.5449, lng: 73.7525 }, createdAt: '2020-01-10',
  },
  {
    id: 'p4', name: 'Imperial Palace Delhi', code: 'DEL-01',
    address: '5 Janpath Road', city: 'New Delhi', state: 'Delhi', country: 'India',
    type: 'luxury', status: 'active', totalRooms: 320, starRating: 5,
    region: 'North India', brand: 'Meridian Luxury Collection',
    amenities: ['Pool', 'Spa', 'Heritage Gallery', '5 Restaurants', 'Banquet Halls', 'Helipad'],
    contactPhone: '+91 11 2300 0000', contactEmail: 'gm@imperialdelhi.com',
    coordinates: { lat: 28.6139, lng: 77.2090 }, createdAt: '2015-11-05',
  },
  {
    id: 'p5', name: 'Skyline Boutique Chennai', code: 'CHN-01',
    address: '12 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', country: 'India',
    type: 'boutique', status: 'active', totalRooms: 85, starRating: 4,
    region: 'South India', brand: 'Skyline Boutique Collection',
    amenities: ['Rooftop Pool', 'Art Gallery', 'Spa', '2 Restaurants', 'Heritage Tour Desk'],
    contactPhone: '+91 44 2800 0000', contactEmail: 'gm@skylinechennai.com',
    coordinates: { lat: 13.0827, lng: 80.2707 }, createdAt: '2021-06-18',
  },
  {
    id: 'p6', name: 'Mountain View Shimla', code: 'SML-01',
    address: '1 The Ridge', city: 'Shimla', state: 'Himachal Pradesh', country: 'India',
    type: 'resort', status: 'maintenance', totalRooms: 60, starRating: 4,
    region: 'North India', brand: 'Skyline Boutique Collection',
    amenities: ['Mountain Views', 'Bonfire Area', 'Spa', 'Restaurant', 'Adventure Desk'],
    contactPhone: '+91 177 2800 000', contactEmail: 'gm@mountainviewshimla.com',
    coordinates: { lat: 31.1048, lng: 77.1734 }, createdAt: '2022-12-01',
  },
];

export const propertyPerformances: PropertyPerformance[] = [
  {
    propertyId: 'p1', propertyName: 'The Grand Meridian Mumbai', city: 'Mumbai',
    region: 'West India', type: 'luxury', status: 'active', totalRooms: 280,
    occupancy: 82, revenue: 5840000, revPAR: 16640, adr: 20293, rating: 4.7,
    totalReviews: 1248, growth: 12.4, rank: 1,
    revenueHistory: [4200000, 4600000, 4900000, 5100000, 5400000, 5840000],
  },
  {
    propertyId: 'p4', propertyName: 'Imperial Palace Delhi', city: 'New Delhi',
    region: 'North India', type: 'luxury', status: 'active', totalRooms: 320,
    occupancy: 78, revenue: 5120000, revPAR: 15000, adr: 19231, rating: 4.6,
    totalReviews: 2103, growth: 8.1, rank: 2,
    revenueHistory: [3900000, 4200000, 4500000, 4700000, 4900000, 5120000],
  },
  {
    propertyId: 'p3', propertyName: 'Palmera Resort Goa', city: 'Goa',
    region: 'West India', type: 'resort', status: 'active', totalRooms: 120,
    occupancy: 91, revenue: 3280000, revPAR: 22500, adr: 24725, rating: 4.8,
    totalReviews: 876, growth: 22.3, rank: 3,
    revenueHistory: [1800000, 2100000, 2400000, 2700000, 3000000, 3280000],
  },
  {
    propertyId: 'p2', propertyName: 'Horizon Business Bangalore', city: 'Bangalore',
    region: 'South India', type: 'business', status: 'active', totalRooms: 180,
    occupancy: 74, revenue: 2640000, revPAR: 10200, adr: 13784, rating: 4.3,
    totalReviews: 654, growth: 5.6, rank: 4,
    revenueHistory: [2100000, 2200000, 2300000, 2350000, 2500000, 2640000],
  },
  {
    propertyId: 'p5', propertyName: 'Skyline Boutique Chennai', city: 'Chennai',
    region: 'South India', type: 'boutique', status: 'active', totalRooms: 85,
    occupancy: 69, revenue: 1420000, revPAR: 9800, adr: 14203, rating: 4.5,
    totalReviews: 312, growth: 3.2, rank: 5,
    revenueHistory: [1100000, 1150000, 1200000, 1280000, 1350000, 1420000],
  },
  {
    propertyId: 'p6', propertyName: 'Mountain View Shimla', city: 'Shimla',
    region: 'North India', type: 'resort', status: 'maintenance', totalRooms: 60,
    occupancy: 12, revenue: 280000, revPAR: 1680, adr: 14000, rating: 4.1,
    totalReviews: 98, growth: -45.2, rank: 6,
    revenueHistory: [520000, 510000, 480000, 420000, 350000, 280000],
  },
];

export const chainStats: ChainStats = {
  totalProperties: 6,
  activeProperties: 5,
  totalRooms: 1045,
  chainOccupancy: 74.2,
  chainRevenue: 18580000,
  chainRevPAR: 13040,
  chainADR: 17574,
  chainNPS: 72,
  totalGuests: 8420,
  totalBookings: 12640,
  cancellationRate: 8.4,
  netGrowth: 14.2,
  pendingAlerts: 7,
};

export const alerts: Alert[] = [
  { id: 'a1', title: 'Revenue Drop Alert', message: 'Mountain View Shimla revenue dropped 45% vs last month — maintenance closure impacting bookings.', severity: 'critical', category: 'revenue', propertyId: 'p6', propertyName: 'Mountain View Shimla', isRead: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'a2', title: 'VIP Guest Complaint', message: 'VIP guest Mr. Kapoor (Diamond tier) filed a complaint about room service delay at Imperial Palace Delhi.', severity: 'critical', category: 'vip', propertyId: 'p4', propertyName: 'Imperial Palace Delhi', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a3', title: 'Rating Dip Detected', message: 'TripAdvisor rating for Horizon Business Bangalore dropped from 4.5 to 4.3 over last 30 days.', severity: 'high', category: 'rating', propertyId: 'p2', propertyName: 'Horizon Business Bangalore', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a4', title: 'High Cancellation Rate', message: 'Cancellation rate for Palmera Resort Goa spiked to 18% this week — 3x normal threshold.', severity: 'high', category: 'cancellation', propertyId: 'p3', propertyName: 'Palmera Resort Goa', isRead: false, createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 'a5', title: 'Payment Gateway Failure', message: 'Stripe payment gateway returned 3 failed transactions at Grand Meridian Mumbai in the last hour.', severity: 'high', category: 'payment', propertyId: 'p1', propertyName: 'The Grand Meridian Mumbai', isRead: false, createdAt: new Date(Date.now() - 21600000).toISOString() },
  { id: 'a6', title: 'Staff Shortage', message: 'Housekeeping team at Skyline Boutique Chennai is understaffed — 3 staff called in sick.', severity: 'medium', category: 'staff', propertyId: 'p5', propertyName: 'Skyline Boutique Chennai', isRead: true, createdAt: new Date(Date.now() - 43200000).toISOString() },
  { id: 'a7', title: 'Maintenance Overdue', message: 'HVAC maintenance at Mountain View Shimla is 14 days overdue. Affects 12 rooms.', severity: 'medium', category: 'maintenance', propertyId: 'p6', propertyName: 'Mountain View Shimla', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'a8', title: 'Occupancy Milestone', message: 'Palmera Resort Goa hit 91% occupancy — all-time record for the property!', severity: 'low', category: 'revenue', propertyId: 'p3', propertyName: 'Palmera Resort Goa', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const staffMembers: StaffMember[] = [
  { id: 's1', name: 'Arjun Mehta', email: 'arjun.m@grandmeridian.com', phone: '+91 98001 11001', role: 'General Manager', department: 'management', propertyId: 'p1', status: 'active', shift: 'morning', joinDate: '2018-03-15' },
  { id: 's2', name: 'Priya Nair', email: 'priya.n@grandmeridian.com', phone: '+91 98001 11002', role: 'Front Office Manager', department: 'front_desk', propertyId: 'p1', status: 'active', shift: 'morning', joinDate: '2019-06-01' },
  { id: 's3', name: 'Ravi Sharma', email: 'ravi.s@grandmeridian.com', phone: '+91 98001 11003', role: 'Head Chef', department: 'restaurant', propertyId: 'p1', status: 'active', shift: 'morning', joinDate: '2020-01-15' },
  { id: 's4', name: 'Deepa Krishnan', email: 'deepa.k@horizon.com', phone: '+91 98002 22001', role: 'General Manager', department: 'management', propertyId: 'p2', status: 'active', shift: 'morning', joinDate: '2019-07-22' },
  { id: 's5', name: 'Anil Verma', email: 'anil.v@horizon.com', phone: '+91 98002 22002', role: 'Events Coordinator', department: 'events', propertyId: 'p2', status: 'active', shift: 'morning', joinDate: '2021-03-01' },
  { id: 's6', name: 'Sneha Goa', email: 'sneha.g@palmera.com', phone: '+91 98003 33001', role: 'General Manager', department: 'management', propertyId: 'p3', status: 'active', shift: 'morning', joinDate: '2020-01-10' },
  { id: 's7', name: 'Marco Pereira', email: 'marco.p@palmera.com', phone: '+91 98003 33002', role: 'Beach Activities Manager', department: 'events', propertyId: 'p3', status: 'active', shift: 'morning', joinDate: '2020-06-01' },
  { id: 's8', name: 'Kavya Singh', email: 'kavya.s@imperial.com', phone: '+91 98004 44001', role: 'General Manager', department: 'management', propertyId: 'p4', status: 'active', shift: 'morning', joinDate: '2015-11-05' },
  { id: 's9', name: 'Rakesh Gupta', email: 'rakesh.g@imperial.com', phone: '+91 98004 44002', role: 'Head of Security', department: 'security', propertyId: 'p4', status: 'active', shift: 'night', joinDate: '2016-03-15' },
  { id: 's10', name: 'Nisha Thomas', email: 'nisha.t@imperial.com', phone: '+91 98004 44003', role: 'Spa Director', department: 'spa', propertyId: 'p4', status: 'on_leave', shift: 'morning', joinDate: '2017-08-20' },
  { id: 's11', name: 'Vikram Rajan', email: 'vikram.r@skyline.com', phone: '+91 98005 55001', role: 'General Manager', department: 'management', propertyId: 'p5', status: 'active', shift: 'morning', joinDate: '2021-06-18' },
  { id: 's12', name: 'Ananya Pillai', email: 'ananya.p@skyline.com', phone: '+91 98005 55002', role: 'Housekeeping Supervisor', department: 'housekeeping', propertyId: 'p5', status: 'off_duty', shift: 'afternoon', joinDate: '2022-01-10' },
  { id: 's13', name: 'Rahul Thakur', email: 'rahul.t@mountainview.com', phone: '+91 98006 66001', role: 'General Manager', department: 'management', propertyId: 'p6', status: 'active', shift: 'morning', joinDate: '2022-12-01' },
];

export const reputationReviews: ReputationReview[] = [
  { id: 'rv1', propertyId: 'p1', platform: 'google', guestName: 'Amit Desai', rating: 5, title: 'Absolutely world-class!', comment: 'The Grand Meridian exceeded all expectations. The staff were impeccable and the views from our sea-facing suite were breathtaking. Will definitely return.', sentiment: 'positive', categories: ['service', 'views', 'rooms'], createdAt: formatDate(subDays(today, 2)) },
  { id: 'rv2', propertyId: 'p1', platform: 'tripadvisor', guestName: 'Lisa Fernandez', rating: 4, title: 'Excellent stay, minor hiccups', comment: 'Loved the food and the pool area. Check-in took a bit long but the service afterwards was great. Business facilities are top notch.', sentiment: 'positive', categories: ['food', 'pool', 'check-in'], createdAt: formatDate(subDays(today, 5)) },
  { id: 'rv3', propertyId: 'p3', platform: 'booking_com', guestName: 'Sarah Williams', rating: 5, title: 'Paradise on Earth', comment: 'Palmera Resort is pure magic. Private beach access, incredible infinity pool, and the best sunset cocktails we have ever had. Perfect honeymoon destination!', sentiment: 'positive', categories: ['beach', 'pool', 'ambiance'], createdAt: formatDate(subDays(today, 1)) },
  { id: 'rv4', propertyId: 'p2', platform: 'google', guestName: 'Rajesh Kumar', rating: 3, title: 'Good for business, not leisure', comment: 'Functional and clean but the rooms feel dated. WiFi was patchy. Food is average at best. Location is central which is the main advantage.', sentiment: 'neutral', categories: ['rooms', 'wifi', 'food'], createdAt: formatDate(subDays(today, 3)) },
  { id: 'rv5', propertyId: 'p4', platform: 'tripadvisor', guestName: 'Michael Brown', rating: 5, title: 'Heritage grandeur at its finest', comment: 'Imperial Palace Delhi is the perfect blend of colonial heritage and modern luxury. The butler service is remarkable and the dinner at Darbar was unforgettable.', sentiment: 'positive', categories: ['heritage', 'service', 'food'], createdAt: formatDate(subDays(today, 4)) },
  { id: 'rv6', propertyId: 'p5', platform: 'google', guestName: 'Priya Menon', rating: 4, title: 'Hidden gem in Chennai', comment: 'Skyline Boutique is a refreshing change from cookie-cutter hotels. The art gallery concept is charming and the rooftop pool at night is magical. Staff are warm and attentive.', sentiment: 'positive', categories: ['design', 'pool', 'service'], createdAt: formatDate(subDays(today, 6)) },
  { id: 'rv7', propertyId: 'p2', platform: 'expedia', guestName: 'Chen Wei', rating: 2, title: 'Disappointed with service', comment: 'Expected much better for the price. Room service was extremely slow, AC was noisy and room was smaller than photos suggested. Would not recommend for the price point.', sentiment: 'negative', categories: ['service', 'ac', 'room size'], createdAt: formatDate(subDays(today, 7)) },
  { id: 'rv8', propertyId: 'p6', platform: 'booking_com', guestName: 'Neha Joshi', rating: 4, title: 'Stunning mountain views', comment: 'The mountain views are breathtaking and staff are very helpful. Currently undergoing some renovations so a few facilities were unavailable but the core experience was wonderful.', sentiment: 'positive', categories: ['views', 'service', 'renovation'], createdAt: formatDate(subDays(today, 8)) },
];

export const monthlyRevenueData = [
  { month: 'Nov', p1: 4200000, p2: 2100000, p3: 1800000, p4: 3900000, p5: 1100000, p6: 520000 },
  { month: 'Dec', p1: 4600000, p2: 2200000, p3: 2100000, p4: 4200000, p5: 1150000, p6: 510000 },
  { month: 'Jan', p1: 4900000, p2: 2300000, p3: 2400000, p4: 4500000, p5: 1200000, p6: 480000 },
  { month: 'Feb', p1: 5100000, p2: 2350000, p3: 2700000, p4: 4700000, p5: 1280000, p6: 420000 },
  { month: 'Mar', p1: 5400000, p2: 2500000, p3: 3000000, p4: 4900000, p5: 1350000, p6: 350000 },
  { month: 'Apr', p1: 5840000, p2: 2640000, p3: 3280000, p4: 5120000, p5: 1420000, p6: 280000 },
];

export const aiInsights = [
  { id: 'ai1', icon: '📈', title: 'Revenue Forecast', insight: 'Chain-wide revenue projected to grow 18% next quarter driven by Goa resort peak season and Mumbai corporate travel surge.', confidence: 87, tag: 'Forecast' },
  { id: 'ai2', icon: '⚠️', title: 'Cancellation Anomaly', insight: 'Palmera Resort Goa cancellation rate is 3.2x above threshold. Analysis suggests pricing mismatch vs Agoda competitors during May long weekend.', confidence: 91, tag: 'Risk' },
  { id: 'ai3', icon: '🌟', title: 'Upsell Opportunity', insight: 'Imperial Palace Delhi has 42 guests with Gold+ loyalty tier arriving this week. Personalized suite upgrade offers could generate ₹8.4L incremental revenue.', confidence: 78, tag: 'Revenue' },
  { id: 'ai4', icon: '😊', title: 'Sentiment Trend', insight: 'Skyline Boutique Chennai reviews show 34% increase in positive mentions of "rooftop" and "art gallery" — key differentiators to amplify in marketing.', confidence: 94, tag: 'Reputation' },
  { id: 'ai5', icon: '🔧', title: 'Maintenance Predictor', insight: 'Historical data suggests Mountain View Shimla HVAC systems require replacement within 60 days. Proactive maintenance will prevent peak-season downtime.', confidence: 83, tag: 'Operations' },
  { id: 'ai6', icon: '👥', title: 'Staffing Optimization', insight: 'Horizon Business Bangalore is over-staffed on Friday mornings and under-staffed Saturday evenings. Shift rebalancing could save ₹1.2L/month.', confidence: 76, tag: 'Operations' },
];

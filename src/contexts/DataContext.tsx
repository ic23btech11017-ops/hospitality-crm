import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Room,
  Booking,
  Guest,
  Event,
  EventHall,
  MenuItem,
  MenuPackage,
  EventFoodPlan,
  Invoice,
  Payment,
  Integration,
  ExternalBooking,
  SyncLog,
  DashboardStats,
} from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { initialData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  // Data
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  events: Event[];
  eventHalls: EventHall[];
  menuItems: MenuItem[];
  menuPackages: MenuPackage[];
  eventFoodPlans: EventFoodPlan[];
  invoices: Invoice[];
  payments: Payment[];
  integrations: Integration[];
  externalBookings: ExternalBooking[];
  syncLogs: SyncLog[];
  
  // Dashboard
  getDashboardStats: () => DashboardStats;
  
  // Room operations
  addRoom: (room: Omit<Room, 'id'>) => Room;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  getRoomById: (id: string) => Room | undefined;
  
  // Booking operations
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBookingById: (id: string) => Booking | undefined;
  getBookingsByGuestId: (guestId: string) => Booking[];
  getBookingsByRoomId: (roomId: string) => Booking[];
  
  // Guest operations
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => Guest;
  updateGuest: (id: string, data: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  getGuestById: (id: string) => Guest | undefined;
  
  // Event operations
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Event;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  getEventHallById: (id: string) => EventHall | undefined;
  
  // Menu operations
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  getMenuItemById: (id: string) => MenuItem | undefined;
  
  // Menu package operations
  addMenuPackage: (pkg: Omit<MenuPackage, 'id'>) => MenuPackage;
  updateMenuPackage: (id: string, data: Partial<MenuPackage>) => void;
  deleteMenuPackage: (id: string) => void;
  
  // Event food plan operations
  addEventFoodPlan: (plan: Omit<EventFoodPlan, 'id'>) => EventFoodPlan;
  updateEventFoodPlan: (id: string, data: Partial<EventFoodPlan>) => void;
  deleteEventFoodPlan: (id: string) => void;
  getEventFoodPlanByEventId: (eventId: string) => EventFoodPlan | undefined;
  
  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByGuestId: (guestId: string) => Invoice[];
  
  // Payment operations
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Payment;
  getPaymentsByInvoiceId: (invoiceId: string) => Payment[];
  
  // Integration operations
  updateIntegration: (id: string, data: Partial<Integration>) => void;
  
  // Sync operations
  addSyncLog: (log: Omit<SyncLog, 'id' | 'createdAt'>) => SyncLog;
  
  // Reset data
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initializeData = <T,>(key: string, defaultData: T[]): T[] => {
  const stored = storage.get<T[]>(key, []);
  if (stored.length === 0) {
    storage.set(key, defaultData);
    return defaultData;
  }
  return stored;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => initializeData(STORAGE_KEYS.ROOMS, initialData.rooms));
  const [bookings, setBookings] = useState<Booking[]>(() => initializeData(STORAGE_KEYS.BOOKINGS, initialData.bookings));
  const [guests, setGuests] = useState<Guest[]>(() => initializeData(STORAGE_KEYS.GUESTS, initialData.guests));
  const [events, setEvents] = useState<Event[]>(() => initializeData(STORAGE_KEYS.EVENTS, initialData.events));
  const [eventHalls] = useState<EventHall[]>(initialData.eventHalls);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => initializeData(STORAGE_KEYS.MENU_ITEMS, initialData.menuItems));
  const [menuPackages, setMenuPackages] = useState<MenuPackage[]>(() => initializeData(STORAGE_KEYS.MENU_PACKAGES, initialData.menuPackages));
  const [eventFoodPlans, setEventFoodPlans] = useState<EventFoodPlan[]>(() => initializeData(STORAGE_KEYS.EVENT_FOOD_PLANS, initialData.eventFoodPlans));
  const [invoices, setInvoices] = useState<Invoice[]>(() => initializeData(STORAGE_KEYS.INVOICES, initialData.invoices));
  const [payments, setPayments] = useState<Payment[]>(() => initializeData(STORAGE_KEYS.PAYMENTS, initialData.payments));
  const [integrations, setIntegrations] = useState<Integration[]>(() => initializeData(STORAGE_KEYS.INTEGRATIONS, initialData.integrations));
  const [externalBookings, setExternalBookings] = useState<ExternalBooking[]>(() => initializeData(STORAGE_KEYS.EXTERNAL_BOOKINGS, initialData.externalBookings));
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => initializeData(STORAGE_KEYS.SYNC_LOGS, initialData.syncLogs));

  // Persist to localStorage
  useEffect(() => { storage.set(STORAGE_KEYS.ROOMS, rooms); }, [rooms]);
  useEffect(() => { storage.set(STORAGE_KEYS.BOOKINGS, bookings); }, [bookings]);
  useEffect(() => { storage.set(STORAGE_KEYS.GUESTS, guests); }, [guests]);
  useEffect(() => { storage.set(STORAGE_KEYS.EVENTS, events); }, [events]);
  useEffect(() => { storage.set(STORAGE_KEYS.MENU_ITEMS, menuItems); }, [menuItems]);
  useEffect(() => { storage.set(STORAGE_KEYS.MENU_PACKAGES, menuPackages); }, [menuPackages]);
  useEffect(() => { storage.set(STORAGE_KEYS.EVENT_FOOD_PLANS, eventFoodPlans); }, [eventFoodPlans]);
  useEffect(() => { storage.set(STORAGE_KEYS.INVOICES, invoices); }, [invoices]);
  useEffect(() => { storage.set(STORAGE_KEYS.PAYMENTS, payments); }, [payments]);
  useEffect(() => { storage.set(STORAGE_KEYS.INTEGRATIONS, integrations); }, [integrations]);
  useEffect(() => { storage.set(STORAGE_KEYS.EXTERNAL_BOOKINGS, externalBookings); }, [externalBookings]);
  useEffect(() => { storage.set(STORAGE_KEYS.SYNC_LOGS, syncLogs); }, [syncLogs]);

  const today = new Date().toISOString().split('T')[0];

  // Dashboard stats
  const getDashboardStats = useCallback((): DashboardStats => {
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const todayCheckIns = bookings.filter(b => b.checkIn === today && b.status === 'confirmed').length;
    const todayCheckOuts = bookings.filter(b => b.checkOut === today && b.status === 'checked_in').length;
    const upcomingEvents = events.filter(e => e.date >= today && e.status === 'confirmed').length;
    const monthlyRevenue = invoices
      .filter(i => i.createdAt.startsWith(today.substring(0, 7)))
      .reduce((sum, i) => sum + i.paidAmount, 0);
    const pendingPayments = invoices
      .filter(i => i.status === 'partial' || i.status === 'sent')
      .reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);

    return {
      totalRooms: rooms.length,
      occupiedRooms,
      availableRooms,
      occupancyRate: Math.round((occupiedRooms / rooms.length) * 100),
      todayCheckIns,
      todayCheckOuts,
      upcomingEvents,
      monthlyRevenue,
      pendingPayments,
    };
  }, [rooms, bookings, events, invoices, today]);

  // Room operations
  const addRoom = useCallback((room: Omit<Room, 'id'>): Room => {
    const newRoom = { ...room, id: uuidv4() };
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  }, []);

  const getRoomById = useCallback((id: string) => rooms.find(r => r.id === id), [rooms]);

  // Booking operations
  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking => {
    const now = new Date().toISOString();
    const newBooking = { ...booking, id: uuidv4(), createdAt: now, updatedAt: now };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, []);

  const updateBooking = useCallback((id: string, data: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b));
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const getBookingById = useCallback((id: string) => bookings.find(b => b.id === id), [bookings]);
  const getBookingsByGuestId = useCallback((guestId: string) => bookings.filter(b => b.guestId === guestId), [bookings]);
  const getBookingsByRoomId = useCallback((roomId: string) => bookings.filter(b => b.roomId === roomId), [bookings]);

  // Guest operations
  const addGuest = useCallback((guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Guest => {
    const now = new Date().toISOString().split('T')[0];
    const newGuest = { ...guest, id: uuidv4(), createdAt: now, updatedAt: now };
    setGuests(prev => [...prev, newGuest]);
    return newGuest;
  }, []);

  const updateGuest = useCallback((id: string, data: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...data, updatedAt: new Date().toISOString().split('T')[0] } : g));
  }, []);

  const deleteGuest = useCallback((id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  }, []);

  const getGuestById = useCallback((id: string) => guests.find(g => g.id === id), [guests]);

  // Event operations
  const addEvent = useCallback((event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event => {
    const now = new Date().toISOString().split('T')[0];
    const newEvent = { ...event, id: uuidv4(), createdAt: now, updatedAt: now };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, data: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString().split('T')[0] } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const getEventById = useCallback((id: string) => events.find(e => e.id === id), [events]);
  const getEventHallById = useCallback((id: string) => eventHalls.find(h => h.id === id), [eventHalls]);

  // Menu operations
  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem = { ...item, id: uuidv4() };
    setMenuItems(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const updateMenuItem = useCallback((id: string, data: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const getMenuItemById = useCallback((id: string) => menuItems.find(i => i.id === id), [menuItems]);

  // Menu package operations
  const addMenuPackage = useCallback((pkg: Omit<MenuPackage, 'id'>): MenuPackage => {
    const newPkg = { ...pkg, id: uuidv4() };
    setMenuPackages(prev => [...prev, newPkg]);
    return newPkg;
  }, []);

  const updateMenuPackage = useCallback((id: string, data: Partial<MenuPackage>) => {
    setMenuPackages(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deleteMenuPackage = useCallback((id: string) => {
    setMenuPackages(prev => prev.filter(p => p.id !== id));
  }, []);

  // Event food plan operations
  const addEventFoodPlan = useCallback((plan: Omit<EventFoodPlan, 'id'>): EventFoodPlan => {
    const newPlan = { ...plan, id: uuidv4() };
    setEventFoodPlans(prev => [...prev, newPlan]);
    return newPlan;
  }, []);

  const updateEventFoodPlan = useCallback((id: string, data: Partial<EventFoodPlan>) => {
    setEventFoodPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deleteEventFoodPlan = useCallback((id: string) => {
    setEventFoodPlans(prev => prev.filter(p => p.id !== id));
  }, []);

  const getEventFoodPlanByEventId = useCallback((eventId: string) => eventFoodPlans.find(p => p.eventId === eventId), [eventFoodPlans]);

  // Invoice operations
  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Invoice => {
    const now = new Date().toISOString().split('T')[0];
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice = { ...invoice, id: uuidv4(), invoiceNumber, createdAt: now, updatedAt: now };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  }, [invoices.length]);

  const updateInvoice = useCallback((id: string, data: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString().split('T')[0] } : i));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  }, []);

  const getInvoiceById = useCallback((id: string) => invoices.find(i => i.id === id), [invoices]);
  const getInvoicesByGuestId = useCallback((guestId: string) => invoices.filter(i => i.guestId === guestId), [invoices]);

  // Payment operations
  const addPayment = useCallback((payment: Omit<Payment, 'id' | 'createdAt'>): Payment => {
    const newPayment = { ...payment, id: uuidv4(), createdAt: new Date().toISOString().split('T')[0] };
    setPayments(prev => [...prev, newPayment]);
    
    // Update invoice paid amount
    const invoice = invoices.find(i => i.id === payment.invoiceId);
    if (invoice) {
      const newPaidAmount = invoice.paidAmount + payment.amount;
      const newStatus = newPaidAmount >= invoice.totalAmount ? 'paid' : 'partial';
      updateInvoice(payment.invoiceId, { paidAmount: newPaidAmount, status: newStatus });
    }
    
    return newPayment;
  }, [invoices, updateInvoice]);

  const getPaymentsByInvoiceId = useCallback((invoiceId: string) => payments.filter(p => p.invoiceId === invoiceId), [payments]);

  // Integration operations
  const updateIntegration = useCallback((id: string, data: Partial<Integration>) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  }, []);

  // Sync operations
  const addSyncLog = useCallback((log: Omit<SyncLog, 'id' | 'createdAt'>): SyncLog => {
    const newLog = { ...log, id: uuidv4(), createdAt: new Date().toISOString() };
    setSyncLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    return newLog;
  }, []);

  // Reset data
  const resetData = useCallback(() => {
    storage.clear();
    setRooms(initialData.rooms);
    setBookings(initialData.bookings);
    setGuests(initialData.guests);
    setEvents(initialData.events);
    setMenuItems(initialData.menuItems);
    setMenuPackages(initialData.menuPackages);
    setEventFoodPlans(initialData.eventFoodPlans);
    setInvoices(initialData.invoices);
    setPayments(initialData.payments);
    setIntegrations(initialData.integrations);
    setExternalBookings(initialData.externalBookings);
    setSyncLogs(initialData.syncLogs);
  }, []);

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        guests,
        events,
        eventHalls,
        menuItems,
        menuPackages,
        eventFoodPlans,
        invoices,
        payments,
        integrations,
        externalBookings,
        syncLogs,
        getDashboardStats,
        addRoom,
        updateRoom,
        deleteRoom,
        getRoomById,
        addBooking,
        updateBooking,
        deleteBooking,
        getBookingById,
        getBookingsByGuestId,
        getBookingsByRoomId,
        addGuest,
        updateGuest,
        deleteGuest,
        getGuestById,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        getEventHallById,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMenuItemById,
        addMenuPackage,
        updateMenuPackage,
        deleteMenuPackage,
        addEventFoodPlan,
        updateEventFoodPlan,
        deleteEventFoodPlan,
        getEventFoodPlanByEventId,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        getInvoicesByGuestId,
        addPayment,
        getPaymentsByInvoiceId,
        updateIntegration,
        addSyncLog,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

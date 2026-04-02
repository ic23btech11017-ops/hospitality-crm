import React from 'react';
import { Grid, Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton, LinearProgress } from '@mui/material';
import {
  Hotel as HotelIcon,
  Event as EventIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Language as WebsiteIcon,
  Home as AirbnbIcon,
  Flight as ExpediaIcon,
  Storefront as OyoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard, DataCard } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate, getRoomTypeLabel, getEventTypeLabel } from '../../utils/helpers';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDashboardStats, rooms, bookings, events, guests, eventHalls, externalBookings } = useData();
  const stats = getDashboardStats();

  // Revenue chart data (mock data for demo)
  const revenueData = [
    { name: 'Jan', rooms: 450000, events: 280000, food: 120000 },
    { name: 'Feb', rooms: 520000, events: 350000, food: 150000 },
    { name: 'Mar', rooms: 480000, events: 420000, food: 180000 },
    { name: 'Apr', rooms: 550000, events: 380000, food: 200000 },
    { name: 'May', rooms: 620000, events: 450000, food: 220000 },
    { name: 'Jun', rooms: 580000, events: 520000, food: 250000 },
  ];

  // Room status distribution
  const roomStatusData = [
    { name: 'Available', value: stats.availableRooms, color: '#10b981' },
    { name: 'Occupied', value: stats.occupiedRooms, color: '#f59e0b' },
    { name: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: '#ef4444' },
    { name: 'Cleaning', value: rooms.filter(r => r.status === 'cleaning').length, color: '#6366f1' },
  ];

  // Booking sources data
  const bookingSourcesData = [
    { name: 'Direct / Walk-in', value: bookings.filter(b => !b.source || b.source === 'direct').length, color: '#2563eb', icon: <HotelIcon /> },
    { name: 'Website', value: externalBookings.filter(b => b.source === 'website').length, color: '#10b981', icon: <WebsiteIcon /> },
    { name: 'Booking.com', value: externalBookings.filter(b => b.source === 'booking_com').length, color: '#003580', icon: <HotelIcon /> },
    { name: 'Airbnb', value: externalBookings.filter(b => b.source === 'airbnb').length, color: '#FF5A5F', icon: <AirbnbIcon /> },
    { name: 'OYO', value: externalBookings.filter(b => b.source === 'oyo').length, color: '#EE2E24', icon: <OyoIcon /> },
    { name: 'Expedia', value: externalBookings.filter(b => b.source === 'expedia').length, color: '#FFCC00', icon: <ExpediaIcon /> },
  ];

  const totalBookings = bookingSourcesData.reduce((sum, s) => sum + s.value, 0) || 1;

  // Today's bookings
  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = bookings.filter(b => b.checkIn === today && b.status === 'confirmed');
  const todayCheckOuts = bookings.filter(b => b.checkOut === today && b.status === 'checked_in');

  // Upcoming events (next 7 days)
  const next7Days = new Date();
  next7Days.setDate(next7Days.getDate() + 7);
  const upcomingEvents = events
    .filter(e => e.date >= today && e.date <= next7Days.toISOString().split('T')[0] && e.status === 'confirmed')
    .slice(0, 5);

  // Recent guests
  const recentGuests = guests.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening at your hotel today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            subtitle={`${stats.occupiedRooms} of ${stats.totalRooms} rooms`}
            icon={<HotelIcon />}
            color="primary"
            trend={{ value: 12, isPositive: true }}
            to="/rooms"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Check-ins"
            value={stats.todayCheckIns}
            subtitle={`${stats.todayCheckOuts} check-outs`}
            icon={<TodayIcon />}
            color="success"
            to="/rooms"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            subtitle="Next 7 days"
            icon={<EventIcon />}
            color="secondary"
            to="/events"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            subtitle={`${formatCurrency(stats.pendingPayments)} pending`}
            icon={<TrendingUpIcon />}
            color="warning"
            trend={{ value: 8, isPositive: true }}
            to="/billing"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <DataCard title="Revenue Overview" subtitle="Last 6 months">
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRooms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="rooms" stroke="#2563eb" fillOpacity={1} fill="url(#colorRooms)" name="Rooms" />
                  <Area type="monotone" dataKey="events" stroke="#7c3aed" fillOpacity={1} fill="url(#colorEvents)" name="Events" />
                  <Area type="monotone" dataKey="food" stroke="#10b981" fillOpacity={1} fill="url(#colorFood)" name="Food" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </DataCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DataCard title="Room Status" subtitle="Current distribution">
            <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {roomStatusData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography variant="caption">{item.name}: {item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </DataCard>
        </Grid>
      </Grid>

      {/* Booking Sources Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <DataCard title="Booking Sources" subtitle="Where your bookings come from">
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {bookingSourcesData.map((source) => (
                  <Grid size={{ xs: 6, sm: 4, md: 2 }} key={source.name}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: source.color,
                          boxShadow: `0 0 0 1px ${source.color}20`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          backgroundColor: `${source.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1,
                          color: source.color,
                        }}
                      >
                        {source.icon}
                      </Box>
                      <Typography variant="h5" fontWeight={700}>
                        {source.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {source.name}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(source.value / totalBookings) * 100}
                        sx={{
                          mt: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: `${source.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: source.color,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DataCard>
        </Grid>
      </Grid>

      {/* Activity Section */}
      <Grid container spacing={3}>
        {/* Today's Schedule */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DataCard 
            title="Today's Schedule" 
            action={
              <IconButton onClick={() => navigate('/rooms')}>
                <ArrowForwardIcon />
              </IconButton>
            }
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Check-ins ({todayCheckIns.length})
              </Typography>
              {todayCheckIns.length > 0 ? (
                <List dense disablePadding>
                  {todayCheckIns.slice(0, 3).map((booking) => {
                    const guest = guests.find(g => g.id === booking.guestId);
                    const room = rooms.find(r => r.id === booking.roomId);
                    return (
                      <ListItem key={booking.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.light', width: 36, height: 36 }}>
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={guest?.name || 'Unknown Guest'}
                          secondary={`Room ${room?.roomNumber} • ${getRoomTypeLabel(room?.type || '')}`}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No check-ins today</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Check-outs ({todayCheckOuts.length})
              </Typography>
              {todayCheckOuts.length > 0 ? (
                <List dense disablePadding>
                  {todayCheckOuts.slice(0, 3).map((booking) => {
                    const guest = guests.find(g => g.id === booking.guestId);
                    const room = rooms.find(r => r.id === booking.roomId);
                    return (
                      <ListItem key={booking.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.light', width: 36, height: 36 }}>
                            <AccessTimeIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={guest?.name || 'Unknown Guest'}
                          secondary={`Room ${room?.roomNumber}`}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No check-outs today</Typography>
              )}
            </Box>
          </DataCard>
        </Grid>

        {/* Upcoming Events */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DataCard 
            title="Upcoming Events" 
            action={
              <IconButton onClick={() => navigate('/events')}>
                <ArrowForwardIcon />
              </IconButton>
            }
          >
            {upcomingEvents.length > 0 ? (
              <List dense disablePadding>
                {upcomingEvents.map((event) => {
                  const hall = eventHalls.find(h => h.id === event.hallId);
                  return (
                    <ListItem key={event.id} disablePadding sx={{ mb: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {event.name}
                          </Typography>
                          <Chip 
                            label={getEventTypeLabel(event.type)} 
                            size="small" 
                            sx={{ height: 20, fontSize: '0.7rem' }} 
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(event.date)} • {hall?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.guestCount} guests
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">No upcoming events</Typography>
            )}
          </DataCard>
        </Grid>

        {/* Recent Guests */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DataCard 
            title="Recent Guests" 
            action={
              <IconButton onClick={() => navigate('/guests')}>
                <ArrowForwardIcon />
              </IconButton>
            }
          >
            <List dense disablePadding>
              {recentGuests.map((guest) => {
                const guestBookings = bookings.filter(b => b.guestId === guest.id);
                const activeBooking = guestBookings.find(b => b.status === 'checked_in');
                return (
                  <ListItem key={guest.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                        {guest.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={guest.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption">{guestBookings.length} bookings</Typography>
                          {activeBooking && <StatusBadge status="checked_in" />}
                        </Box>
                      }
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </DataCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default DashboardPage;

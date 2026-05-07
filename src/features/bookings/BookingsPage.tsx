import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/helpers';

const BookingsPage: React.FC = () => {
  const { bookings, guests, rooms } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const guest = guests.find(g => g.id === booking.guestId);
      const matchesSearch = guest?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, guests, searchQuery, statusFilter]);

  return (
    <Box>
      <PageHeader
        title="Bookings Management"
        subtitle={`${bookings.length} total bookings`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Bookings' },
        ]}
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search guest name..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="checked_in">Checked In</MenuItem>
            <MenuItem value="checked_out">Checked Out</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="Try adjusting your filters"
        />
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((booking) => {
              const guest = guests.find(g => g.id === booking.guestId);
              const room = rooms.find(r => r.id === booking.roomId);

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" fontWeight={700}>
                              {guest?.name || 'Unknown Guest'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                              <HotelIcon fontSize="small" />
                              <Typography variant="body2">
                                Room {room?.roomNumber || 'N/A'} ({room?.type})
                              </Typography>
                            </Box>
                          </Box>
                          <StatusBadge status={booking.status} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" color="primary" fontWeight={600}>
                            {formatCurrency(booking.totalAmount)}
                          </Typography>
                          <Chip 
                            label={booking.source} 
                            size="small" 
                            variant="outlined" 
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Check-in</Typography>
                            <Typography variant="body2" fontWeight={600}>{booking.checkIn}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Check-out</Typography>
                            <Typography variant="body2" fontWeight={600}>{booking.checkOut}</Typography>
                          </Box>
                        </Box>

                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}
    </Box>
  );
};

export default BookingsPage;

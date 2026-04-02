import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, getInitials } from '../../utils/helpers';
import type { Guest, RoomType, FoodType } from '../../types';

const GuestsPage: React.FC = () => {
  const { guests, bookings, rooms, addGuest, updateGuest, deleteGuest } = useData();
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    idType: '' as 'passport' | 'national_id' | 'driver_license' | '',
    idNumber: '',
    preferences: {
      roomType: '' as RoomType | '',
      foodType: '' as FoodType | '',
      specialRequests: '',
      allergies: [] as string[],
    },
  });

  // Filter guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch = 
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.includes(searchQuery);
      return matchesSearch;
    });
  }, [guests, searchQuery]);

  const handleOpenDialog = (guest?: Guest) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        address: guest.address || '',
        idType: guest.idType || '',
        idNumber: guest.idNumber || '',
        preferences: {
          roomType: guest.preferences.roomType || '',
          foodType: guest.preferences.foodType || '',
          specialRequests: guest.preferences.specialRequests || '',
          allergies: guest.preferences.allergies || [],
        },
      });
    } else {
      setEditingGuest(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        idType: '',
        idNumber: '',
        preferences: {
          roomType: '',
          foodType: '',
          specialRequests: '',
          allergies: [],
        },
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGuest(null);
  };

  const handleSubmit = () => {
    const guestData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
      idType: formData.idType || undefined,
      idNumber: formData.idNumber || undefined,
      preferences: {
        roomType: formData.preferences.roomType || undefined,
        foodType: formData.preferences.foodType || undefined,
        specialRequests: formData.preferences.specialRequests || undefined,
        allergies: formData.preferences.allergies.length > 0 ? formData.preferences.allergies : undefined,
      },
    };

    if (editingGuest) {
      updateGuest(editingGuest.id, guestData);
    } else {
      addGuest(guestData as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (guest: Guest) => {
    setGuestToDelete(guest);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (guestToDelete) {
      deleteGuest(guestToDelete.id);
    }
    setDeleteDialogOpen(false);
    setGuestToDelete(null);
  };

  const handleViewDetails = (guest: Guest) => {
    setSelectedGuest(guest);
    setDetailDialogOpen(true);
  };

  const getGuestBookings = (guestId: string) => {
    return bookings.filter(b => b.guestId === guestId);
  };

  return (
    <Box>
      <PageHeader
        title="Guest Management"
        subtitle={`${guests.length} total guests`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Guests' },
        ]}
        action={
          hasPermission('guests', 'create')
            ? { label: 'Add Guest', onClick: () => handleOpenDialog() }
            : undefined
        }
      />

      {/* Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name, email, or phone..."
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
          sx={{ minWidth: 350 }}
        />
      </Box>

      {/* Guest Cards */}
      {filteredGuests.length === 0 ? (
        <EmptyState
          title="No guests found"
          description="Add your first guest or adjust your search"
          action={
            hasPermission('guests', 'create')
              ? { label: 'Add Guest', onClick: () => handleOpenDialog() }
              : undefined
          }
        />
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {filteredGuests.map((guest) => {
              const guestBookings = getGuestBookings(guest.id);
              const activeBooking = guestBookings.find(b => b.status === 'checked_in');
              const room = activeBooking ? rooms.find(r => r.id === activeBooking.roomId) : null;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guest.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      onClick={() => handleViewDetails(guest)}
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
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: 'primary.main',
                              fontSize: '1.25rem',
                            }}
                          >
                            {getInitials(guest.name)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {guest.name}
                            </Typography>
                            {activeBooking && (
                              <Chip
                                label={`Room ${room?.roomNumber}`}
                                size="small"
                                color="success"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {guest.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {guest.phone}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <HotelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {guestBookings.length} bookings
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                          {hasPermission('guests', 'edit') && (
                            <IconButton size="small" onClick={() => handleOpenDialog(guest)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {hasPermission('guests', 'delete') && (
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(guest)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                required
              />
            </Box>

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={formData.idType}
                  label="ID Type"
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value as typeof formData.idType })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="passport">Passport</MenuItem>
                  <MenuItem value="national_id">National ID</MenuItem>
                  <MenuItem value="driver_license">Driver License</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="ID Number"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Preferences</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Preferred Room Type</InputLabel>
                <Select
                  value={formData.preferences.roomType}
                  label="Preferred Room Type"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    preferences: { ...formData.preferences, roomType: e.target.value as RoomType } 
                  })}
                >
                  <MenuItem value="">No preference</MenuItem>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="suite">Suite</MenuItem>
                  <MenuItem value="deluxe">Deluxe</MenuItem>
                  <MenuItem value="presidential">Presidential</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Food Preference</InputLabel>
                <Select
                  value={formData.preferences.foodType}
                  label="Food Preference"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    preferences: { ...formData.preferences, foodType: e.target.value as FoodType } 
                  })}
                >
                  <MenuItem value="">No preference</MenuItem>
                  <MenuItem value="veg">Vegetarian</MenuItem>
                  <MenuItem value="non_veg">Non-Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Special Requests"
              value={formData.preferences.specialRequests}
              onChange={(e) => setFormData({ 
                ...formData, 
                preferences: { ...formData.preferences, specialRequests: e.target.value } 
              })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingGuest ? 'Save Changes' : 'Add Guest'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Guest Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              {selectedGuest && getInitials(selectedGuest.name)}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedGuest?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Guest since {selectedGuest && formatDate(selectedGuest.createdAt)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedGuest && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedGuest.email}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedGuest.phone}</Typography>
                </Grid>
                {selectedGuest.address && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                    <Typography variant="body1">{selectedGuest.address}</Typography>
                  </Grid>
                )}
              </Grid>

              <Typography variant="h6" sx={{ mb: 2 }}>Booking History</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Room</TableCell>
                      <TableCell>Check-in</TableCell>
                      <TableCell>Check-out</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getGuestBookings(selectedGuest.id).map((booking) => {
                      const room = rooms.find(r => r.id === booking.roomId);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>Room {room?.roomNumber}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell><StatusBadge status={booking.status} /></TableCell>
                        </TableRow>
                      );
                    })}
                    {getGuestBookings(selectedGuest.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No bookings yet</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Guest</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {guestToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GuestsPage;

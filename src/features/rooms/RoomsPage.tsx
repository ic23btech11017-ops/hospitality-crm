import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
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
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  CalendarMonth as TimelineIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon,
  Tv as TvIcon,
  AcUnit as AcIcon,
  LocalBar as BarIcon,
  Bathtub as BathtubIcon,
  Balcony as BalconyIcon,
  Kitchen as KitchenIcon,
  Weekend as LivingIcon,
  Language as WebsiteIcon,
  Home as AirbnbIcon,
  Flight as ExpediaIcon,
  Hotel as BookingIcon,
  Storefront as OyoIcon,
  Person as DirectIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import RoomTimeline from './RoomTimeline';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SyncButton } from '../../components/common/SyncButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, getRoomTypeLabel } from '../../utils/helpers';
import type { Room, RoomType, RoomStatus } from '../../types';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <WifiIcon fontSize="small" />,
  'TV': <TvIcon fontSize="small" />,
  'AC': <AcIcon fontSize="small" />,
  'Mini Bar': <BarIcon fontSize="small" />,
  'Jacuzzi': <BathtubIcon fontSize="small" />,
  'Balcony': <BalconyIcon fontSize="small" />,
  'Kitchen': <KitchenIcon fontSize="small" />,
  'Living Room': <LivingIcon fontSize="small" />,
};

const sourceConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  direct: { icon: <DirectIcon fontSize="small" />, color: '#2563eb', label: 'Direct' },
  website: { icon: <WebsiteIcon fontSize="small" />, color: '#10b981', label: 'Website' },
  booking_com: { icon: <BookingIcon fontSize="small" />, color: '#003580', label: 'Booking.com' },
  airbnb: { icon: <AirbnbIcon fontSize="small" />, color: '#FF5A5F', label: 'Airbnb' },
  oyo: { icon: <OyoIcon fontSize="small" />, color: '#EE2E24', label: 'OYO' },
  expedia: { icon: <ExpediaIcon fontSize="small" />, color: '#FFCC00', label: 'Expedia' },
};

const RoomsPage: React.FC = () => {
  const { rooms, bookings, addRoom, updateRoom, deleteRoom } = useData();
  const { hasPermission } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'single' as RoomType,
    capacity: 1,
    pricePerNight: 0,
    status: 'available' as RoomStatus,
    floor: 1,
    amenities: [] as string[],
    description: '',
  });

  const allAmenities = ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchen', 'Living Room'];

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      const matchesType = typeFilter === 'all' || room.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, searchQuery, statusFilter, typeFilter]);

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        type: room.type,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        status: room.status,
        floor: room.floor,
        amenities: room.amenities,
        description: room.description || '',
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        type: 'single',
        capacity: 1,
        pricePerNight: 0,
        status: 'available',
        floor: 1,
        amenities: [],
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = () => {
    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      addRoom(formData);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete.id);
    }
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSyncBookings = async () => {
    // Simulate API sync delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <Box>
      <PageHeader
        title="Room Management"
        subtitle={`${rooms.length} total rooms • ${rooms.filter(r => r.status === 'available').length} available`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Rooms' },
        ]}
        action={
          hasPermission('rooms', 'create')
            ? { label: 'Add Room', onClick: () => handleOpenDialog() }
            : undefined
        }
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SyncButton onSync={handleSyncBookings} label="Sync OTAs" successMessage="Room availability synced with OTA channels" />
          
          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="timeline">
              <TimelineIcon />
            </ToggleButton>
            <ToggleButton value="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ListViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </PageHeader>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search rooms..."
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
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="occupied">Occupied</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="cleaning">Cleaning</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="double">Double</MenuItem>
            <MenuItem value="suite">Suite</MenuItem>
            <MenuItem value="deluxe">Deluxe</MenuItem>
            <MenuItem value="presidential">Presidential</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Room Views */}
      {viewMode === 'timeline' ? (
        <RoomTimeline />
      ) : filteredRooms.length === 0 ? (
        <EmptyState
          title="No rooms found"
          description="Try adjusting your filters or add a new room"
          action={
            hasPermission('rooms', 'create')
              ? { label: 'Add Room', onClick: () => handleOpenDialog() }
              : undefined
          }
        />
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {filteredRooms.map((room) => (
              <Grid size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 12 }} key={room.id}>
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
                          <Typography variant="h5" fontWeight={700}>
                            Room {room.roomNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Floor {room.floor} • {getRoomTypeLabel(room.type)}
                          </Typography>
                        </Box>
                        <StatusBadge status={room.status} />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary" fontWeight={600}>
                          {formatCurrency(room.pricePerNight)}
                          <Typography component="span" variant="body2" color="text.secondary">
                            /night
                          </Typography>
                        </Typography>
                        <Chip label={`${room.capacity} ${room.capacity === 1 ? 'Guest' : 'Guests'}`} size="small" />
                      </Box>

                      {/* Amenities */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {room.amenities.slice(0, 5).map((amenity) => (
                          <Chip
                            key={amenity}
                            icon={amenityIcons[amenity] as React.ReactElement}
                            label={amenity}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                        {room.amenities.length > 5 && (
                          <Chip
                            label={`+${room.amenities.length - 5}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Spacer to push actions to bottom */}
                      <Box sx={{ flex: 1 }} />

                      {/* Current Booking Info with Source */}
                      {room.status === 'occupied' && (() => {
                        const today = new Date().toISOString().split('T')[0];
                        const currentBooking = bookings.find(b => 
                          b.roomId === room.id && 
                          b.checkIn <= today && 
                          b.checkOut > today &&
                          (b.status === 'checked_in' || b.status === 'confirmed')
                        );
                        const source = currentBooking?.source || 'direct';
                        const config = sourceConfig[source];
                        
                        return (
                          <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Currently occupied
                              </Typography>
                              <Tooltip title={`Booked via ${config.label}`}>
                                <Chip
                                  icon={config.icon as React.ReactElement}
                                  label={config.label}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: '0.7rem',
                                    backgroundColor: `${config.color}15`,
                                    color: config.color,
                                    '& .MuiChip-icon': { color: config.color },
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          </Box>
                        );
                      })()}

                      {/* Actions */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {hasPermission('rooms', 'edit') && (
                          <IconButton size="small" onClick={() => handleOpenDialog(room)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {hasPermission('rooms', 'delete') && (
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(room)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Room Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="suite">Suite</MenuItem>
                  <MenuItem value="deluxe">Deluxe</MenuItem>
                  <MenuItem value="presidential">Presidential</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="occupied">Occupied</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
                fullWidth
              />
              <TextField
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                fullWidth
              />
            </Box>
            <TextField
              label="Price per Night"
              type="number"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: parseInt(e.target.value) || 0 })}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {allAmenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    icon={amenityIcons[amenity] as React.ReactElement}
                    onClick={() => toggleAmenity(amenity)}
                    color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                    variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingRoom ? 'Save Changes' : 'Add Room'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Room {roomToDelete?.roomNumber}? This action cannot be undone.
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

export default RoomsPage;

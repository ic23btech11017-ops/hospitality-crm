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
  InputAdornment,
  Tabs,
  Tab,
  Checkbox,
  FormGroup,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Room as HallIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  ViewList as ListViewIcon,
} from '@mui/icons-material';
import EventSchedule from './EventSchedule';
import { motion, AnimatePresence } from 'framer-motion';
import { SyncButton } from '../../components/common/SyncButton';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate, formatTime, getEventTypeLabel } from '../../utils/helpers';
import type { Event, EventType, EventStatus } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const EventsPage: React.FC = () => {
  const { events, eventHalls, rooms, addEvent, updateEvent, deleteEvent } = useData();
  const { hasPermission } = useAuth();
  const [viewMode, setViewMode] = useState<'schedule' | 'list'>('schedule');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Form state
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'wedding',
    hallId: '',
    date: today,
    startTime: '10:00',
    endTime: '18:00',
    guestCount: 50,
    status: 'inquiry',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    allocatedRoomIds: [],
    totalAmount: 0,
    paidAmount: 0,
    notes: '',
  });

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.contactName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [events, searchQuery, statusFilter, typeFilter]);

  // Categorize events
  const upcomingEvents = filteredEvents.filter(e => e.date >= today && e.status !== 'cancelled');
  const pastEvents = filteredEvents.filter(e => e.date < today || e.status === 'completed');
  const inquiries = filteredEvents.filter(e => e.status === 'inquiry');

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        type: event.type,
        hallId: event.hallId,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        guestCount: event.guestCount,
        status: event.status,
        contactName: event.contactName,
        contactPhone: event.contactPhone,
        contactEmail: event.contactEmail,
        allocatedRoomIds: event.allocatedRoomIds,
        foodPlanId: event.foodPlanId,
        totalAmount: event.totalAmount,
        paidAmount: event.paidAmount,
        notes: event.notes || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: '',
        type: 'wedding',
        hallId: eventHalls[0]?.id || '',
        date: today,
        startTime: '10:00',
        endTime: '18:00',
        guestCount: 50,
        status: 'inquiry',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        allocatedRoomIds: [],
        totalAmount: 0,
        paidAmount: 0,
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = () => {
    // Calculate total amount
    const hall = eventHalls.find(h => h.id === formData.hallId);
    const hallCost = hall?.pricePerDay || 0;
    const totalAmount = hallCost;

    if (editingEvent) {
      updateEvent(editingEvent.id, { ...formData, totalAmount });
    } else {
      addEvent({ ...formData, totalAmount });
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const toggleRoomAllocation = (roomId: string) => {
    setFormData(prev => ({
      ...prev,
      allocatedRoomIds: prev.allocatedRoomIds.includes(roomId)
        ? prev.allocatedRoomIds.filter(id => id !== roomId)
        : [...prev.allocatedRoomIds, roomId],
    }));
  };

  const renderEventCard = (event: Event) => {
    const hall = eventHalls.find(h => h.id === event.hallId);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        key={event.id}
      >
        <Card
          sx={{
            mb: 2,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {event.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip label={getEventTypeLabel(event.type)} size="small" />
                  <StatusBadge status={event.status} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {hasPermission('events', 'edit') && (
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDialog(event); }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                {hasPermission('events', 'delete') && (
                  <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(event); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Date</Typography>
                    <Typography variant="body2" fontWeight={500}>{formatDate(event.date)}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Time</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HallIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Venue</Typography>
                    <Typography variant="body2" fontWeight={500}>{hall?.name || 'Not assigned'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Guests</Typography>
                    <Typography variant="body2" fontWeight={500}>{event.guestCount}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Contact: </Typography>
                <Typography variant="body2" component="span">{event.contactName}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {formatCurrency(event.totalAmount)}
                </Typography>
                {event.paidAmount > 0 && event.paidAmount < event.totalAmount && (
                  <Typography variant="caption" color="text.secondary">
                    Paid: {formatCurrency(event.paidAmount)}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const handleSyncEvents = async () => {
    // Simulate API sync delay for external calendar sources
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <Box>
      <PageHeader
        title="Event Management"
        subtitle={`${events.length} total events • ${upcomingEvents.length} upcoming`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Events' },
        ]}
        action={
          hasPermission('events', 'create')
            ? { label: 'Add Event', onClick: () => handleOpenDialog() }
            : undefined
        }
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SyncButton onSync={handleSyncEvents} label="Sync Calendars" successMessage="External calendars synced successfully" />
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="schedule">
              <CalendarIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ListViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </PageHeader>

      {viewMode === 'schedule' ? (
        <EventSchedule />
      ) : (
        <>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search events..."
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
                <MenuItem value="inquiry">Inquiry</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
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
                <MenuItem value="wedding">Wedding</MenuItem>
                <MenuItem value="conference">Conference</MenuItem>
                <MenuItem value="party">Party</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="seminar">Seminar</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tabs */}
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label={`Upcoming (${upcomingEvents.length})`} />
            <Tab label={`Inquiries (${inquiries.length})`} />
            <Tab label={`Past (${pastEvents.length})`} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {upcomingEvents.length === 0 ? (
              <EmptyState
                title="No upcoming events"
                description="Add a new event to get started"
                action={
                  hasPermission('events', 'create')
                    ? { label: 'Add Event', onClick: () => handleOpenDialog() }
                    : undefined
                }
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {upcomingEvents.map(renderEventCard)}
              </AnimatePresence>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {inquiries.length === 0 ? (
              <EmptyState
                title="No event inquiries"
                description="New inquiries will appear here"
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {inquiries.map(renderEventCard)}
              </AnimatePresence>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {pastEvents.length === 0 ? (
              <EmptyState
                title="No past events"
                description="Completed events will appear here"
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {pastEvents.map(renderEventCard)}
              </AnimatePresence>
            )}
          </TabPanel>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Event Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Event Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                >
                  <MenuItem value="wedding">Wedding</MenuItem>
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="party">Party</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="seminar">Seminar</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                >
                  <MenuItem value="inquiry">Inquiry</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Venue/Hall</InputLabel>
                <Select
                  value={formData.hallId}
                  label="Venue/Hall"
                  onChange={(e) => setFormData({ ...formData, hallId: e.target.value })}
                >
                  {eventHalls.map((hall) => (
                    <MenuItem key={hall.id} value={hall.id}>
                      {hall.name} (Capacity: {hall.capacity})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Guest Count"
                type="number"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Contact Information</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Contact Name"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                fullWidth
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Room Allocation (Optional)</Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
              <FormGroup>
                {rooms.filter(r => r.status === 'available').map((room) => (
                  <FormControlLabel
                    key={room.id}
                    control={
                      <Checkbox
                        checked={formData.allocatedRoomIds.includes(room.id)}
                        onChange={() => toggleRoomAllocation(room.id)}
                      />
                    }
                    label={`Room ${room.roomNumber} - ${room.type} (${room.capacity} guests)`}
                  />
                ))}
              </FormGroup>
            </Box>

            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingEvent ? 'Save Changes' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{eventToDelete?.name}"? This action cannot be undone.
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

export default EventsPage;

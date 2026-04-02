import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataCard } from '../../components/common/Cards';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate, getEventTypeLabel, getFoodCategoryLabel } from '../../utils/helpers';
import type { EventFoodPlan, MealTime } from '../../types';

const CateringPage: React.FC = () => {
  const { 
    events, 
    eventHalls, 
    menuItems, 
    menuPackages, 
    eventFoodPlans,
    addEventFoodPlan,
    updateEventFoodPlan,
    getEventFoodPlanByEventId,
    getMenuItemById,
  } = useData();
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [editingPlan, setEditingPlan] = useState<EventFoodPlan | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Form state
  const [formData, setFormData] = useState<Omit<EventFoodPlan, 'id'>>({
    eventId: '',
    menuPackageId: '',
    customMenuItemIds: [],
    guestCount: 50,
    mealTimes: ['lunch'],
    specialRequirements: '',
    totalAmount: 0,
  });

  // Events that need food planning
  const upcomingEvents = events.filter(e => e.date >= today && e.status !== 'cancelled');
  const eventsWithPlans = eventFoodPlans.map(fp => fp.eventId);
  const eventsNeedingPlans = upcomingEvents.filter(e => !eventsWithPlans.includes(e.id));

  // Filter events
  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [upcomingEvents, searchQuery]);

  const handleOpenDialog = (eventId: string, existingPlan?: EventFoodPlan) => {
    const event = events.find(e => e.id === eventId);
    if (existingPlan) {
      setEditingPlan(existingPlan);
      setFormData({
        eventId: existingPlan.eventId,
        menuPackageId: existingPlan.menuPackageId || '',
        customMenuItemIds: existingPlan.customMenuItemIds,
        guestCount: existingPlan.guestCount,
        mealTimes: existingPlan.mealTimes,
        specialRequirements: existingPlan.specialRequirements || '',
        totalAmount: existingPlan.totalAmount,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        eventId,
        menuPackageId: '',
        customMenuItemIds: [],
        guestCount: event?.guestCount || 50,
        mealTimes: ['lunch'],
        specialRequirements: '',
        totalAmount: 0,
      });
    }
    setSelectedEventId(eventId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
    setSelectedEventId('');
  };

  const calculateTotalAmount = () => {
    let total = 0;
    if (formData.menuPackageId) {
      const pkg = menuPackages.find(p => p.id === formData.menuPackageId);
      if (pkg) {
        total = pkg.pricePerPerson * formData.guestCount * formData.mealTimes.length;
      }
    }
    formData.customMenuItemIds.forEach(itemId => {
      const item = getMenuItemById(itemId);
      if (item) {
        total += item.price * formData.guestCount;
      }
    });
    return total;
  };

  const handleSubmit = () => {
    const totalAmount = calculateTotalAmount();
    if (editingPlan) {
      updateEventFoodPlan(editingPlan.id, { ...formData, totalAmount });
    } else {
      addEventFoodPlan({ ...formData, totalAmount });
    }
    handleCloseDialog();
  };

  const toggleMealTime = (mealTime: MealTime) => {
    setFormData(prev => ({
      ...prev,
      mealTimes: prev.mealTimes.includes(mealTime)
        ? prev.mealTimes.filter(m => m !== mealTime)
        : [...prev.mealTimes, mealTime],
    }));
  };

  const toggleMenuItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      customMenuItemIds: prev.customMenuItemIds.includes(itemId)
        ? prev.customMenuItemIds.filter(id => id !== itemId)
        : [...prev.customMenuItemIds, itemId],
    }));
  };

  const renderEventCard = (event: typeof events[0]) => {
    const hall = eventHalls.find(h => h.id === event.hallId);
    const foodPlan = getEventFoodPlanByEventId(event.id);
    const pkg = foodPlan?.menuPackageId ? menuPackages.find(p => p.id === foodPlan.menuPackageId) : null;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        key={event.id}
      >
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {event.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip label={getEventTypeLabel(event.type)} size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(event.date)} • {hall?.name}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">{event.guestCount} guests</Typography>
              </Box>
            </Box>

            {foodPlan ? (
              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2, color: 'success.contrastText' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Food Plan Set ✓
                    </Typography>
                    <Typography variant="body2">
                      {pkg?.name || 'Custom Menu'} • {foodPlan.mealTimes.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {formatCurrency(foodPlan.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No food plan configured for this event
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {hasPermission('food', 'edit') && (
                <Button
                  variant={foodPlan ? 'outlined' : 'contained'}
                  size="small"
                  startIcon={foodPlan ? <EditIcon /> : <AddIcon />}
                  onClick={() => handleOpenDialog(event.id, foodPlan || undefined)}
                >
                  {foodPlan ? 'Edit Plan' : 'Create Plan'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <Box>
      <PageHeader
        title="Event Catering"
        subtitle={`${upcomingEvents.length} upcoming events • ${eventsNeedingPlans.length} need food plans`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Food' },
          { label: 'Event Catering' },
        ]}
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataCard title="Menu Packages">
            <Typography variant="h4" fontWeight={700}>{menuPackages.length}</Typography>
            <Typography variant="body2" color="text.secondary">Available packages</Typography>
          </DataCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataCard title="Events with Plans">
            <Typography variant="h4" fontWeight={700}>{eventsWithPlans.length}</Typography>
            <Typography variant="body2" color="text.secondary">of {upcomingEvents.length} upcoming</Typography>
          </DataCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataCard title="Needs Attention">
            <Typography variant="h4" fontWeight={700} color="warning.main">{eventsNeedingPlans.length}</Typography>
            <Typography variant="body2" color="text.secondary">Without food plans</Typography>
          </DataCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataCard title="Total Revenue">
            <Typography variant="h4" fontWeight={700} color="success.main">
              {formatCurrency(eventFoodPlans.reduce((sum, fp) => sum + fp.totalAmount, 0))}
            </Typography>
            <Typography variant="body2" color="text.secondary">From catering</Typography>
          </DataCard>
        </Grid>
      </Grid>

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
          sx={{ minWidth: 300 }}
        />
      </Box>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          description="Events requiring food planning will appear here"
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredEvents.map(renderEventCard)}
        </AnimatePresence>
      )}

      {/* Food Plan Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlan ? 'Edit Food Plan' : 'Create Food Plan'}
          {selectedEvent && (
            <Typography variant="body2" color="text.secondary">
              {selectedEvent.name} • {formatDate(selectedEvent.date)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Guest Count"
                type="number"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                fullWidth
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Meal Times</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {(['breakfast', 'lunch', 'dinner'] as MealTime[]).map((meal) => (
                    <Chip
                      key={meal}
                      label={meal.charAt(0).toUpperCase() + meal.slice(1)}
                      onClick={() => toggleMealTime(meal)}
                      color={formData.mealTimes.includes(meal) ? 'primary' : 'default'}
                      variant={formData.mealTimes.includes(meal) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Select Menu Package</Typography>
              <Grid container spacing={2}>
                {menuPackages.map((pkg) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={pkg.id}>
                    <Card
                      onClick={() => setFormData({ ...formData, menuPackageId: pkg.id })}
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: formData.menuPackageId === pkg.id ? 'primary.main' : 'divider',
                        transition: 'all 0.2s',
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>{pkg.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {pkg.description}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(pkg.pricePerPerson)}/person
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Min: {pkg.minGuests} | Max: {pkg.maxGuests} guests
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Add Custom Items (Optional)
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
                <FormGroup>
                  {menuItems.filter(i => i.isAvailable).map((item) => (
                    <FormControlLabel
                      key={item.id}
                      control={
                        <Checkbox
                          checked={formData.customMenuItemIds.includes(item.id)}
                          onChange={() => toggleMenuItem(item.id)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{item.name} ({getFoodCategoryLabel(item.category)})</span>
                          <span>{formatCurrency(item.price)}</span>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>

            <TextField
              label="Special Requirements"
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Allergies, dietary restrictions, etc."
            />

            <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Estimated Total: {formatCurrency(calculateTotalAmount())}
              </Typography>
              <Typography variant="body2">
                For {formData.guestCount} guests × {formData.mealTimes.length} meal(s)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingPlan ? 'Save Changes' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CateringPage;

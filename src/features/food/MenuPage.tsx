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
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grass as VegIcon,
  SetMeal as NonVegIcon,
  Spa as VeganIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, getFoodCategoryLabel } from '../../utils/helpers';
import type { MenuItem as MenuItemType, FoodCategory, FoodType } from '../../types';

const foodTypeIcons: Record<FoodType, React.ReactNode> = {
  veg: <VegIcon sx={{ color: '#22c55e' }} />,
  non_veg: <NonVegIcon sx={{ color: '#ef4444' }} />,
  vegan: <VeganIcon sx={{ color: '#10b981' }} />,
};

const MenuPage: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const { hasPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItemType | null>(null);

  const categories: FoodCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'];

  // Form state
  const [formData, setFormData] = useState<Omit<MenuItemType, 'id'>>({
    name: '',
    category: 'breakfast',
    type: 'veg',
    price: 0,
    description: '',
    isAvailable: true,
  });

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesCategory = tabValue === 0 || item.category === categories[tabValue - 1];
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [menuItems, searchQuery, typeFilter, tabValue]);

  const handleOpenDialog = (item?: MenuItemType) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        type: item.type,
        price: item.price,
        description: item.description || '',
        isAvailable: item.isAvailable,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'breakfast',
        type: 'veg',
        price: 0,
        description: '',
        isAvailable: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
    } else {
      addMenuItem(formData);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (item: MenuItemType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleToggleAvailability = (item: MenuItemType) => {
    updateMenuItem(item.id, { isAvailable: !item.isAvailable });
  };

  const getCategoryCount = (category: FoodCategory) => {
    return menuItems.filter(i => i.category === category).length;
  };

  return (
    <Box>
      <PageHeader
        title="Menu Management"
        subtitle={`${menuItems.length} items • ${menuItems.filter(i => i.isAvailable).length} available`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Food' },
          { label: 'Menu' },
        ]}
        action={
          hasPermission('food', 'create')
            ? { label: 'Add Item', onClick: () => handleOpenDialog() }
            : undefined
        }
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search menu items..."
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
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="veg">Vegetarian</MenuItem>
            <MenuItem value="non_veg">Non-Vegetarian</MenuItem>
            <MenuItem value="vegan">Vegan</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Category Tabs */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }} variant="scrollable" scrollButtons="auto">
        <Tab label={`All (${menuItems.length})`} />
        {categories.map((cat) => (
          <Tab key={cat} label={`${getFoodCategoryLabel(cat)} (${getCategoryCount(cat)})`} />
        ))}
      </Tabs>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No menu items found"
          description="Try adjusting your filters or add a new item"
          action={
            hasPermission('food', 'create')
              ? { label: 'Add Item', onClick: () => handleOpenDialog() }
              : undefined
          }
        />
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
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
                      opacity: item.isAvailable ? 1 : 0.6,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {foodTypeIcons[item.type]}
                          <Typography variant="h6" fontWeight={600}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={item.isAvailable ? 'Available' : 'Unavailable'}
                          size="small"
                          color={item.isAvailable ? 'success' : 'default'}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {item.description || 'No description'}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip label={getFoodCategoryLabel(item.category)} size="small" variant="outlined" />
                        <Chip 
                          label={item.type === 'veg' ? 'Veg' : item.type === 'non_veg' ? 'Non-Veg' : 'Vegan'} 
                          size="small" 
                          sx={{
                            backgroundColor: item.type === 'veg' ? '#dcfce7' : item.type === 'non_veg' ? '#fee2e2' : '#d1fae5',
                            color: item.type === 'veg' ? '#166534' : item.type === 'non_veg' ? '#991b1b' : '#065f46',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary" fontWeight={600}>
                          {formatCurrency(item.price)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {hasPermission('food', 'edit') && (
                            <>
                              <Switch
                                size="small"
                                checked={item.isAvailable}
                                onChange={() => handleToggleAvailability(item)}
                              />
                              <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                          {hasPermission('food', 'delete') && (
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(item)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
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
        <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{getFoodCategoryLabel(cat)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as FoodType })}
                >
                  <MenuItem value="veg">Vegetarian</MenuItem>
                  <MenuItem value="non_veg">Non-Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingItem ? 'Save Changes' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Menu Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
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

export default MenuPage;

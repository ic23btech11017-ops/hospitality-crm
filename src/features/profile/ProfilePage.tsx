import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@hotel.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    department: 'Front Desk',
    joinDate: 'January 2024',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const recentActivities = [
    { action: 'Created booking', details: 'Room 301 - John Smith', time: '2 hours ago' },
    { action: 'Updated event', details: 'Wedding Reception - Hall A', time: '5 hours ago' },
    { action: 'Processed payment', details: 'Invoice #1234 - $450', time: '1 day ago' },
    { action: 'Added guest', details: 'Sarah Johnson', time: '2 days ago' },
    { action: 'Modified menu', details: 'Breakfast Menu - Added items', time: '3 days ago' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account information and view your activity
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Profile Info Card */}
          <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: '350px' } }}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    mb: 2,
                  }}
                >
                  {formData.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {formData.name}
                </Typography>
                <Chip
                  label={user?.role || 'Staff'}
                  color="primary"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {formData.department}
                </Typography>
                <Button
                  variant={isEditing ? 'outlined' : 'contained'}
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quick Stats
                </Typography>
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Total Bookings"
                      secondary="127"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Events Managed"
                      secondary="34"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Active Guests"
                      secondary="58"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Details and Activity */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Personal Information
                  </Typography>
                  {isEditing && (
                    <Box>
                      <Button startIcon={<SaveIcon />} color="success" onClick={handleSave} sx={{ mr: 1 }}>
                        Save
                      </Button>
                      <Button startIcon={<CancelIcon />} color="error" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={!isEditing}
                  />
                  <TextField
                    fullWidth
                    label="Join Date"
                    value={formData.joinDate}
                    disabled
                    InputProps={{
                      startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem disableGutters sx={{ py: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.details}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProfilePage;

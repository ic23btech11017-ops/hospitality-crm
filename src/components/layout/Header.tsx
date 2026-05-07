import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  Select,
  FormControl,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getInitials } from '../../utils/helpers';
import { alerts, properties } from '../../data/propertiesData';
import { Chip } from '@mui/material';
import { Speed as SpeedIcon } from '@mui/icons-material';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  drawerWidth: number;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isOwner, isBranchManager, currentPropertyId, setCurrentPropertyId } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  const enterpriseRoutes = ['/super-dashboard', '/properties', '/revenue', '/reputation', '/alerts', '/staff'];
  const isEnterpriseRoute = enterpriseRoutes.some(route => location.pathname.startsWith(route));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      owner: 'Owner',
      branch_manager: 'Branch Manager',
      staff: 'Staff',
    };
    return labels[role] || role;
  };

  // Demo notifications
  const notifications = [
    { id: 1, title: 'New Booking', message: 'Room 203 booked for tomorrow', time: '5 min ago' },
    { id: 2, title: 'Check-out Reminder', message: '2 guests checking out today', time: '1 hour ago' },
    { id: 3, title: 'Event Update', message: 'Wedding event confirmed', time: '2 hours ago' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Breadcrumbs */}
        {isOwner && (
          <Chip
            icon={<SpeedIcon sx={{ fontSize: '14px !important' }} />}
            label="Meridian Hotels Group"
            size="small"
            onClick={() => navigate('/super-dashboard')}
            sx={{ ml: 1, height: 26, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30', cursor: 'pointer', '&:hover': { bgcolor: '#f59e0b25' } }}
          />
        )}
        {isBranchManager && user?.branchName && (
          <Chip
            label={user.branchName}
            size="small"
            sx={{ ml: 1, height: 26, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#0ea5e915', color: '#0ea5e9', border: '1px solid #0ea5e930' }}
          />
        )}
        
        <Box sx={{ flexGrow: 1 }} />

        {isOwner && !isEnterpriseRoute && (
          <FormControl size="small" sx={{ minWidth: 200, mr: 2, display: { xs: 'none', sm: 'block' } }}>
            <Select
              value={currentPropertyId || properties[0].id}
              onChange={(e) => setCurrentPropertyId(e.target.value)}
              displayEmpty
              sx={{ 
                height: 32, 
                fontSize: '0.8rem',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
              }}
            >
              {properties.map((p) => (
                <MenuItem key={p.id} value={p.id} sx={{ fontSize: '0.8rem' }}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Theme Toggle */}
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Notifications / Alerts */}
        <Tooltip title={isOwner ? 'Alerts Center' : 'Notifications'}>
          <IconButton onClick={isOwner ? () => navigate('/alerts') : handleNotificationOpen} sx={{ color: 'text.primary' }}>
            <Badge badgeContent={isOwner ? unreadAlerts : notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleNotificationClose}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* User Menu */}
        <Box sx={{ ml: 2 }}>
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                }}
              >
                {user ? getInitials(user.name) : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 240 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role && getRoleLabel(user.role)}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

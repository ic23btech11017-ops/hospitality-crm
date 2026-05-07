import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Typography, Divider, IconButton, Chip, useMediaQuery, useTheme as useMuiTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Hotel as HotelIcon, Event as EventIcon,
  Restaurant as RestaurantIcon, People as PeopleIcon, Receipt as ReceiptIcon,
  ExpandLess, ExpandMore, MenuBook as MenuBookIcon, LocalDining as CateringIcon,
  ChevronLeft as ChevronLeftIcon, Business as BusinessIcon,
  BarChart as BarChartIcon, Star as StarIcon, Warning as WarningIcon,
  Group as GroupIcon, Settings as SettingsIcon, Speed as SpeedIcon,
  IntegrationInstructions as IntegIcon, Assessment as ReportIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  children?: { id: string; label: string; path: string; icon: React.ReactNode }[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// ─── Nav definitions by role ─────────────────────────────────────────────────

const ownerNav: NavSection[] = [
  {
    title: 'ENTERPRISE',
    items: [
      { id: 'super-dashboard', label: 'Intelligence Hub', icon: <SpeedIcon />, path: '/super-dashboard' },
      { id: 'properties',      label: 'All Branches',     icon: <BusinessIcon />, path: '/properties' },
      { id: 'revenue',         label: 'Revenue Intelligence', icon: <BarChartIcon />, path: '/revenue' },
      { id: 'reputation',      label: 'Reputation Monitor',   icon: <StarIcon />, path: '/reputation' },
      { id: 'alerts',          label: 'Alerts Center',    icon: <WarningIcon />, path: '/alerts', badge: 5 },
      { id: 'staff',           label: 'Staff Directory',  icon: <GroupIcon />, path: '/staff' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'dashboard', label: 'Property Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'rooms',     label: 'Rooms',    icon: <HotelIcon />,    path: '/rooms' },
      { id: 'bookings',  label: 'Bookings', icon: <ReceiptIcon />,  path: '/bookings' },
      { id: 'events',    label: 'Events',   icon: <EventIcon />,    path: '/events' },
      {
        id: 'food', label: 'Food & Catering', icon: <RestaurantIcon />,
        children: [
          { id: 'menu',     label: 'Regular Menu',   path: '/food/menu',     icon: <MenuBookIcon /> },
          { id: 'catering', label: 'Event Catering', path: '/food/catering', icon: <CateringIcon /> },
        ],
      },
      { id: 'guests',  label: 'Guests',  icon: <PeopleIcon />, path: '/guests' },
      { id: 'billing', label: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'integrations', label: 'Integrations', icon: <IntegIcon />,  path: '/integrations' },
      { id: 'settings',     label: 'Settings',     icon: <SettingsIcon />, path: '/settings' },
    ],
  },
];

const branchManagerNav = (branchName: string): NavSection[] => [
  {
    title: branchName.toUpperCase(),
    items: [
      { id: 'dashboard', label: 'Branch Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'reports',   label: 'Branch Reports',   icon: <ReportIcon />,    path: '/reports' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'rooms',    label: 'Rooms',    icon: <HotelIcon />,   path: '/rooms' },
      { id: 'bookings', label: 'Bookings', icon: <ReceiptIcon />, path: '/bookings' },
      { id: 'events',   label: 'Events',   icon: <EventIcon />,   path: '/events' },
      {
        id: 'food', label: 'Food & Catering', icon: <RestaurantIcon />,
        children: [
          { id: 'menu',     label: 'Regular Menu',   path: '/food/menu',     icon: <MenuBookIcon /> },
          { id: 'catering', label: 'Event Catering', path: '/food/catering', icon: <CateringIcon /> },
        ],
      },
      { id: 'guests',  label: 'Guests',  icon: <PeopleIcon />,  path: '/guests' },
      { id: 'billing', label: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { id: 'integrations', label: 'Integrations', icon: <IntegIcon />,   path: '/integrations' },
      { id: 'settings',     label: 'Settings',     icon: <SettingsIcon />, path: '/settings' },
    ],
  },
];

const staffNav: NavSection[] = [
  {
    title: 'OPERATIONS',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'rooms',     label: 'Rooms',     icon: <HotelIcon />,     path: '/rooms' },
      { id: 'bookings',  label: 'Bookings',  icon: <ReceiptIcon />,   path: '/bookings' },
      { id: 'events',    label: 'Events',    icon: <EventIcon />,     path: '/events' },
      {
        id: 'food', label: 'Food & Catering', icon: <RestaurantIcon />,
        children: [
          { id: 'menu',     label: 'Regular Menu',   path: '/food/menu',     icon: <MenuBookIcon /> },
          { id: 'catering', label: 'Event Catering', path: '/food/catering', icon: <CateringIcon /> },
        ],
      },
      { id: 'guests',  label: 'Guests',  icon: <PeopleIcon />,  path: '/guests' },
      { id: 'billing', label: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
    ],
  },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { user, isOwner, isBranchManager } = useAuth();

  // Pick nav sections based on role
  const sections: NavSection[] = isOwner
    ? ownerNav
    : isBranchManager
      ? branchManagerNav(user?.branchName ?? 'My Branch')
      : staffNav;

  const roleBadge = isOwner
    ? { label: '👑 Owner', color: '#f59e0b' }
    : isBranchManager
      ? { label: `🏨 ${user?.branchName ?? 'Branch'}`, color: '#0ea5e9' }
      : { label: `👤 ${user?.branchName ?? 'Staff'}`, color: '#10b981' };

  const isActive = (path?: string) =>
    path ? location.pathname === path || location.pathname.startsWith(path + '/') : false;

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) onClose();
    }
  };

  const activeStyle = {
    backgroundColor: 'primary.main',
    color: 'white',
    '& .MuiListItemIcon-root': { color: 'white' },
    '&:hover': { backgroundColor: 'primary.dark' },
  };

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 1.75, background: 'linear-gradient(135deg, #f59e0b, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1rem' }}>
            M
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.2, letterSpacing: 0.5 }}>MERIDIAN</Typography>
            <Typography sx={{ fontSize: '0.58rem', color: 'text.disabled', letterSpacing: 1.2 }}>HOTELS GROUP</Typography>
          </Box>
        </Box>
        {isMobile && <IconButton onClick={onClose} size="small"><ChevronLeftIcon /></IconButton>}
      </Box>

      {/* Role badge */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Chip label={roleBadge.label} size="small"
          sx={{ width: '100%', height: 28, fontWeight: 700, fontSize: '0.72rem', borderRadius: 1.5, bgcolor: `${roleBadge.color}15`, color: roleBadge.color, border: '1px solid', borderColor: `${roleBadge.color}30` }} />
      </Box>

      <Divider />

      {/* Nav sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, py: 1 }}>
        {sections.map((section, si) => (
          <Box key={si} sx={{ mb: 0.5 }}>
            {section.title && (
              <Typography sx={{ px: 1.5, py: 0.75, display: 'block', fontWeight: 800, fontSize: '0.58rem', letterSpacing: 1.4, color: 'text.disabled' }}>
                {section.title}
              </Typography>
            )}
            <List dense disablePadding>
              {section.items.map(item => (
                <React.Fragment key={item.id}>
                  <ListItem disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      onClick={() => handleNavClick(item)}
                      selected={isActive(item.path)}
                      sx={{ borderRadius: 1.5, py: 0.9, '&.Mui-selected': activeStyle }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: isActive(item.path) ? 'inherit' : 'text.secondary', '& svg': { fontSize: 19 } }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: isActive(item.path) ? 700 : 500 }}
                      />
                      {item.badge != null && (
                        <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '0.55rem', color: 'white', fontWeight: 800 }}>{item.badge}</Typography>
                        </Box>
                      )}
                      {item.children && (expandedItem === item.id ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />)}
                    </ListItemButton>
                  </ListItem>

                  {item.children && (
                    <Collapse in={expandedItem === item.id} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {item.children.map(child => (
                          <ListItem key={child.id} disablePadding sx={{ mb: 0.25 }}>
                            <ListItemButton
                              onClick={() => { navigate(child.path); if (isMobile) onClose(); }}
                              selected={isActive(child.path)}
                              sx={{ pl: 4.5, borderRadius: 1.5, py: 0.7, '&.Mui-selected': activeStyle }}
                            >
                              <ListItemIcon sx={{ minWidth: 30, color: isActive(child.path) ? 'inherit' : 'text.secondary', '& svg': { fontSize: 16 } }}>
                                {child.icon}
                              </ListItemIcon>
                              <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: isActive(child.path) ? 700 : 500 }} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>
            {si < sections.length - 1 && <Divider sx={{ mt: 1 }} />}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {user?.role?.replace('_', ' ')}
          {user?.staffRole ? ` · ${user.staffRole.replace('_', ' ')}` : ''}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: isMobile ? 'auto' : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          position: isMobile ? 'fixed' : 'relative',
        },
      }}
    >
      {content}
    </Drawer>
  );
};

export default Sidebar;

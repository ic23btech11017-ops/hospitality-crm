import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  ExpandLess,
  ExpandMore,
  MenuBook as MenuBookIcon,
  LocalDining as CateringIcon,
  ChevronLeft as ChevronLeftIcon,
  Sync as IntegrationsIcon,
} from '@mui/icons-material';


interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { id: string; label: string; path: string }[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { id: 'rooms', label: 'Rooms', icon: <HotelIcon />, path: '/rooms' },
  { id: 'events', label: 'Events', icon: <EventIcon />, path: '/events' },
  {
    id: 'food',
    label: 'Food',
    icon: <RestaurantIcon />,
    children: [
      { id: 'menu', label: 'Regular Menu', path: '/food/menu' },
      { id: 'catering', label: 'Event Catering', path: '/food/catering' },
    ],
  },
  { id: 'guests', label: 'Guests', icon: <PeopleIcon />, path: '/guests' },
  { id: 'billing', label: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
  { id: 'integrations', label: 'Integrations', icon: <IntegrationsIcon />, path: '/integrations' },
];

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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) onClose();
    }
  };

  const handleChildClick = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HotelIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Hospitality
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CRM System
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.children && (
                  openSubmenu === item.id ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={openSubmenu === item.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.id} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => handleChildClick(child.path)}
                        selected={isActive(child.path)}
                        sx={{
                          pl: 4,
                          borderRadius: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'white',
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: isActive(child.path) ? 'inherit' : 'text.secondary',
                          }}
                        >
                          {child.id === 'menu' ? <MenuBookIcon /> : <CateringIcon />}
                        </ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          © 2024 Hospitality CRM
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
        display: { xs: 'block', md: open ? 'block' : 'none' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          position: isMobile ? 'fixed' : 'relative',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;

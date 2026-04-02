import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  to?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  to,
  onClick,
}) => {
  const navigate = useNavigate();
  const isClickable = Boolean(to || onClick);

  const colorMap = {
    primary: '#2563eb',
    secondary: '#7c3aed',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
  };

  const iconColor = colorMap[color];

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={isClickable ? { y: -4 } : {}}
      style={{ height: '100%' }}
    >
      <MuiCard 
        sx={{ 
          height: '100%', 
          minHeight: 140,
          boxShadow: 2,
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'all 0.3s ease-in-out',
          '&:hover': isClickable ? {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          } : {},
        }}
        onClick={isClickable ? handleClick : undefined}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: '0.8rem',
                lineHeight: 1.4,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            {icon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: 2,
                  backgroundColor: `${iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                  ml: 1,
                  '& .MuiSvgIcon-root': { fontSize: 20 },
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              sx={{ 
                fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.65rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  display: 'block', 
                  mt: 0.5, 
                  fontSize: '0.75rem',
                  lineHeight: 1.3,
                }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ color: trend.isPositive ? 'success.main' : 'error.main', fontWeight: 600, fontSize: '0.75rem' }}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </MuiCard>
    </motion.div>
  );
};

interface DataCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  menuItems?: { label: string; onClick: () => void }[];
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  action,
  children,
  menuItems,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MuiCard sx={{ height: '100%' }}>
        <CardHeader
          title={title}
          subheader={subtitle}
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          action={
            menuItems ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {menuItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        item.onClick();
                        handleMenuClose();
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              action
            )
          }
        />
        <CardContent sx={{ pt: 0 }}>{children}</CardContent>
      </MuiCard>
    </motion.div>
  );
};

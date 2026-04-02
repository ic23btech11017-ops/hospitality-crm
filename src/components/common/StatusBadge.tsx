import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { getStatusColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const colorMap: Record<string, ChipProps['color']> = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    default: 'default',
  };

  const statusColor = getStatusColor(status);
  const label = status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return (
    <Chip
      label={label}
      size={size}
      color={colorMap[statusColor]}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default StatusBadge;

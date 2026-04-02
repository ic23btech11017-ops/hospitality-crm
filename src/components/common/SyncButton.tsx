import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

interface SyncButtonProps extends Omit<ButtonProps, 'onClick'> {
  label?: string;
  successMessage?: string;
  onSync: () => Promise<void>;
}

export const SyncButton: React.FC<SyncButtonProps> = ({ 
  label = 'Sync Data', 
  successMessage = 'Sync completed successfully',
  onSync,
  ...buttonProps 
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleSync}
        disabled={isSyncing}
        startIcon={
          <SyncIcon
            sx={{
              animation: isSyncing ? 'spin 1.5s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        }
        {...buttonProps}
      >
        {isSyncing ? 'Syncing...' : label}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', boxShadow: 3 }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

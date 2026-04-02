import React, { useState } from 'react';
import {
  Container,
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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Sync as SyncIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Hotel as BookingIcon,
  Home as AirbnbIcon,
  Flight as ExpediaIcon,
  CalendarMonth as CalendarIcon,
  Language as WebsiteIcon,
  CloudSync as CloudSyncIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/Cards';
import { SyncButton } from '../../components/common/SyncButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatDateTime } from '../../utils/helpers';
import type { Integration, IntegrationPlatform, SyncStatus } from '../../types';

const platformIcons: Record<IntegrationPlatform, React.ReactNode> = {
  booking_com: <BookingIcon />,
  airbnb: <AirbnbIcon />,
  expedia: <ExpediaIcon />,
  google_calendar: <CalendarIcon />,
  website: <WebsiteIcon />,
  oyo: <BookingIcon />,
};

const platformNames: Record<IntegrationPlatform, string> = {
  booking_com: 'Booking.com',
  airbnb: 'Airbnb',
  expedia: 'Expedia',
  google_calendar: 'Google Calendar',
  website: 'Website',
  oyo: 'OYO',
};

const platformColors: Record<IntegrationPlatform, string> = {
  booking_com: '#003580',
  airbnb: '#FF5A5F',
  expedia: '#00355F',
  google_calendar: '#4285F4',
  website: '#10b981',
  oyo: '#EE2E24',
};

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

const IntegrationsPage: React.FC = () => {
  const { 
    integrations, 
    externalBookings, 
    syncLogs,
    updateIntegration,
    addSyncLog,
  } = useData();
  const { hasPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Stats
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const pendingBookings = externalBookings.filter(b => b.syncStatus === 'pending').length;
  const successfulSyncs = syncLogs.filter(l => l.status === 'success').length;
  const failedSyncs = syncLogs.filter(l => l.status === 'failure').length;

  const handleToggleStatus = (integration: Integration) => {
    const newStatus: SyncStatus = integration.status === 'active' ? 'paused' : 'active';
    updateIntegration(integration.id, { status: newStatus });
    
    addSyncLog({
      type: 'availability',
      platform: integration.platform,
      status: 'success',
      message: `Integration ${newStatus === 'active' ? 'activated' : 'paused'}`,
    });
  };

  const handleSync = async (integration: Integration) => {
    setSyncing(integration.id);
    
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateIntegration(integration.id, { lastSyncAt: new Date().toISOString() });
    
    addSyncLog({
      type: 'booking',
      platform: integration.platform,
      status: 'success',
      message: `Manual sync completed for ${platformNames[integration.platform]}`,
    });
    setSyncing(null);
  };

  const handleSyncAll = async () => {
    // Simulate syncing all active integrations
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Update last sync time for all active integrations
    integrations.filter(i => i.status === 'active').forEach(i => {
      updateIntegration(i.id, { lastSyncAt: new Date().toISOString() });
    });
    
    addSyncLog({
      type: 'availability',
      platform: 'website', // using 'website' as generic for global sync log
      status: 'success',
      message: 'Global sync completed across all active channels',
    });
  };

  const handleOpenSettings = (integration: Integration) => {
    setSelectedIntegration(integration);
    setSettingsDialogOpen(true);
  };

  const getStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'active':
        return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'paused':
        return <PauseIcon sx={{ color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <ErrorIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const renderIntegrationCard = (integration: Integration) => {
    const isActive = integration.status === 'active';
    const isSyncing = syncing === integration.id;
    
    return (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={integration.id}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            sx={{
              height: '100%',
              borderTop: 4,
              borderColor: platformColors[integration.platform],
              opacity: isActive ? 1 : 0.7,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: `${platformColors[integration.platform]}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: platformColors[integration.platform],
                    }}
                  >
                    {platformIcons[integration.platform]}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {platformNames[integration.platform]}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getStatusIcon(integration.status)}
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {integration.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Switch
                  checked={isActive}
                  onChange={() => handleToggleStatus(integration)}
                  disabled={!hasPermission('integrations', 'edit')}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Last synced
                </Typography>
                <Typography variant="body2">
                  {integration.lastSyncAt ? formatDateTime(integration.lastSyncAt) : 'Never'}
                </Typography>
              </Box>

              {integration.errorMessage && (
                <Alert severity="error" sx={{ mb: 2, py: 0 }}>
                  <Typography variant="caption">{integration.errorMessage}</Typography>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={isSyncing ? <RefreshIcon className="spin" /> : <SyncIcon />}
                  onClick={() => handleSync(integration)}
                  disabled={!isActive || isSyncing}
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
                {hasPermission('integrations', 'edit') && (
                  <IconButton size="small" onClick={() => handleOpenSettings(integration)}>
                    <SettingsIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Integrations"
        subtitle="Connect with external booking platforms and services"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Integrations' },
        ]}
      >
        <SyncButton 
          onSync={handleSyncAll} 
          label="Sync All Sources" 
          successMessage="All active booking sources have been synced"
        />
      </PageHeader>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Integrations"
            value={activeIntegrations}
            subtitle={`of ${integrations.length} total`}
            icon={<CloudSyncIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="External Bookings"
            value={externalBookings.length}
            subtitle={`${pendingBookings} pending sync`}
            icon={<BookingIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Successful Syncs"
            value={successfulSyncs}
            subtitle="Last 24 hours"
            icon={<CheckIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Failed Syncs"
            value={failedSyncs}
            icon={<ErrorIcon />}
            color={failedSyncs > 0 ? 'error' : 'success'}
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Connected Platforms" />
        <Tab label={`External Bookings (${externalBookings.length})`} />
        <Tab label="Sync Logs" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {integrations.map(renderIntegrationCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>External ID</TableCell>
                <TableCell>Guest Name</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Synced</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {externalBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          backgroundColor: `${platformColors[booking.source]}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: platformColors[booking.source],
                          '& svg': { fontSize: 16 },
                        }}
                      >
                        {platformIcons[booking.source]}
                      </Box>
                      {platformNames[booking.source]}
                    </Box>
                  </TableCell>
                  <TableCell>{booking.externalId}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{formatDate(booking.checkIn)}</TableCell>
                  <TableCell>{formatDate(booking.checkOut)}</TableCell>
                  <TableCell><StatusBadge status={booking.syncStatus} /></TableCell>
                  <TableCell>
                    {booking.syncedAt ? formatDateTime(booking.syncedAt) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {externalBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No external bookings</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <List>
              {syncLogs.slice(0, 20).map((log, index) => (
                <React.Fragment key={log.id}>
                  <ListItem>
                    <ListItemIcon>
                      {log.status === 'success' ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <ErrorIcon sx={{ color: 'error.main' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{log.message}</Typography>
                          <Chip 
                            size="small" 
                            label={platformNames[log.platform]} 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              backgroundColor: `${platformColors[log.platform]}15`,
                              color: platformColors[log.platform],
                            }} 
                          />
                        </Box>
                      }
                      secondary={formatDateTime(log.createdAt)}
                    />
                  </ListItem>
                  {index < syncLogs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {syncLogs.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No sync logs"
                    secondary="Sync activities will appear here"
                    sx={{ textAlign: 'center' }}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedIntegration && (
              <>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: `${platformColors[selectedIntegration.platform]}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: platformColors[selectedIntegration.platform],
                  }}
                >
                  {platformIcons[selectedIntegration.platform]}
                </Box>
                <Typography variant="h6">
                  {platformNames[selectedIntegration.platform]} Settings
                </Typography>
              </>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedIntegration && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Alert severity="info">
                This is a demo. In production, you would configure API keys and webhooks here.
              </Alert>
              
              <TextField
                label="API Key"
                type="password"
                value="••••••••••••••••"
                fullWidth
                disabled
              />
              
              <TextField
                label="Property ID / Listing ID"
                value={selectedIntegration.settings?.propertyId || selectedIntegration.settings?.listingId || 'Not configured'}
                fullWidth
                disabled
              />
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Sync Settings</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Auto-sync bookings</Typography>
                    <Switch defaultChecked disabled />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Sync availability</Typography>
                    <Switch defaultChecked disabled />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Sync prices</Typography>
                    <Switch disabled />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
          <Button variant="contained" disabled>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </Container>
  );
};

export default IntegrationsPage;

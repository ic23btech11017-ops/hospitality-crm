import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    eventReminders: true,
    paymentNotifications: true,
    systemUpdates: false,
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your application preferences and configurations
          </Typography>
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSaveSuccess(false)}>
            Settings saved successfully!
          </Alert>
        )}

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
              <Tab icon={<PaletteIcon />} label="Appearance" iconPosition="start" />
              <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
              <Tab icon={<LanguageIcon />} label="Regional" iconPosition="start" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose what notifications you want to receive
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings({ ...settings, emailNotifications: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Email Notifications
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive email updates about your account activity
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.bookingAlerts}
                      onChange={(e) =>
                        setSettings({ ...settings, bookingAlerts: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Booking Alerts
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Get notified about new bookings and cancellations
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.eventReminders}
                      onChange={(e) =>
                        setSettings({ ...settings, eventReminders: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Event Reminders
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive reminders for upcoming events
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.paymentNotifications}
                      onChange={(e) =>
                        setSettings({ ...settings, paymentNotifications: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Payment Notifications
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Get alerts about payments and invoices
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.systemUpdates}
                      onChange={(e) =>
                        setSettings({ ...settings, systemUpdates: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        System Updates
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Stay informed about system maintenance and updates
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Appearance Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Customize how the application looks
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <FormControlLabel
                control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Dark Mode
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use dark theme across the application
                    </Typography>
                  </Box>
                }
              />
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage your account security and privacy
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(e) =>
                        setSettings({ ...settings, twoFactorAuth: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                  }
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Session Timeout (minutes)</InputLabel>
                    <Select
                      value={settings.sessionTimeout}
                      label="Session Timeout (minutes)"
                      onChange={(e) =>
                        setSettings({ ...settings, sessionTimeout: e.target.value })
                      }
                    >
                      <MenuItem value="15">15 minutes</MenuItem>
                      <MenuItem value="30">30 minutes</MenuItem>
                      <MenuItem value="60">1 hour</MenuItem>
                      <MenuItem value="120">2 hours</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Password Expiry (days)</InputLabel>
                    <Select
                      value={settings.passwordExpiry}
                      label="Password Expiry (days)"
                      onChange={(e) =>
                        setSettings({ ...settings, passwordExpiry: e.target.value })
                      }
                    >
                      <MenuItem value="30">30 days</MenuItem>
                      <MenuItem value="60">60 days</MenuItem>
                      <MenuItem value="90">90 days</MenuItem>
                      <MenuItem value="never">Never</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Button variant="outlined" color="warning">
                    Change Password
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* Regional Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Regional Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set your language, timezone, and format preferences
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                    <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                    <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                    <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                    <MenuItem value="Europe/London">London (GMT)</MenuItem>
                    <MenuItem value="Asia/Tokyo">Tokyo (JST)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.dateFormat}
                    label="Date Format"
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.currency}
                    label="Currency"
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="JPY">JPY (¥)</MenuItem>
                    <MenuItem value="INR">INR (₹)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </TabPanel>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                size="large"
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default SettingsPage;

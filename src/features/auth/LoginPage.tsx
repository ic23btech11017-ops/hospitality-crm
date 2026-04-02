import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Hotel as HotelIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@hotel.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, 'admin');
    if (success) {
      navigate('/dashboard');
    }
  };

  const features = [
    { icon: <HotelIcon />, title: 'Room & Booking Management', color: '#00BCD4' },
    { icon: <EventIcon />, title: 'Event Planning & Scheduling', color: '#3B82F6' },
    { icon: <RestaurantIcon />, title: 'Food & Catering Services', color: '#10B981' },
    { icon: <PeopleIcon />, title: 'Guest CRM & Analytics', color: '#8B5CF6' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Dark Section */}
      <Box
        sx={{
          width: '50%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: 'white',
          p: 4,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                background: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 700,
              }}
            >
              K
            </Box>
            <Typography variant="body1" fontWeight={700} sx={{ letterSpacing: '0.5px', fontSize: '0.95rem' }}>
              KALNET
            </Typography>
          </Box>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              fontWeight={700}
              sx={{
                mb: 1.5,
                fontSize: '1.75rem',
                lineHeight: 1.2,
              }}
            >
              The Digital Operating System for Modern Hotels
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 400,
                lineHeight: 1.5,
                fontSize: '0.85rem',
              }}
            >
              Manage rooms, events, catering, and guest relations — all from one powerful dashboard.
            </Typography>
          </motion.div>

          {/* Feature Cards - Horizontal layout like reference */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 4 }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.08)',
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      background: `${feature.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: feature.color,
                      '& svg': { fontSize: 16 },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.3 }}>
                    {feature.title}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography fontWeight={700} sx={{ fontSize: '1.25rem' }}>
                10+
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                Modules
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={700} sx={{ fontSize: '1.25rem' }}>
                5+
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                Integrations
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={700} sx={{ fontSize: '1.25rem' }}>
                99.9%
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                Uptime
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: 'background.default',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: '1.5rem' }}>
              Welcome back
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Enter your credentials to access your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 0.75, color: 'text.primary', fontSize: '0.8rem', fontWeight: 500 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotel.com"
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 1.25,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 0.75, color: 'text.primary', fontSize: '0.8rem', fontWeight: 500 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 18 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 1.25,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Remember me
                  </Typography>
                }
                sx={{ '& .MuiFormControlLabel-label': { ml: -0.5 } }}
              />
              <Link
                href="#"
                sx={{
                  color: '#0ea5e9',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<LoginIcon sx={{ fontSize: 18 }} />}
              sx={{
                py: 1.25,
                borderRadius: 1.5,
                background: '#0ea5e9',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.4)',
                '&:hover': {
                  background: '#0284c7',
                  boxShadow: '0 6px 20px 0 rgba(14, 165, 233, 0.5)',
                },
              }}
            >
              Sign in
            </Button>
          </form>

          <Typography
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 4, fontSize: '0.7rem' }}
          >
            © 2026 KALNET. All rights reserved.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginPage;

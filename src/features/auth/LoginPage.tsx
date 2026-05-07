import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Chip,
  InputAdornment, IconButton,
} from '@mui/material';
import {
  Visibility, VisibilityOff,
  Email as EmailIcon, Lock as LockIcon,
  Login as LoginIcon,
  CorporateFare as OwnerIcon,
  MeetingRoom as BranchIcon,
  Person as StaffIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface RoleOption {
  value: UserRole;
  label: string;
  subtitle: string;
  detail: string;
  color: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  {
    value: 'owner',
    label: 'Owner',
    subtitle: 'Chain-wide access',
    detail: 'All 6 branches · Revenue Intelligence · AI Insights',
    color: '#f59e0b',
    icon: <OwnerIcon />,
  },
  {
    value: 'branch_manager',
    label: 'Branch Manager',
    subtitle: 'Meridian Grand Bangalore',
    detail: 'Branch dashboard · Operations · Branch Reports',
    color: '#0ea5e9',
    icon: <BranchIcon />,
  },
  {
    value: 'staff',
    label: 'Staff',
    subtitle: 'Grand Meridian Mumbai',
    detail: 'Rooms · Bookings · Guests · Events · Billing',
    color: '#10b981',
    icon: <StaffIcon />,
  },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@meridianhotels.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password, selectedRole);
    setLoading(false);
    if (success) {
      // Owner → enterprise hub; branch_manager & staff → property dashboard
      navigate(selectedRole === 'owner' ? '/super-dashboard' : '/dashboard');
    }
  };

  const highlights = [
    { label: '6', sub: 'Hotel Branches' },
    { label: '1,045', sub: 'Total Rooms' },
    { label: '₹18.5Cr', sub: 'Monthly Revenue' },
    { label: '4.5★', sub: 'Chain Rating' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* ── Left Panel ──────────────────────────────────────────── */}
      <Box sx={{
        width: '50%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2a47 100%)',
        color: 'white', p: 5,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <Box sx={{ position: 'absolute', top: '8%', right: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '5%', left: '-8%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box sx={{ maxWidth: 480, mx: 'auto', position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'linear-gradient(135deg, #f59e0b, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>M</Box>
            <Box>
              <Typography fontWeight={800} sx={{ fontSize: '1rem', letterSpacing: 1 }}>MERIDIAN HOTELS</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', letterSpacing: 2 }}>ENTERPRISE MANAGEMENT PLATFORM</Typography>
            </Box>
          </Box>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip label="v2.0 — Multi-Branch Edition" size="small" sx={{ mb: 2, bgcolor: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.7rem' }} />
            <Typography fontWeight={800} sx={{ mb: 1.5, fontSize: '1.9rem', lineHeight: 1.2 }}>
              One Platform.<br />Every Branch.
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255,255,255,0.58)', lineHeight: 1.7, fontSize: '0.875rem' }}>
              A unified management system for hotel owners, branch managers, and front-line staff — each with the right level of access.
            </Typography>
          </motion.div>

          {/* Role preview cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
            {roleOptions.map((r, i) => (
              <motion.div key={r.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: `${r.color}20`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, '& svg': { fontSize: 18 } }}>{r.icon}</Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: r.color }}>{r.label}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{r.detail}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Stats strip */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            {highlights.map(h => (
              <Box key={h.sub}>
                <Typography fontWeight={800} sx={{ fontSize: '1.1rem', color: '#f59e0b' }}>{h.label}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.65rem' }}>{h.sub}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Right Panel — Login Form ─────────────────────────────── */}
      <Box sx={{ width: { xs: '100%', lg: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: 'background.default' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight={800} sx={{ mb: 0.5, fontSize: '1.6rem' }}>Welcome back</Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.83rem' }}>Choose your role to sign in</Typography>
          </Box>

          {/* ── Role Selector ── */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1.25, fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', letterSpacing: 0.8 }}>SIGN IN AS</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {roleOptions.map(r => (
                <Box key={r.value} onClick={() => setSelectedRole(r.value)} sx={{
                  p: 1.75, borderRadius: 2.5, cursor: 'pointer',
                  border: '2px solid',
                  borderColor: selectedRole === r.value ? r.color : 'divider',
                  background: selectedRole === r.value ? `${r.color}08` : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 2,
                  transition: 'all 0.18s ease',
                  '&:hover': { borderColor: r.color, background: `${r.color}06` },
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: selectedRole === r.value ? `${r.color}20` : 'action.hover', color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s', '& svg': { fontSize: 20 } }}>{r.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: selectedRole === r.value ? r.color : 'text.primary' }}>{r.label}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{r.subtitle}</Typography>
                  </Box>
                  {selectedRole === r.value && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Credentials ── */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 0.75, fontSize: '0.78rem', fontWeight: 600 }}>Email</Typography>
              <TextField fullWidth type="email" value={email} onChange={e => setEmail(e.target.value)} size="small" required
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 17, color: 'text.secondary' }} /></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.875rem' } }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 0.75, fontSize: '0.78rem', fontWeight: 600 }}>Password</Typography>
              <TextField fullWidth type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} size="small" required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ fontSize: 17, color: 'text.secondary' }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(v => !v)} size="small">{showPassword ? <VisibilityOff sx={{ fontSize: 17 }} /> : <Visibility sx={{ fontSize: 17 }} />}</IconButton></InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.875rem' } }} />
            </Box>
            <Button type="submit" fullWidth variant="contained" disabled={loading} endIcon={<LoginIcon />}
              sx={{
                py: 1.35, borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.9rem',
                background: selectedRole === 'owner'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : selectedRole === 'branch_manager'
                    ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: selectedRole === 'owner' ? '0 4px 14px rgba(245,158,11,0.4)' : selectedRole === 'branch_manager' ? '0 4px 14px rgba(14,165,233,0.4)' : '0 4px 14px rgba(16,185,129,0.4)',
                '&:hover': { filter: 'brightness(1.08)' },
              }}>
              {loading ? 'Signing in…' : `Sign in as ${roleOptions.find(r => r.value === selectedRole)?.label}`}
            </Button>
          </form>

          <Typography color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4, fontSize: '0.68rem' }}>
            © 2026 Meridian Hotels Enterprise Platform • Demo Mode
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginPage;

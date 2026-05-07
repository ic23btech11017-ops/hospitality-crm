import React, { useState } from 'react';
import { Box, Grid, Typography, Chip, Avatar, TextField, InputAdornment, Select, MenuItem, FormControl } from '@mui/material';
import { Search, Business, Phone, PersonAdd } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { staffMembers, properties } from '../../data/propertiesData';

const deptColor: Record<string, string> = {
  management: '#8b5cf6', front_desk: '#0ea5e9', housekeeping: '#10b981',
  restaurant: '#f59e0b', events: '#ec4899', maintenance: '#ef4444',
  security: '#6366f1', spa: '#14b8a6',
};
const statusColor: Record<string, string> = { active: '#10b981', on_leave: '#f59e0b', off_duty: '#94a3b8' };
const deptLabel: Record<string, string> = {
  management: 'Management', front_desk: 'Front Desk', housekeeping: 'Housekeeping',
  restaurant: 'Restaurant', events: 'Events', maintenance: 'Maintenance',
  security: 'Security', spa: 'Spa & Wellness',
};

const StaffPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [propFilter, setPropFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = staffMembers.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase())) &&
    (propFilter === 'all' || s.propertyId === propFilter) &&
    (deptFilter === 'all' || s.department === deptFilter)
  );

  const departments = ['all', ...Array.from(new Set(staffMembers.map(s => s.department)))];

  const stats = [
    { label: 'Total Staff', value: staffMembers.length, color: '#0ea5e9' },
    { label: 'Active', value: staffMembers.filter(s => s.status === 'active').length, color: '#10b981' },
    { label: 'On Leave', value: staffMembers.filter(s => s.status === 'on_leave').length, color: '#f59e0b' },
    { label: 'Properties', value: properties.length, color: '#8b5cf6' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>Staff Management</Typography>
          <Typography color="text.secondary">Directory across all properties</Typography>
        </Box>
        <Chip icon={<PersonAdd sx={{ fontSize: '16px !important' }} />} label="Add Staff" clickable
          sx={{ height: 38, fontWeight: 700, bgcolor: 'primary.main', color: 'white', px: 1, borderRadius: 2, '& .MuiChip-icon': { color: 'white' } }} />
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'center' }}>
              <Typography fontWeight={800} variant="h5" sx={{ color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }}
          sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={propFilter} onChange={e => setPropFilter(e.target.value)} sx={{ borderRadius: 2 }}>
            <MenuItem value="all">All Properties</MenuItem>
            {properties.map(p => <MenuItem key={p.id} value={p.id}>{p.city}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} sx={{ borderRadius: 2 }}>
            <MenuItem value="all">All Departments</MenuItem>
            {departments.filter(d => d !== 'all').map(d => <MenuItem key={d} value={d}>{deptLabel[d]}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Staff Grid */}
      <Grid container spacing={2.5}>
        {filtered.map((s, i) => {
          const prop = properties.find(p => p.id === s.propertyId);
          return (
            <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', '&:hover': { boxShadow: '0 8px 28px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' }, transition: 'all 0.25s' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 44, height: 44, bgcolor: `${deptColor[s.department]}25`, color: deptColor[s.department], fontWeight: 800, fontSize: '1rem' }}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700} variant="body2">{s.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.role}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor[s.status], mt: 0.5 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={deptLabel[s.department]} size="small" sx={{ height: 20, fontSize: '0.63rem', bgcolor: `${deptColor[s.department]}15`, color: deptColor[s.department], fontWeight: 600 }} />
                    <Chip label={s.shift + ' shift'} size="small" sx={{ height: 20, fontSize: '0.63rem', bgcolor: 'action.hover' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                    <Business sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" noWrap>{prop?.city || '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{s.phone}</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StaffPage;

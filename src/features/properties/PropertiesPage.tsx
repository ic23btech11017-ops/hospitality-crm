import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Chip, Button } from '@mui/material';
import { LocationOn, Star, TrendingUp, TrendingDown, ArrowForward, Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { properties, propertyPerformances } from '../../data/propertiesData';

const statusColor: Record<string, string> = { active: '#10b981', maintenance: '#f59e0b', closed: '#ef4444', archived: '#94a3b8' };
const typeLabel: Record<string, string> = { luxury: 'Luxury', business: 'Business', boutique: 'Boutique', resort: 'Resort', budget: 'Budget' };
const fmt = (v: number) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(1)}L`;

const OccupancyRing: React.FC<{ value: number; size?: number }> = ({ value, size = 56 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value > 80 ? '#10b981' : value > 60 ? '#f59e0b' : '#0ea5e9';
  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6} strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <Typography sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color }}>{value}%</Typography>
    </Box>
  );
};

const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const regions = ['all', ...Array.from(new Set(properties.map(p => p.region)))];

  const filtered = properties.filter(p =>
    (region === 'all' || p.region === region) &&
    (statusFilter === 'all' || p.status === statusFilter)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>Properties</Typography>
          <Typography color="text.secondary">Manage all {properties.length} hotel properties across {regions.length - 1} regions</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)' }}>
          Add Property
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', fontWeight: 600 }}>Region:</Typography>
          {regions.map(r => (
            <Chip key={r} label={r === 'all' ? 'All Regions' : r} size="small" onClick={() => setRegion(r)}
              sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', bgcolor: region === r ? 'primary.main' : 'action.hover', color: region === r ? 'white' : 'text.secondary' }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', fontWeight: 600 }}>Status:</Typography>
          {['all', 'active', 'maintenance', 'closed'].map(s => (
            <Chip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} size="small" onClick={() => setStatusFilter(s)}
              sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', bgcolor: statusFilter === s ? (s === 'all' ? 'primary.main' : `${statusColor[s]}20`) : 'action.hover', color: statusFilter === s ? (s === 'all' ? 'white' : statusColor[s]) : 'text.secondary' }} />
          ))}
        </Box>
      </Box>

      {/* Property Cards */}
      <Grid container spacing={3}>
        {filtered.map((property, idx) => {
          const perf = propertyPerformances.find(p => p.propertyId === property.id);
          return (
            <Grid key={property.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                <Box sx={{
                  borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
                  overflow: 'hidden', height: '100%',
                  '&:hover': { boxShadow: '0 12px 40px rgba(0,0,0,0.12)', transform: 'translateY(-4px)' },
                  transition: 'all 0.3s ease',
                }}>
                  {/* Header */}
                  <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={property.code} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', height: 20 }} />
                        <Chip label={typeLabel[property.type]} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', height: 20 }} />
                      </Box>
                      <Chip label={property.status.charAt(0).toUpperCase() + property.status.slice(1)} size="small"
                        sx={{ bgcolor: `${statusColor[property.status]}20`, color: statusColor[property.status], fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                    </Box>
                    <Typography fontWeight={800} sx={{ fontSize: '1rem', lineHeight: 1.3, mb: 0.5 }}>{property.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{property.city}, {property.state}</Typography>
                    </Box>
                    {/* Star Rating */}
                    <Box sx={{ display: 'flex', gap: 0.25, mt: 1 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} sx={{ fontSize: 13, color: i < property.starRating ? '#f59e0b' : 'rgba(255,255,255,0.2)' }} />
                      ))}
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ p: 2.5 }}>
                    {perf ? (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <OccupancyRing value={perf.occupancy} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Monthly Revenue</Typography>
                              <Typography fontWeight={800} variant="h6">{fmt(perf.revenue)}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {perf.growth >= 0 ? <TrendingUp sx={{ fontSize: 14, color: '#10b981' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#ef4444' }} />}
                                <Typography variant="caption" fontWeight={700} sx={{ color: perf.growth >= 0 ? '#10b981' : '#ef4444' }}>{Math.abs(perf.growth)}% vs last month</Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, justifyContent: 'flex-end' }}>
                              <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                              <Typography fontWeight={700}>{perf.rating}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">{perf.totalReviews} reviews</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mb: 2 }}>
                          {[['RevPAR', `₹${(perf.revPAR / 1000).toFixed(1)}K`], ['ADR', `₹${(perf.adr / 1000).toFixed(1)}K`], ['Rooms', property.totalRooms.toString()]].map(([l, v]) => (
                            <Box key={l} sx={{ textAlign: 'center', p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                              <Typography variant="caption" color="text.secondary" display="block">{l}</Typography>
                              <Typography fontWeight={700} sx={{ fontSize: '0.875rem' }}>{v}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ py: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary" variant="body2">No performance data</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {property.amenities.slice(0, 4).map(a => (
                        <Chip key={a} label={a} size="small" sx={{ height: 20, fontSize: '0.63rem', bgcolor: 'action.hover' }} />
                      ))}
                      {property.amenities.length > 4 && <Chip label={`+${property.amenities.length - 4}`} size="small" sx={{ height: 20, fontSize: '0.63rem', bgcolor: 'primary.light', color: 'white' }} />}
                    </Box>

                    <Button fullWidth variant="outlined" size="small" endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                      onClick={() => navigate('/dashboard')}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                      View Property Dashboard
                    </Button>
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

export default PropertiesPage;

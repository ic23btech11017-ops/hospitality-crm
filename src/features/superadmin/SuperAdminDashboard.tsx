import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Chip, LinearProgress, Divider, IconButton, Tooltip } from '@mui/material';
import {
  TrendingUp, TrendingDown, Hotel, People, Star, Warning,
  ArrowForward, Notifications, Speed, AttachMoney, Percent,
  Business, Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import {
  chainStats, propertyPerformances, monthlyRevenueData, alerts, aiInsights, reputationReviews,
} from '../../data/propertiesData';

const fmt = (v: number) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString('en-IN')}`;
const fmtNum = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString();

const severityColor: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' };
const sentimentColor: Record<string, string> = { positive: '#10b981', neutral: '#f59e0b', negative: '#ef4444' };

const KPICard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; trend?: number }> = ({ title, value, subtitle, icon, color, trend }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Box sx={{
      p: 2.5, borderRadius: 3, background: 'background.paper', border: '1px solid', borderColor: 'divider',
      height: '100%', position: 'relative', overflow: 'hidden',
      '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' },
      transition: 'all 0.3s ease',
    }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 80px', background: `${color}12` }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </Box>
        {trend !== undefined && (
          <Chip size="small" icon={trend >= 0 ? <TrendingUp sx={{ fontSize: '14px !important' }} /> : <TrendingDown sx={{ fontSize: '14px !important' }} />}
            label={`${trend >= 0 ? '+' : ''}${trend}%`}
            sx={{ bgcolor: trend >= 0 ? '#10b98120' : '#ef444420', color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '0.7rem', height: 24 }} />
        )}
      </Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.25 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>{subtitle}</Typography>
    </Box>
  </motion.div>
);

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [alertFilter, setAlertFilter] = useState<string>('all');

  useEffect(() => {
    const t = setInterval(() => setCurrentInsight(i => (i + 1) % aiInsights.length), 5000);
    return () => clearInterval(t);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const filteredAlerts = alertFilter === 'all' ? alerts : alerts.filter(a => a.severity === alertFilter);

  const bookingSources = [
    { name: 'Direct', value: 28, color: '#0ea5e9' },
    { name: 'Booking.com', value: 24, color: '#003580' },
    { name: 'Agoda', value: 16, color: '#e00000' },
    { name: 'Expedia', value: 12, color: '#ffcc00' },
    { name: 'MakeMyTrip', value: 11, color: '#c00' },
    { name: 'Walk-in', value: 9, color: '#10b981' },
  ];

  const revenueChartData = monthlyRevenueData.map(d => ({
    month: d.month,
    Mumbai: Math.round(d.p1 / 100000),
    Delhi: Math.round(d.p4 / 100000),
    Goa: Math.round(d.p3 / 100000),
    Bangalore: Math.round(d.p2 / 100000),
    Chennai: Math.round(d.p5 / 100000),
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Chip label="ENTERPRISE VIEW" size="small" sx={{ bgcolor: '#f59e0b20', color: '#f59e0b', fontWeight: 700, fontSize: '0.65rem', letterSpacing: 1 }} />
            <Chip label="Live" size="small" icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', animation: 'pulse 1.5s infinite' }} />}
              sx={{ bgcolor: '#10b98115', color: '#10b981', fontSize: '0.65rem', fontWeight: 600 }} />
          </Box>
          <Typography variant="h4" fontWeight={800}>Corporate Intelligence Hub</Typography>
          <Typography color="text.secondary" variant="body2">Welcome, {user?.name} • Meridian Hotels Group • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}><Refresh /></IconButton>
          </Tooltip>
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={() => navigate('/alerts')} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}><Notifications /></IconButton>
            {unreadAlerts.length > 0 && (
              <Box sx={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', bgcolor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.55rem', color: 'white', fontWeight: 800 }}>{unreadAlerts.length}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Chain KPIs */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { title: 'Chain Revenue', value: fmt(chainStats.chainRevenue), subtitle: 'This month across all properties', icon: <AttachMoney />, color: '#0ea5e9', trend: chainStats.netGrowth },
          { title: 'Chain Occupancy', value: `${chainStats.chainOccupancy}%`, subtitle: `${chainStats.totalRooms} total rooms`, icon: <Hotel />, color: '#8b5cf6', trend: 4.2 },
          { title: 'RevPAR', value: `₹${chainStats.chainRevPAR.toLocaleString('en-IN')}`, subtitle: 'Revenue per available room', icon: <Speed />, color: '#f59e0b', trend: 8.1 },
          { title: 'ADR', value: `₹${chainStats.chainADR.toLocaleString('en-IN')}`, subtitle: 'Avg daily rate per room', icon: <Percent />, color: '#10b981', trend: 6.3 },
          { title: 'Guest NPS', value: `${chainStats.chainNPS}`, subtitle: 'Net promoter score', icon: <Star />, color: '#ec4899', trend: 3.5 },
          { title: 'Active Properties', value: `${chainStats.activeProperties}/${chainStats.totalProperties}`, subtitle: '1 under maintenance', icon: <Business />, color: '#6366f1' },
          { title: 'Total Bookings', value: fmtNum(chainStats.totalBookings), subtitle: 'This month chain-wide', icon: <People />, color: '#14b8a6', trend: 11.2 },
          { title: 'Cancellation Rate', value: `${chainStats.cancellationRate}%`, subtitle: 'Target: <10%', icon: <Warning />, color: '#ef4444', trend: -1.3 },
        ].map((kpi, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* AI Insights */}
      <Box sx={{ mb: 4, p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', animation: 'pulse 1.5s infinite' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>AI Insights Engine</Typography>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {aiInsights.map((_, i) => (
              <Box key={i} onClick={() => setCurrentInsight(i)} sx={{ width: i === currentInsight ? 20 : 6, height: 6, borderRadius: 3, bgcolor: i === currentInsight ? '#0ea5e9' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </Box>
        </Box>
        <AnimatePresence mode="wait">
          <motion.div key={currentInsight} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Typography sx={{ fontSize: '1.8rem' }}>{aiInsights[currentInsight].icon}</Typography>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
                  <Typography fontWeight={700} sx={{ fontSize: '1rem' }}>{aiInsights[currentInsight].title}</Typography>
                  <Chip label={aiInsights[currentInsight].tag} size="small" sx={{ bgcolor: '#0ea5e920', color: '#0ea5e9', fontSize: '0.65rem', height: 20 }} />
                  <Chip label={`${aiInsights[currentInsight].confidence}% confidence`} size="small" sx={{ bgcolor: '#10b98120', color: '#10b981', fontSize: '0.65rem', height: 20 }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.6 }}>{aiInsights[currentInsight].insight}</Typography>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Revenue + Leaderboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography fontWeight={700} variant="h6">Revenue Intelligence</Typography>
                <Typography variant="caption" color="text.secondary">Monthly revenue by property (₹ Lakhs)</Typography>
              </Box>
              <IconButton size="small" onClick={() => navigate('/revenue')} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}><ArrowForward fontSize="small" /></IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChartData}>
                <defs>
                  {[['Mumbai', '#0ea5e9'], ['Delhi', '#8b5cf6'], ['Goa', '#10b981'], ['Bangalore', '#f59e0b'], ['Chennai', '#ec4899']].map(([name, color]) => (
                    <linearGradient key={name} id={`grad${name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}L`} />
                <RechartTooltip formatter={(v: number, n: string) => [`₹${v}L`, n]} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                <Legend />
                {[['Mumbai', '#0ea5e9'], ['Delhi', '#8b5cf6'], ['Goa', '#10b981'], ['Bangalore', '#f59e0b'], ['Chennai', '#ec4899']].map(([name, color]) => (
                  <Area key={name} type="monotone" dataKey={name} stroke={color} fill={`url(#grad${name})`} strokeWidth={2} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Property Leaderboard */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography fontWeight={700} variant="h6">Property Leaderboard</Typography>
                <Typography variant="caption" color="text.secondary">Ranked by revenue</Typography>
              </Box>
              <IconButton size="small" onClick={() => navigate('/properties')} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}><ArrowForward fontSize="small" /></IconButton>
            </Box>
            {propertyPerformances.map((p, i) => (
              <Box key={p.propertyId} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: 1.5, flexShrink: 0,
                    bgcolor: i === 0 ? '#f59e0b20' : i === 1 ? '#94a3b820' : i === 2 ? '#cd7c2820' : 'action.hover',
                    color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c28' : 'text.secondary',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem',
                  }}>#{i + 1}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{p.propertyName.replace('The ', '').split(' ').slice(0, 2).join(' ')}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">{p.city}</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: p.growth >= 0 ? '#10b981' : '#ef4444' }}>
                        {p.growth >= 0 ? '↑' : '↓'}{Math.abs(p.growth)}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={700}>{fmt(p.revenue)}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, justifyContent: 'flex-end' }}>
                      <Star sx={{ fontSize: 11, color: '#f59e0b' }} />
                      <Typography variant="caption">{p.rating}</Typography>
                    </Box>
                  </Box>
                </Box>
                <LinearProgress variant="determinate" value={p.occupancy}
                  sx={{ height: 5, borderRadius: 5, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: p.status === 'maintenance' ? '#ef4444' : p.occupancy > 80 ? '#10b981' : p.occupancy > 60 ? '#f59e0b' : '#0ea5e9', borderRadius: 5 } }} />
                <Typography variant="caption" color="text.secondary">{p.occupancy}% occupancy</Typography>
                {i < propertyPerformances.length - 1 && <Divider sx={{ mt: 1.5 }} />}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Booking Sources + Reputation + Alerts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Booking Sources */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>Booking Sources</Typography>
            <Typography variant="caption" color="text.secondary">Chain-wide distribution</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bookingSources} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {bookingSources.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <RechartTooltip formatter={(v: number) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            {bookingSources.map((s) => (
              <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                  <Typography variant="caption">{s.name}</Typography>
                </Box>
                <Typography variant="caption" fontWeight={700}>{s.value}%</Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Reputation Monitor */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography fontWeight={700} variant="h6">Reputation Monitor</Typography>
                <Typography variant="caption" color="text.secondary">Recent reviews</Typography>
              </Box>
              <IconButton size="small" onClick={() => navigate('/reputation')} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}><ArrowForward fontSize="small" /></IconButton>
            </Box>
            {reputationReviews.slice(0, 4).map((r) => (
              <Box key={r.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { mb: 0, pb: 0, borderBottom: 'none' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.25 }}>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>{r.guestName}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} sx={{ fontSize: 10, color: i < r.rating ? '#f59e0b' : 'divider' }} />
                    ))}
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>{r.propertyId === 'p1' ? 'Mumbai' : r.propertyId === 'p2' ? 'Bangalore' : r.propertyId === 'p3' ? 'Goa' : r.propertyId === 'p4' ? 'Delhi' : r.propertyId === 'p5' ? 'Chennai' : 'Shimla'} • {r.platform}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.comment}</Typography>
                <Chip size="small" label={r.sentiment} sx={{ mt: 0.5, height: 18, fontSize: '0.6rem', bgcolor: `${sentimentColor[r.sentiment]}15`, color: sentimentColor[r.sentiment] }} />
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Alerts Center */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography fontWeight={700} variant="h6">Critical Alerts</Typography>
                <Typography variant="caption" color="text.secondary">{unreadAlerts.length} unread alerts</Typography>
              </Box>
              <IconButton size="small" onClick={() => navigate('/alerts')} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}><ArrowForward fontSize="small" /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.75, mb: 2, flexWrap: 'wrap' }}>
              {['all', 'critical', 'high', 'medium'].map((f) => (
                <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} size="small" onClick={() => setAlertFilter(f)}
                  sx={{ height: 22, fontSize: '0.65rem', cursor: 'pointer', bgcolor: alertFilter === f ? (f === 'all' ? 'primary.main' : `${severityColor[f]}20`) : 'action.hover', color: alertFilter === f ? (f === 'all' ? 'white' : severityColor[f]) : 'text.secondary', fontWeight: 600 }} />
              ))}
            </Box>
            {filteredAlerts.slice(0, 5).map((a) => (
              <Box key={a.id} sx={{ display: 'flex', gap: 1.5, mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: `${severityColor[a.severity]}08`, borderLeft: '3px solid', borderLeftColor: severityColor[a.severity] }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: severityColor[a.severity], mt: 0.5, flexShrink: 0, ...(a.severity === 'critical' ? { animation: 'pulse 1.5s infinite' } : {}) }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{a.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.message}</Typography>
                  {a.propertyName && <Typography variant="caption" sx={{ color: severityColor[a.severity], fontWeight: 600 }}>📍 {a.propertyName}</Typography>}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;

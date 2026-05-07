import React from 'react';
import { Box, Grid, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, Hotel, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { propertyPerformances, reputationReviews } from '../../data/propertiesData';

const BranchReportsPage: React.FC = () => {
  const { user, currentPropertyId } = useAuth();
  
  // Get data for this specific branch only
  const performance = propertyPerformances.find(p => p.propertyId === currentPropertyId);
  const reviews = reputationReviews.filter(r => r.propertyId === currentPropertyId).slice(0, 5);

  if (!performance) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="text.secondary">No reporting data available for this branch yet.</Typography>
      </Box>
    );
  }

  const fmt = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString('en-IN')}`;

  const revenueBreakdown = [
    { name: 'Rooms', value: performance.revenue * 0.65, color: '#0ea5e9' },
    { name: 'Food & Bev', value: performance.revenue * 0.25, color: '#8b5cf6' },
    { name: 'Events', value: performance.revenue * 0.10, color: '#10b981' },
  ];

  const occupancyTrend = [
    { day: 'Mon', Occupancy: 72 },
    { day: 'Tue', Occupancy: 68 },
    { day: 'Wed', Occupancy: 75 },
    { day: 'Thu', Occupancy: 82 },
    { day: 'Fri', Occupancy: 94 },
    { day: 'Sat', Occupancy: 98 },
    { day: 'Sun', Occupancy: 85 },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>Branch Reports</Typography>
        <Typography color="text.secondary">Performance analytics for {user?.branchName || 'your branch'}</Typography>
      </Box>

      {/* KPI Strip */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Monthly Revenue', value: fmt(performance.revenue), sub: 'vs last month', icon: <AttachMoney />, color: '#0ea5e9', trend: performance.growth },
          { label: 'Avg Occupancy', value: `${performance.occupancy}%`, sub: 'Current month', icon: <Hotel />, color: '#8b5cf6', trend: 4.2 },
          { label: 'Guest Satisfaction', value: `${performance.rating}★`, sub: `${performance.totalReviews} total reviews`, icon: <Star />, color: '#f59e0b', trend: 0.1 },
          { label: 'RevPAR', value: `₹${(performance.revPAR / 1000).toFixed(1)}K`, sub: 'Revenue per available room', icon: <TrendingUp />, color: '#10b981', trend: 2.5 },
        ].map((k) => (
          <Grid key={k.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '0 0 0 60px', bgcolor: `${k.color}12` }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${k.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
                    {k.icon}
                  </Box>
                  <Chip size="small" icon={k.trend >= 0 ? <TrendingUp sx={{ fontSize: '12px !important' }} /> : <TrendingDown sx={{ fontSize: '12px !important' }} />}
                    label={`${k.trend >= 0 ? '+' : ''}${k.trend}%`}
                    sx={{ height: 20, fontSize: '0.65rem', bgcolor: k.trend >= 0 ? '#10b98120' : '#ef444420', color: k.trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }} />
                </Box>
                <Typography variant="h5" fontWeight={800}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{k.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{k.sub}</Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Occupancy Trend */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>Occupancy Trend</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>Last 7 days</Typography>
            
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={occupancyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} 
                  formatter={(v: number) => [`${v}%`, 'Occupancy']}
                />
                <Bar dataKey="Occupancy" radius={[4, 4, 0, 0]}>
                  {occupancyTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Occupancy > 85 ? '#10b981' : entry.Occupancy > 70 ? '#0ea5e9' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Revenue Breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>Revenue Breakdown</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>By department</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ width: '100%', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {revenueBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [fmt(v), 'Revenue']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box sx={{ width: '100%', mt: 2 }}>
                {revenueBreakdown.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700}>{fmt(item.value)}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Recent Branch Reviews */}
      <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography fontWeight={700} variant="h6" sx={{ mb: 2 }}>Recent Guest Feedback</Typography>
        
        {reviews.length > 0 ? (
          <Grid container spacing={2}>
            {reviews.map((r) => (
              <Grid key={r.id} size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={700}>{r.guestName}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} sx={{ fontSize: 14, color: idx < r.rating ? '#f59e0b' : 'divider' }} />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{r.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.comment}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                    <Chip size="small" label={r.platform} sx={{ height: 20, fontSize: '0.65rem' }} />
                    <Chip size="small" label={r.sentiment} sx={{ height: 20, fontSize: '0.65rem', bgcolor: r.sentiment === 'positive' ? '#10b98115' : r.sentiment === 'negative' ? '#ef444415' : '#f59e0b15', color: r.sentiment === 'positive' ? '#10b981' : r.sentiment === 'negative' ? '#ef4444' : '#f59e0b' }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary" variant="body2">No recent reviews found for this branch.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default BranchReportsPage;

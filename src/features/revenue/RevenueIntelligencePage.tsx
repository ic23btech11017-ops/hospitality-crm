import React, { useState } from 'react';
import { Box, Grid, Typography, Chip, Divider, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, Speed, Percent, Hotel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend,
} from 'recharts';
import { propertyPerformances, monthlyRevenueData } from '../../data/propertiesData';

const fmt = (v: number) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString('en-IN')}`;

const forecasts = [
  { month: 'May', actual: 18580000, forecast: null },
  { month: 'Jun', actual: null, forecast: 20200000 },
  { month: 'Jul', actual: null, forecast: 22100000 },
  { month: 'Aug', actual: null, forecast: 21400000 },
  { month: 'Sep', actual: null, forecast: 23800000 },
  { month: 'Oct', actual: null, forecast: 25200000 },
];

const revParData = propertyPerformances.map(p => ({
  name: p.city,
  RevPAR: p.revPAR,
  ADR: p.adr,
  Occupancy: p.occupancy,
}));

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

const RevenueIntelligencePage: React.FC = () => {
  const [_period] = useState('6m');

  const totalRevenue = propertyPerformances.reduce((s, p) => s + p.revenue, 0);
  const avgOccupancy = Math.round(propertyPerformances.reduce((s, p) => s + p.occupancy, 0) / propertyPerformances.length);
  const avgRevPAR = Math.round(propertyPerformances.reduce((s, p) => s + p.revPAR, 0) / propertyPerformances.length);
  const avgADR = Math.round(propertyPerformances.reduce((s, p) => s + p.adr, 0) / propertyPerformances.length);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>Revenue Intelligence</Typography>
        <Typography color="text.secondary">Deep analytics and forecasting across all properties</Typography>
      </Box>

      {/* KPI Strip */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Chain Revenue', value: fmt(totalRevenue), sub: 'This month', icon: <AttachMoney />, color: '#0ea5e9', trend: 14.2 },
          { label: 'Chain RevPAR', value: `₹${avgRevPAR.toLocaleString('en-IN')}`, sub: 'Avg across properties', icon: <Speed />, color: '#8b5cf6', trend: 8.1 },
          { label: 'Chain ADR', value: `₹${avgADR.toLocaleString('en-IN')}`, sub: 'Avg daily rate', icon: <Percent />, color: '#10b981', trend: 6.3 },
          { label: 'Avg Occupancy', value: `${avgOccupancy}%`, sub: 'Chain-wide', icon: <Hotel />, color: '#f59e0b', trend: 4.7 },
        ].map((k) => (
          <Grid key={k.label} size={{ xs: 6, md: 3 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'relative', overflow: 'hidden', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }, transition: 'all 0.2s' }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, borderRadius: '0 0 0 70px', bgcolor: `${k.color}12` }} />
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${k.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color, mb: 1.5 }}>{k.icon}</Box>
                <Typography variant="h5" fontWeight={800}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{k.label}</Typography>
                <Chip size="small" icon={k.trend >= 0 ? <TrendingUp sx={{ fontSize: '12px !important' }} /> : <TrendingDown sx={{ fontSize: '12px !important' }} />}
                  label={`${k.trend >= 0 ? '+' : ''}${k.trend}%`}
                  sx={{ mt: 0.5, height: 20, fontSize: '0.65rem', bgcolor: k.trend >= 0 ? '#10b98120' : '#ef444420', color: k.trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }} />
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Revenue by Property (Bar) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>Revenue by Property</Typography>
            <Typography variant="caption" color="text.secondary">This month</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revParData} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v / 1000}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="RevPAR" radius={[4, 4, 0, 0]}>
                  {revParData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* ADR vs Occupancy */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>ADR vs Occupancy</Typography>
            <Typography variant="caption" color="text.secondary">By property</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revParData} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v / 1000}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="ADR" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="ADR (₹)" />
                <Bar yAxisId="right" dataKey="Occupancy" fill="#10b981" radius={[4, 4, 0, 0]} name="Occupancy (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>

      {/* Monthly Trend + Forecast */}
      <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography fontWeight={700} variant="h6">Revenue Trend & AI Forecast</Typography>
            <Typography variant="caption" color="text.secondary">Historical + 6-month AI-powered forecast</Typography>
          </Box>
          <Chip label="AI Forecast" size="small" sx={{ bgcolor: '#8b5cf620', color: '#8b5cf6', fontWeight: 700, fontSize: '0.7rem' }} />
        </Box>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={[
            ...monthlyRevenueData.map(d => ({ month: d.month, actual: d.p1 + d.p2 + d.p3 + d.p4 + d.p5 + d.p6, forecast: null })),
            ...forecasts.slice(1).map(f => ({ month: f.month, actual: null, forecast: f.forecast })),
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 10000000).toFixed(1)}Cr`} />
            <Tooltip formatter={(v: number) => v ? [fmt(v), ''] : ['—', '']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 5 }} connectNulls={false} name="Actual Revenue" />
            <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#8b5cf6', r: 4 }} connectNulls={false} name="AI Forecast" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Property Performance Table */}
      <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography fontWeight={700} variant="h6" sx={{ mb: 2 }}>Property Performance Matrix</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 640 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: 1.5, mb: 1.5, px: 1 }}>
              {['Property', 'Revenue', 'Occupancy', 'RevPAR', 'ADR', 'Growth'].map(h => (
                <Typography key={h} variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</Typography>
              ))}
            </Box>
            <Divider />
            {propertyPerformances.map((p) => (
              <Box key={p.propertyId}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: 1.5, py: 1.75, px: 1, alignItems: 'center', '&:hover': { bgcolor: 'action.hover' } }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{p.city}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.type} • {p.totalRooms} rooms</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>{fmt(p.revenue)}</Typography>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{p.occupancy}%</Typography>
                    <LinearProgress variant="determinate" value={p.occupancy} sx={{ height: 4, borderRadius: 2, bgcolor: 'action.hover', mt: 0.5, '& .MuiLinearProgress-bar': { bgcolor: p.occupancy > 80 ? '#10b981' : p.occupancy > 60 ? '#f59e0b' : '#0ea5e9' } }} />
                  </Box>
                  <Typography variant="body2">₹{(p.revPAR / 1000).toFixed(1)}K</Typography>
                  <Typography variant="body2">₹{(p.adr / 1000).toFixed(1)}K</Typography>
                  <Chip size="small" icon={p.growth >= 0 ? <TrendingUp sx={{ fontSize: '12px !important' }} /> : <TrendingDown sx={{ fontSize: '12px !important' }} />}
                    label={`${p.growth >= 0 ? '+' : ''}${p.growth}%`}
                    sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: p.growth >= 0 ? '#10b98120' : '#ef444420', color: p.growth >= 0 ? '#10b981' : '#ef4444' }} />
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RevenueIntelligencePage;

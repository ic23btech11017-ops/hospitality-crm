import React, { useState } from 'react';
import { Box, Grid, Typography, Chip, Divider, LinearProgress, FormControl, Select, MenuItem } from '@mui/material';
import { Star, TrendingUp, TrendingDown, ThumbUp, ThumbDown, Remove } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { reputationReviews, propertyPerformances, properties } from '../../data/propertiesData';

const platformColor: Record<string, string> = { google: '#4285f4', tripadvisor: '#00af87', booking_com: '#003580', expedia: '#ffcc00', agoda: '#e00000' };
const sentimentColor: Record<string, string> = { positive: '#10b981', neutral: '#f59e0b', negative: '#ef4444' };
const platformLabel: Record<string, string> = { google: 'Google', tripadvisor: 'TripAdvisor', booking_com: 'Booking.com', expedia: 'Expedia', agoda: 'Agoda' };

const ReputationPage: React.FC = () => {
  const [propFilter, setPropFilter] = useState('all');
  const [platformFilter] = useState('all');

  const filtered = reputationReviews.filter(r =>
    (propFilter === 'all' || r.propertyId === propFilter) &&
    (platformFilter === 'all' || r.platform === platformFilter)
  );

  const sentimentSummary = {
    positive: filtered.filter(r => r.sentiment === 'positive').length,
    neutral: filtered.filter(r => r.sentiment === 'neutral').length,
    negative: filtered.filter(r => r.sentiment === 'negative').length,
  };

  const ratingsByProperty = propertyPerformances.map(p => ({
    name: p.city, rating: p.rating, reviews: p.totalReviews,
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.5 ? 'neutral' : 'down',
  }));

  const radarData = [
    { subject: 'Cleanliness', A: 87, B: 72 },
    { subject: 'Service', A: 92, B: 78 },
    { subject: 'Food', A: 84, B: 81 },
    { subject: 'Location', A: 89, B: 85 },
    { subject: 'Value', A: 76, B: 74 },
    { subject: 'Amenities', A: 88, B: 79 },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>Reputation Monitor</Typography>
        <Typography color="text.secondary">Sentiment analysis and review tracking across all properties and platforms</Typography>
      </Box>

      {/* Summary KPIs */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Avg Chain Rating', value: '4.5', icon: <Star sx={{ color: '#f59e0b' }} />, sub: 'Across all platforms', color: '#f59e0b' },
          { label: 'Total Reviews', value: '5,291', icon: <Star sx={{ color: '#0ea5e9' }} />, sub: 'All properties', color: '#0ea5e9' },
          { label: 'Positive Sentiment', value: '82%', icon: <ThumbUp sx={{ color: '#10b981' }} />, sub: 'This month', color: '#10b981' },
          { label: 'Need Attention', value: '3', icon: <ThumbDown sx={{ color: '#ef4444' }} />, sub: 'Negative trend properties', color: '#ef4444' },
        ].map((k) => (
          <Grid key={k.label} size={{ xs: 6, md: 3 }}>
            <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>{k.icon}</Box>
              <Typography fontWeight={800} variant="h5">{k.value}</Typography>
              <Typography variant="caption" color="text.secondary" display="block">{k.label}</Typography>
              <Typography variant="caption" color="text.secondary">{k.sub}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Ratings by Property */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 2 }}>Rating by Property</Typography>
            {ratingsByProperty.map((p, i) => (
              <Box key={p.name} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                    <Chip size="small" label={p.reviews.toLocaleString() + ' reviews'} sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'action.hover' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={800}>{p.rating}</Typography>
                    {p.trend === 'up' ? <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} /> : p.trend === 'down' ? <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} /> : <Remove sx={{ fontSize: 16, color: '#94a3b8' }} />}
                  </Box>
                </Box>
                <LinearProgress variant="determinate" value={(p.rating / 5) * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: p.rating >= 4.5 ? '#10b981' : p.rating >= 4 ? '#f59e0b' : '#ef4444', borderRadius: 4 } }} />
                {i < ratingsByProperty.length - 1 && <Divider sx={{ mt: 1.75 }} />}
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Radar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>Category Satisfaction</Typography>
            <Typography variant="caption" color="text.secondary">Top 2 properties vs chain average</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Grand Meridian" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                <Radar name="Palmera Goa" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>

      {/* Filters + Review List */}
      <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography fontWeight={700} variant="h6">Guest Reviews</Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['positive', 'neutral', 'negative'].map(s => (
                <Chip key={s} size="small" label={`${s.charAt(0).toUpperCase() + s.slice(1)}: ${sentimentSummary[s as keyof typeof sentimentSummary]}`}
                  sx={{ fontSize: '0.7rem', bgcolor: `${sentimentColor[s]}15`, color: sentimentColor[s], fontWeight: 600 }} />
              ))}
            </Box>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select value={propFilter} onChange={e => setPropFilter(e.target.value)} sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
                <MenuItem value="all">All Properties</MenuItem>
                {properties.map(p => <MenuItem key={p.id} value={p.id}>{p.city}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {filtered.map((r, i) => (
            <Grid key={r.id} size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', borderLeft: '3px solid', borderLeftColor: sentimentColor[r.sentiment] }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" fontWeight={700}>{r.guestName}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip size="small" label={platformLabel[r.platform]} sx={{ height: 18, fontSize: '0.6rem', bgcolor: `${platformColor[r.platform]}15`, color: platformColor[r.platform], fontWeight: 700 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <Star sx={{ fontSize: 12, color: '#f59e0b' }} />
                        <Typography variant="caption" fontWeight={700}>{r.rating}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{r.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.comment}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, mt: 1, flexWrap: 'wrap' }}>
                    {r.categories.map(c => <Chip key={c} label={c} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'action.hover' }} />)}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ReputationPage;

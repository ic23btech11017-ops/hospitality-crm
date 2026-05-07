import React, { useState } from 'react';
import { Box, Grid, Typography, Chip, Button } from '@mui/material';
import { CheckCircle, Business, Schedule, MarkEmailRead } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { alerts as allAlerts } from '../../data/propertiesData';
import type { Alert } from '../../types';

const severityColor: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' };
const severityBg: Record<string, string> = { critical: '#ef444412', high: '#f59e0b12', medium: '#3b82f612', low: '#10b98112' };
const categoryIcon: Record<string, string> = { revenue: '💰', rating: '⭐', cancellation: '❌', vip: '👑', payment: '💳', staff: '👥', maintenance: '🔧', system: '⚙️' };

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(allAlerts);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  const filtered = alerts.filter(a =>
    (severityFilter === 'all' || a.severity === severityFilter) &&
    (showResolved ? true : !a.resolvedAt)
  );

  const markRead = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  const resolve = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolvedAt: new Date().toISOString(), isRead: true } : a));

  const unread = alerts.filter(a => !a.isRead).length;
  const counts = { critical: alerts.filter(a => a.severity === 'critical').length, high: alerts.filter(a => a.severity === 'high').length, medium: alerts.filter(a => a.severity === 'medium').length, low: alerts.filter(a => a.severity === 'low').length };

  const timeAgo = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" fontWeight={800}>Alerts Center</Typography>
            {unread > 0 && <Chip label={`${unread} unread`} size="small" sx={{ bgcolor: '#ef444420', color: '#ef4444', fontWeight: 700 }} />}
          </Box>
          <Typography color="text.secondary">Monitor and manage operational alerts across all properties</Typography>
        </Box>
        <Button variant="outlined" startIcon={<MarkEmailRead />} size="small" onClick={() => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))} sx={{ borderRadius: 2, textTransform: 'none' }}>
          Mark All Read
        </Button>
      </Box>

      {/* Severity Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Critical', count: counts.critical, color: '#ef4444' },
          { label: 'High', count: counts.high, color: '#f59e0b' },
          { label: 'Medium', count: counts.medium, color: '#3b82f6' },
          { label: 'Low', count: counts.low, color: '#10b981' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            <Box onClick={() => setSeverityFilter(severityFilter === s.label.toLowerCase() ? 'all' : s.label.toLowerCase())}
              sx={{ p: 2, borderRadius: 2.5, border: '2px solid', borderColor: severityFilter === s.label.toLowerCase() ? s.color : 'divider', bgcolor: severityFilter === s.label.toLowerCase() ? `${s.color}10` : 'background.paper', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', '&:hover': { borderColor: s.color } }}>
              <Typography fontWeight={800} variant="h5" sx={{ color: s.color }}>{s.count}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip label={showResolved ? 'Hide Resolved' : 'Show Resolved'} size="small" onClick={() => setShowResolved(!showResolved)} clickable
          sx={{ fontWeight: 600, bgcolor: showResolved ? 'primary.main' : 'action.hover', color: showResolved ? 'white' : 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">{filtered.length} alerts shown</Typography>
      </Box>

      {/* Alert List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AnimatePresence>
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
              <Box sx={{
                p: 2.5, borderRadius: 3, border: '1px solid', bgcolor: a.resolvedAt ? 'action.hover' : severityBg[a.severity],
                borderColor: a.resolvedAt ? 'divider' : severityColor[a.severity],
                borderLeft: '4px solid', borderLeftColor: a.resolvedAt ? '#94a3b8' : severityColor[a.severity],
                opacity: a.resolvedAt ? 0.7 : 1,
                '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }, transition: 'all 0.2s',
              }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <Box sx={{ fontSize: '1.4rem', mt: 0.25, flexShrink: 0 }}>{categoryIcon[a.category] || '🔔'}</Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body1" fontWeight={700}>{a.title}</Typography>
                        {!a.isRead && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#0ea5e9', flexShrink: 0 }} />}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {a.resolvedAt ? (
                          <Chip size="small" icon={<CheckCircle sx={{ fontSize: '12px !important', color: '#10b981 !important' }} />} label="Resolved" sx={{ height: 22, fontSize: '0.65rem', bgcolor: '#10b98115', color: '#10b981', fontWeight: 700 }} />
                        ) : (
                          <Chip size="small" label={a.severity.toUpperCase()} sx={{ height: 22, fontSize: '0.65rem', fontWeight: 800, bgcolor: severityBg[a.severity], color: severityColor[a.severity], ...(a.severity === 'critical' ? { animation: 'pulse 2s infinite' } : {}) }} />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>{a.message}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {a.propertyName && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Business sx={{ fontSize: 13, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>{a.propertyName}</Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{timeAgo(a.createdAt)}</Typography>
                      </Box>
                      <Chip size="small" label={a.category} sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'action.hover' }} />
                    </Box>
                  </Box>

                  {/* Actions */}
                  {!a.resolvedAt && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, flexShrink: 0 }}>
                      {!a.isRead && (
                        <Button size="small" variant="outlined" onClick={() => markRead(a.id)} sx={{ fontSize: '0.7rem', textTransform: 'none', borderRadius: 1.5, py: 0.5 }}>Mark Read</Button>
                      )}
                      <Button size="small" variant="contained" onClick={() => resolve(a.id)} sx={{ fontSize: '0.7rem', textTransform: 'none', borderRadius: 1.5, py: 0.5, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>Resolve</Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>All clear!</Typography>
            <Typography color="text.secondary">No alerts matching your current filters.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AlertsPage;

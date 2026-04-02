import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { addDays, format, startOfWeek, parseISO, differenceInDays } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { formatCurrency, formatTime, getEventTypeLabel } from '../../utils/helpers';

const HALL_WIDTH = 160;
const DAY_WIDTH = 160;
const ROW_HEIGHT = 120;

const eventTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  wedding: { bg: '#ec4899', border: '#db2777', text: '#ffffff' },
  conference: { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' },
  party: { bg: '#f97316', border: '#ea580c', text: '#ffffff' },
  meeting: { bg: '#14b8a6', border: '#0d9488', text: '#ffffff' },
  seminar: { bg: '#8b5cf6', border: '#7c3aed', text: '#ffffff' },
  other: { bg: '#6b7280', border: '#4b5563', text: '#ffffff' },
};

const statusIcons: Record<string, string> = {
  inquiry: '❓',
  confirmed: '✅',
  in_progress: '▶️',
  completed: '✔️',
  cancelled: '❌',
};

const EventSchedule: React.FC = () => {
  const theme = useTheme();
  const { events, eventHalls } = useData();
  const [weekOffset, setWeekOffset] = useState(0);

  const isDark = theme.palette.mode === 'dark';

  const today = useMemo(() => new Date(), []);
  const weekStart = useMemo(
    () => addDays(startOfWeek(today, { weekStartsOn: 1 }), weekOffset * 7),
    [today, weekOffset]
  );
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Map events to halls and days
  const hallEventMap = useMemo(() => {
    const map = new Map<string, Map<string, typeof events>>();

    for (const hall of eventHalls) {
      const dayMap = new Map<string, typeof events>();
      for (const day of days) {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter(
          e => e.hallId === hall.id && e.date === dateStr && e.status !== 'cancelled'
        );
        dayMap.set(dateStr, dayEvents);
      }
      map.set(hall.id, dayMap);
    }
    return map;
  }, [events, eventHalls, days]);

  const todayStr = format(today, 'yyyy-MM-dd');

  const handlePrevWeek = () => setWeekOffset(prev => prev - 1);
  const handleNextWeek = () => setWeekOffset(prev => prev + 1);
  const handleThisWeek = () => setWeekOffset(0);

  return (
    <Box>
      {/* Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handlePrevWeek}>
            <ChevronLeftIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TodayIcon />}
            onClick={handleThisWeek}
            sx={{ textTransform: 'none' }}
          >
            This Week
          </Button>
          <IconButton size="small" onClick={handleNextWeek}>
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {format(weekStart, 'MMM d')} — {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {Object.entries(eventTypeColors).map(([type, colors]) => (
            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: colors.bg }} />
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {type}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Schedule Grid */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', minWidth: HALL_WIDTH + DAY_WIDTH * 7 }}>
          {/* Hall Labels Column */}
          <Box
            sx={{
              width: HALL_WIDTH,
              minWidth: HALL_WIDTH,
              position: 'sticky',
              left: 0,
              zIndex: 10,
              bgcolor: 'background.paper',
              borderRight: '2px solid',
              borderColor: 'divider',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: isDark ? 'grey.900' : 'grey.50',
              }}
            >
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                VENUES
              </Typography>
            </Box>
            {/* Hall rows */}
            {eventHalls.map((hall, idx) => (
              <Box
                key={hall.id}
                sx={{
                  height: ROW_HEIGHT,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: 1.5,
                  borderBottom: idx === eventHalls.length - 1 ? 'none' : '1px solid',
                  borderColor: 'divider',
                  bgcolor: idx % 2 === 0
                    ? 'background.paper'
                    : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  {hall.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  Cap: {hall.capacity} • {formatCurrency(hall.pricePerDay)}/day
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Day Columns */}
          <Box sx={{ flex: 1 }}>
            {/* Day Headers */}
            <Box sx={{ display: 'flex', height: 56 }}>
              {days.map((day, i) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isToday = dateStr === todayStr;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <Box
                    key={i}
                    sx={{
                      width: DAY_WIDTH,
                      minWidth: DAY_WIDTH,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      bgcolor: isToday
                        ? (isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)')
                        : isWeekend
                          ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')
                          : (isDark ? 'grey.900' : 'grey.50'),
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.65rem',
                        color: isToday ? 'primary.main' : 'text.secondary',
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {format(day, 'EEEE')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'primary.main' : 'text.primary',
                        fontSize: '0.85rem',
                      }}
                    >
                      {format(day, 'd MMM')}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Hall Rows with Events */}
            {eventHalls.map((hall, hallIdx) => (
              <Box key={hall.id} sx={{ display: 'flex', height: ROW_HEIGHT }}>
                {days.map((day, dayIdx) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isToday = dateStr === todayStr;
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const dayEvents = hallEventMap.get(hall.id)?.get(dateStr) || [];

                  return (
                    <Box
                      key={dayIdx}
                      sx={{
                        width: DAY_WIDTH,
                        minWidth: DAY_WIDTH,
                        position: 'relative',
                        borderBottom: hallIdx === eventHalls.length - 1 ? 'none' : '1px solid',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        bgcolor: isToday
                          ? (isDark ? 'rgba(37,99,235,0.04)' : 'rgba(37,99,235,0.02)')
                          : isWeekend
                            ? (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.008)')
                            : hallIdx % 2 === 0
                              ? 'transparent'
                              : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.008)'),
                        p: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      {dayEvents.length === 0 && (
                        <Box
                          sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                              fontSize: '0.65rem',
                              userSelect: 'none',
                            }}
                          >
                            Available
                          </Typography>
                        </Box>
                      )}
                      {dayEvents.map((event) => {
                        const colors = eventTypeColors[event.type] || eventTypeColors.other;
                        return (
                          <Tooltip
                            key={event.id}
                            arrow
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography variant="body2" fontWeight={600}>
                                  {event.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                  <TimeIcon sx={{ fontSize: 14 }} />
                                  <Typography variant="caption">
                                    {formatTime(event.startTime)} – {formatTime(event.endTime)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PeopleIcon sx={{ fontSize: 14 }} />
                                  <Typography variant="caption">
                                    {event.guestCount} guests
                                  </Typography>
                                </Box>
                                <Typography variant="caption" display="block">
                                  Contact: {event.contactName}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {formatCurrency(event.totalAmount)} • {statusIcons[event.status]} {event.status.replace('_', ' ')}
                                </Typography>
                              </Box>
                            }
                          >
                            <Box
                              sx={{
                                bgcolor: colors.bg,
                                border: `1.5px solid ${colors.border}`,
                                borderRadius: '6px',
                                px: 1,
                                py: 0.5,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                flex: 1,
                                minHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                boxShadow: `0 1px 3px ${colors.border}40`,
                                '&:hover': {
                                  transform: 'scale(1.03)',
                                  boxShadow: `0 3px 8px ${colors.border}60`,
                                  zIndex: 5,
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: colors.text,
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  lineHeight: 1.2,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {event.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: `${colors.text}cc`,
                                  fontSize: '0.6rem',
                                  lineHeight: 1.2,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {formatTime(event.startTime)} – {formatTime(event.endTime)}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: `${colors.text}bb`,
                                  fontSize: '0.55rem',
                                  lineHeight: 1.2,
                                }}
                              >
                                {event.guestCount} guests • {getEventTypeLabel(event.type)}
                              </Typography>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Weekly Summary */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
        {(() => {
          const weekEvents = events.filter(e => {
            const eventDate = parseISO(e.date);
            return differenceInDays(eventDate, weekStart) >= 0 &&
              differenceInDays(eventDate, weekStart) < 7 &&
              e.status !== 'cancelled';
          });
          const totalRevenue = weekEvents.reduce((sum, e) => sum + e.totalAmount, 0);
          const totalGuests = weekEvents.reduce((sum, e) => sum + e.guestCount, 0);
          const busyHalls = new Set(weekEvents.map(e => e.hallId)).size;

          return [
            { label: 'Events This Week', value: String(weekEvents.length), color: '#3b82f6' },
            { label: 'Total Guests', value: String(totalGuests), color: '#10b981' },
            { label: 'Halls Booked', value: `${busyHalls} / ${eventHalls.length}`, color: '#f59e0b' },
            { label: 'Week Revenue', value: formatCurrency(totalRevenue), color: '#8b5cf6' },
          ].map(item => (
            <Paper
              key={item.label}
              variant="outlined"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
              <Typography variant="body2" fontWeight={600}>
                {item.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          ));
        })()}
      </Box>
    </Box>
  );
};

export default EventSchedule;

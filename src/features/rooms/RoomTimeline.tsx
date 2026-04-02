import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { addDays, format, differenceInDays, parseISO, startOfDay } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { formatCurrency, getRoomTypeLabel } from '../../utils/helpers';

const TOTAL_DAYS = 14;
const DAY_WIDTH = 90;
const ROW_HEIGHT = 52;
const LABEL_WIDTH = 160;

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  checked_in: { bg: '#2563eb', border: '#1d4ed8', text: '#ffffff' },
  confirmed: { bg: '#10b981', border: '#059669', text: '#ffffff' },
  pending: { bg: '#f59e0b', border: '#d97706', text: '#ffffff' },
  checked_out: { bg: '#94a3b8', border: '#64748b', text: '#ffffff' },
  cancelled: { bg: '#ef4444', border: '#dc2626', text: '#ffffff' },
};

const roomStatusDot: Record<string, string> = {
  available: '#10b981',
  occupied: '#2563eb',
  maintenance: '#ef4444',
  cleaning: '#f59e0b',
};

const sourceLabels: Record<string, string> = {
  direct: 'Direct',
  website: 'Website',
  airbnb: 'Airbnb',
  booking_com: 'Booking.com',
  expedia: 'Expedia',
  oyo: 'OYO',
};

const RoomTimeline: React.FC = () => {
  const theme = useTheme();
  const { rooms, bookings, guests } = useData();
  const [startOffset, setStartOffset] = useState(-2); // days from today

  const isDark = theme.palette.mode === 'dark';

  const today = useMemo(() => startOfDay(new Date()), []);

  const timelineStart = useMemo(() => addDays(today, startOffset), [today, startOffset]);
  const days = useMemo(
    () => Array.from({ length: TOTAL_DAYS }, (_, i) => addDays(timelineStart, i)),
    [timelineStart]
  );

  // Sort rooms by floor+number
  const sortedRooms = useMemo(
    () => [...rooms].sort((a, b) => a.floor - b.floor || a.roomNumber.localeCompare(b.roomNumber)),
    [rooms]
  );

  // Pre-compute bookings per room for the visible range
  const roomBookingMap = useMemo(() => {
    const rangeStart = timelineStart;
    const rangeEnd = addDays(timelineStart, TOTAL_DAYS);

    const map = new Map<string, Array<{
      booking: typeof bookings[0];
      guest: typeof guests[0] | undefined;
      startCol: number;
      spanCols: number;
    }>>();

    for (const room of sortedRooms) {
      const roomBookings = bookings
        .filter(b => b.roomId === room.id && b.status !== 'cancelled')
        .filter(b => {
          const bStart = parseISO(b.checkIn);
          const bEnd = parseISO(b.checkOut);
          return bStart < rangeEnd && bEnd > rangeStart;
        })
        .map(b => {
          const bStart = parseISO(b.checkIn);
          const bEnd = parseISO(b.checkOut);
          const clippedStart = bStart < rangeStart ? rangeStart : bStart;
          const clippedEnd = bEnd > rangeEnd ? rangeEnd : bEnd;
          const startCol = Math.max(0, differenceInDays(clippedStart, rangeStart));
          const spanCols = Math.max(1, differenceInDays(clippedEnd, clippedStart));
          const guest = guests.find(g => g.id === b.guestId);
          return { booking: b, guest, startCol, spanCols };
        });

      map.set(room.id, roomBookings);
    }
    return map;
  }, [sortedRooms, bookings, guests, timelineStart]);

  const todayIndex = differenceInDays(today, timelineStart);

  const handlePrev = () => setStartOffset(prev => prev - 7);
  const handleNext = () => setStartOffset(prev => prev + 7);
  const handleToday = () => setStartOffset(-2);

  return (
    <Box>
      {/* Navigation Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={handleToday}>
            <TodayIcon />
          </IconButton>
          <IconButton size="small" onClick={handleNext}>
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {format(timelineStart, 'MMM d')} — {format(addDays(timelineStart, TOTAL_DAYS - 1), 'MMM d, yyyy')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Object.entries(statusColors).filter(([k]) => k !== 'cancelled').map(([key, val]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: val.bg }} />
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Timeline Grid */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', minWidth: LABEL_WIDTH + DAY_WIDTH * TOTAL_DAYS }}>
          {/* Sticky Room Labels Column */}
          <Box
            sx={{
              width: LABEL_WIDTH,
              minWidth: LABEL_WIDTH,
              position: 'sticky',
              left: 0,
              zIndex: 10,
              bgcolor: 'background.paper',
              borderRight: '2px solid',
              borderColor: 'divider',
            }}
          >
            {/* Header cell */}
            <Box
              sx={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: isDark ? 'grey.900' : 'grey.50',
              }}
            >
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                ROOMS
              </Typography>
            </Box>
            {/* Room rows */}
            {sortedRooms.map((room, idx) => (
              <Box
                key={room.id}
                sx={{
                  height: ROW_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.5,
                  borderBottom: '1px solid',
                  borderColor: idx === sortedRooms.length - 1 ? 'transparent' : 'divider',
                  bgcolor: idx % 2 === 0
                    ? 'background.paper'
                    : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                }}
              >
                <CircleIcon sx={{ fontSize: 10, color: roomStatusDot[room.status] || '#94a3b8', mr: 1 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {room.roomNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.65rem' }}>
                    {getRoomTypeLabel(room.type)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Day Columns */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            {/* Header row */}
            <Box sx={{ display: 'flex', height: 48 }}>
              {days.map((day, i) => {
                const isToday = i === todayIndex;
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
                      {format(day, 'EEE')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'primary.main' : 'text.primary',
                        fontSize: '0.8rem',
                      }}
                    >
                      {format(day, 'd MMM')}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Room Data Rows */}
            {sortedRooms.map((room, rowIdx) => {
              const roomBookings = roomBookingMap.get(room.id) || [];
              return (
                <Box
                  key={room.id}
                  sx={{
                    display: 'flex',
                    height: ROW_HEIGHT,
                    position: 'relative',
                  }}
                >
                  {/* Background grid cells */}
                  {days.map((day, i) => {
                    const isToday = i === todayIndex;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    return (
                      <Box
                        key={i}
                        sx={{
                          width: DAY_WIDTH,
                          minWidth: DAY_WIDTH,
                          borderBottom: '1px solid',
                          borderRight: '1px solid',
                          borderColor: rowIdx === sortedRooms.length - 1 && i < TOTAL_DAYS - 1
                            ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
                            : 'divider',
                          bgcolor: isToday
                            ? (isDark ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.03)')
                            : isWeekend
                              ? (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)')
                              : rowIdx % 2 === 0
                                ? 'transparent'
                                : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)'),
                        }}
                      />
                    );
                  })}

                  {/* Booking Bars (absolute positioned) */}
                  {roomBookings.map(({ booking, guest, startCol, spanCols }) => {
                    const colors = statusColors[booking.status] || statusColors.confirmed;
                    const nights = differenceInDays(parseISO(booking.checkOut), parseISO(booking.checkIn));
                    return (
                      <Tooltip
                        key={booking.id}
                        arrow
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {guest?.name || 'Unknown Guest'}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {format(parseISO(booking.checkIn), 'MMM d')} → {format(parseISO(booking.checkOut), 'MMM d')} ({nights} {nights === 1 ? 'night' : 'nights'})
                            </Typography>
                            <Typography variant="caption" display="block">
                              {formatCurrency(booking.totalAmount)} • {sourceLabels[booking.source] || booking.source}
                            </Typography>
                            <Chip
                              label={booking.status.replace('_', ' ')}
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 18,
                                fontSize: '0.65rem',
                                textTransform: 'capitalize',
                                bgcolor: colors.bg,
                                color: colors.text,
                              }}
                            />
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: startCol * DAY_WIDTH + 4,
                            width: spanCols * DAY_WIDTH - 8,
                            top: 8,
                            height: ROW_HEIGHT - 16,
                            bgcolor: colors.bg,
                            borderRadius: '6px',
                            border: `1.5px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            px: 1,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            boxShadow: `0 1px 3px ${colors.border}40`,
                            '&:hover': {
                              transform: 'scaleY(1.1)',
                              boxShadow: `0 3px 8px ${colors.border}60`,
                              zIndex: 5,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {guest?.name || 'Guest'} • {nights}n
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              );
            })}

            {/* Today Indicator Line */}
            {todayIndex >= 0 && todayIndex < TOTAL_DAYS && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2,
                  width: 2,
                  height: '100%',
                  bgcolor: 'error.main',
                  opacity: 0.5,
                  zIndex: 4,
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* Summary Bar */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'Available', count: rooms.filter(r => r.status === 'available').length, color: '#10b981' },
          { label: 'Occupied', count: rooms.filter(r => r.status === 'occupied').length, color: '#2563eb' },
          { label: 'Cleaning', count: rooms.filter(r => r.status === 'cleaning').length, color: '#f59e0b' },
          { label: 'Maintenance', count: rooms.filter(r => r.status === 'maintenance').length, color: '#ef4444' },
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
            <Typography variant="body2" fontWeight={500}>
              {item.count}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default RoomTimeline;

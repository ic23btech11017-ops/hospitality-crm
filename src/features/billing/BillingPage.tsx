import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/helpers';
import type { Invoice, PaymentMethod } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const BillingPage: React.FC = () => {
  const { 
    invoices, 
    guests, 
    bookings, 
    events,
    rooms,
    addPayment,
    getPaymentsByInvoiceId,
  } = useData();
  const { hasPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: 'cash' as PaymentMethod,
    reference: '',
    notes: '',
  });

  // Stats
  const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const pendingAmount = invoices
    .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const guest = guests.find(g => g.id === invoice.guestId);
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guest?.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, guests, searchQuery, statusFilter]);

  // Categorize invoices
  const pendingInvoices = filteredInvoices.filter(i => i.status === 'sent' || i.status === 'partial');
  const paidInvoicesList = filteredInvoices.filter(i => i.status === 'paid');
  const overdueList = filteredInvoices.filter(i => i.status === 'overdue');

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailDialogOpen(true);
  };

  const handleOpenPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: invoice.totalAmount - invoice.paidAmount,
      method: 'cash',
      reference: '',
      notes: '',
    });
    setPaymentDialogOpen(true);
  };

  const handleSubmitPayment = () => {
    if (selectedInvoice) {
      addPayment({
        invoiceId: selectedInvoice.id,
        amount: paymentForm.amount,
        method: paymentForm.method,
        reference: paymentForm.reference || undefined,
        notes: paymentForm.notes || undefined,
      });
    }
    setPaymentDialogOpen(false);
  };

  const getProgressValue = (invoice: Invoice) => {
    return (invoice.paidAmount / invoice.totalAmount) * 100;
  };

  const renderInvoiceCard = (invoice: Invoice) => {
    const guest = guests.find(g => g.id === invoice.guestId);
    const booking = invoice.bookingId ? bookings.find(b => b.id === invoice.bookingId) : null;
    const event = invoice.eventId ? events.find(e => e.id === invoice.eventId) : null;
    const room = booking ? rooms.find(r => r.id === booking.roomId) : null;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        key={invoice.id}
      >
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {invoice.invoiceNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {guest?.name} • {formatDate(invoice.createdAt)}
                </Typography>
              </Box>
              <StatusBadge status={invoice.status} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {booking && (
                <Chip 
                  size="small" 
                  label={`Room ${room?.roomNumber}`} 
                  icon={<ReceiptIcon />}
                />
              )}
              {event && (
                <Chip 
                  size="small" 
                  label={event.name} 
                  color="secondary"
                />
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Paid: {formatCurrency(invoice.paidAmount)} of {formatCurrency(invoice.totalAmount)}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {Math.round(getProgressValue(invoice))}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getProgressValue(invoice)} 
                sx={{ height: 8, borderRadius: 4 }}
                color={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'primary'}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" fontWeight={600}>
                Balance: {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={() => handleViewInvoice(invoice)}>
                  View Details
                </Button>
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && hasPermission('billing', 'edit') && (
                  <Button 
                    size="small" 
                    variant="contained" 
                    startIcon={<PaymentIcon />}
                    onClick={() => handleOpenPayment(invoice)}
                  >
                    Record Payment
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box>
      <PageHeader
        title="Billing & Invoices"
        subtitle={`${invoices.length} total invoices • ${formatCurrency(pendingAmount)} pending`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Billing' },
        ]}
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<ReceiptIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Amount"
            value={formatCurrency(pendingAmount)}
            icon={<PaymentIcon />}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Paid Invoices"
            value={paidInvoices}
            subtitle={`of ${invoices.length} total`}
            icon={<ReceiptIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Overdue"
            value={overdueInvoices}
            icon={<ReceiptIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search invoices..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label={`All (${filteredInvoices.length})`} />
        <Tab label={`Pending (${pendingInvoices.length})`} />
        <Tab label={`Paid (${paidInvoicesList.length})`} />
        <Tab label={`Overdue (${overdueList.length})`} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {filteredInvoices.length === 0 ? (
          <EmptyState title="No invoices found" description="Invoices will appear here" />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredInvoices.map(renderInvoiceCard)}
          </AnimatePresence>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {pendingInvoices.length === 0 ? (
          <EmptyState title="No pending invoices" description="All invoices are paid!" />
        ) : (
          <AnimatePresence mode="popLayout">
            {pendingInvoices.map(renderInvoiceCard)}
          </AnimatePresence>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {paidInvoicesList.length === 0 ? (
          <EmptyState title="No paid invoices" description="Completed payments will appear here" />
        ) : (
          <AnimatePresence mode="popLayout">
            {paidInvoicesList.map(renderInvoiceCard)}
          </AnimatePresence>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {overdueList.length === 0 ? (
          <EmptyState title="No overdue invoices" description="Great! All payments are on time" />
        ) : (
          <AnimatePresence mode="popLayout">
            {overdueList.map(renderInvoiceCard)}
          </AnimatePresence>
        )}
      </TabPanel>

      {/* Invoice Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedInvoice?.invoiceNumber}</Typography>
            <StatusBadge status={selectedInvoice?.status || ''} />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Guest</Typography>
                  <Typography variant="body1">
                    {guests.find(g => g.id === selectedInvoice.guestId)?.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
                  <Typography variant="body1">{formatDate(selectedInvoice.dueDate)}</Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Items</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Box sx={{ width: 250 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">{formatCurrency(selectedInvoice.subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">{formatCurrency(selectedInvoice.tax)}</Typography>
                  </Box>
                  {selectedInvoice.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Discount</Typography>
                      <Typography variant="body2" color="success.main">-{formatCurrency(selectedInvoice.discount)}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={600}>Total</Typography>
                    <Typography variant="subtitle1" fontWeight={600}>{formatCurrency(selectedInvoice.totalAmount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">Paid</Typography>
                    <Typography variant="body2" color="success.main">{formatCurrency(selectedInvoice.paidAmount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={500}>Balance Due</Typography>
                    <Typography variant="body2" fontWeight={500} color="error.main">
                      {formatCurrency(selectedInvoice.totalAmount - selectedInvoice.paidAmount)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Payment History</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPaymentsByInvoiceId(selectedInvoice.id).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{payment.method.replace('_', ' ')}</TableCell>
                        <TableCell>{payment.reference || '-'}</TableCell>
                        <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                      </TableRow>
                    ))}
                    {getPaymentsByInvoiceId(selectedInvoice.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No payments recorded</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<PrintIcon />}>Print</Button>
          <Button startIcon={<DownloadIcon />}>Download PDF</Button>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Invoice: {selectedInvoice?.invoiceNumber}<br />
              Balance Due: {selectedInvoice && formatCurrency(selectedInvoice.totalAmount - selectedInvoice.paidAmount)}
            </Typography>
            
            <TextField
              label="Amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentForm.method}
                label="Payment Method"
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as PaymentMethod })}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Reference Number"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Transaction ID, Check Number, etc."
            />

            <TextField
              label="Notes"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitPayment}>
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingPage;

import { useState, useEffect } from 'react';
import { FileText, CreditCard, DollarSign, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { Badge } from '../../components/dashboard/Badge';
import { StatCard } from '../../components/dashboard/StatCard';
import { Modal } from '../../components/dashboard/Modal';
import { DataTable } from '../../components/dashboard/DataTable';
import { getOrders, changeOrderPayment, changeOrderStatus } from '../../api/orders';

export const Billing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedOrderToPay, setSelectedOrderToPay] = useState(null);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data?.orders || res.orders || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch billing and invoice records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleProcessPayment = async (orderId, method) => {
    try {
      // 1. Mark order payment as paid
      await changeOrderPayment(orderId, { 
        paymentStatus: 'paid', 
        paymentMethod: method.toLowerCase() 
      });

      // 2. Mark order status as completed (which releases table to available)
      await changeOrderStatus(orderId, 'completed');

      alert('Payment processed successfully and table released!');
      fetchOrders();
      setPayModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to process payment.');
    }
  };

  const unpaidOrders = orders.filter(o => o.paymentStatus !== 'paid');
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

  const filteredBills = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.paymentStatus === activeTab.toLowerCase());
  
  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingCount = unpaidOrders.length;

  const columns = [
    { 
      key: 'orderNumber', 
      label: 'Invoice / Order ID',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.orderNumber}</span>
          <span className="text-[10px] text-gray-400 font-semibold mt-0.5">Created: {new Date(row.createdAt).toLocaleTimeString()}</span>
        </div>
      )
    },
    { 
      key: 'table', 
      label: 'Table',
      render: (row) => (
        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
          T-{row.table?.tableNumber || '?'}
        </span>
      )
    },
    {
      key: 'items', label: 'Summary',
      render: (row) => (
        <span className="text-xs text-gray-500 font-semibold">
          {row.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')}
        </span>
      )
    },
    { 
      key: 'totalAmount', 
      label: 'Grand Total', 
      render: (row) => <span className="font-black text-gray-900 text-sm">₹{row.totalAmount}</span> 
    },
    { 
      key: 'paymentMethod', 
      label: 'Method',
      render: (row) => (
        <span className="text-xs font-bold uppercase text-gray-500">
          {row.paymentMethod || '—'}
        </span>
      )
    },
    { 
      key: 'paymentStatus', 
      label: 'Payment Status', 
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${
          row.paymentStatus === 'paid' 
            ? 'bg-emerald-50 ring-emerald-250 text-emerald-700' 
            : 'bg-rose-50 ring-rose-250 text-rose-700'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {row.paymentStatus?.toUpperCase() || 'PENDING'}
        </span>
      )
    },
    {
      key: 'actions', label: 'Checkout Action',
      render: (row) => (
        row.paymentStatus !== 'paid' ? (
          <button 
            onClick={() => { setSelectedOrderToPay(row); setPayModalOpen(true); }} 
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Mark Paid
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-bold border border-slate-100 bg-slate-50 px-2 py-0.5 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Complete
          </span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <PageHeader 
        title="Billing & Invoices" 
        action={{ label: 'Checkout Order', icon: FileText, onClick: () => setModalOpen(true) }}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
        <StatCard title="Total Collected Revenue" value={`₹${totalRevenue}`} icon={DollarSign} color="emerald" />
        <StatCard title="Pending Unpaid Invoices" value={pendingCount} icon={CreditCard} color="amber" />
        <StatCard title="Total Invoices Generated" value={orders.length} icon={FileText} color="indigo" />
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-1.5 border-b border-gray-100 pb-2">
        {['All', 'Pending', 'Paid'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-50 border border-slate-200 text-gray-500 hover:bg-slate-100 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBills} 
        loading={loading}
      />

      {/* Checkout Selection Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Select Order for Checkout" size="sm">
        <div className="space-y-4">
          <p className="text-xs text-gray-400 font-semibold">Select an active, unpaid dining table order to process payment and release the table.</p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
            {unpaidOrders.map(o => (
              <div 
                key={o._id} 
                className="flex items-center justify-between p-3 bg-white border border-slate-250/50 rounded-xl hover:border-indigo-400 cursor-pointer transition-all hover:shadow-sm"
                onClick={() => {
                  setSelectedOrderToPay(o);
                  setModalOpen(false);
                  setPayModalOpen(true);
                }}
              >
                <div>
                  <span className="font-extrabold text-gray-900 text-sm">{o.orderNumber}</span>
                  <span className="block text-[11px] font-bold text-gray-500 mt-0.5">Table T-{o.table?.tableNumber || '?'}</span>
                </div>
                <span className="font-black text-indigo-700 text-sm">₹{o.totalAmount}</span>
              </div>
            ))}
            {unpaidOrders.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No unpaid orders in the system.</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-150 hover:bg-gray-200 rounded-xl cursor-pointer">Close</button>
          </div>
        </div>
      </Modal>

      {/* Payment Processing Modal */}
      {selectedOrderToPay && (
        <Modal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} title={`Process Payment: ${selectedOrderToPay.orderNumber}`} size="md">
          <PaymentForm 
            order={selectedOrderToPay} 
            onPay={handleProcessPayment} 
            onClose={() => setPayModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

const PaymentForm = ({ order, onPay, onClose }) => {
  const [method, setMethod] = useState('Cash');

  const subtotal = order.totalAmount || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay(order._id, method);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-slate-50 p-4 rounded-xl border border-gray-250/50 text-xs space-y-2">
        <div className="flex justify-between font-black border-b border-gray-250 pb-2 mb-2">
          <span className="text-gray-900 text-sm">Table T-{order.table?.tableNumber || '?'} Order Details</span>
          <span className="text-indigo-700 text-sm">Amount due: ₹{subtotal}</span>
        </div>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-gray-600 font-semibold">
              <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
              <span>₹{(item.price || 0) * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Payment Method</label>
          <select 
            value={method} 
            onChange={e => setMethod(e.target.value)} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-250 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <option value="Cash">💵 Cash</option>
            <option value="Card">💳 Card</option>
            <option value="UPI">⚡ UPI</option>
            <option value="Online">🌐 Online</option>
          </select>
        </div>
        <div className="w-full bg-indigo-50 border border-indigo-200/50 rounded-xl p-3.5 text-right shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Total Payable</span>
          <span className="text-2xl font-black text-indigo-700 mt-0.5">₹{subtotal}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-150">
        <button type="button" onClick={onClose} className="px-4 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer">
          <Printer className="w-4 h-4" />
          Complete Checkout
        </button>
      </div>
    </form>
  );
};

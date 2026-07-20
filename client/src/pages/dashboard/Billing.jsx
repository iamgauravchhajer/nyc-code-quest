import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { Badge } from '../../components/dashboard/Badge';
import { StatCard } from '../../components/dashboard/StatCard';
import { Modal } from '../../components/dashboard/Modal';
import { DataTable } from '../../components/dashboard/DataTable';

const INITIAL_BILLS = [
  { id: 'INV-2042', orderId: 'ORD-1040', customer: 'Rohan Das', subtotal: 2000, tax: 100, discount: 0, total: 2100, method: 'Card', status: 'paid' },
  { id: 'INV-2041', orderId: 'ORD-1039', customer: 'Sneha Iyer', subtotal: 400, tax: 20, discount: 40, total: 380, method: 'UPI', status: 'paid' },
  { id: 'INV-2040', orderId: 'ORD-1038', customer: 'Karthik V.', subtotal: 1600, tax: 80, discount: 0, total: 1680, method: 'Cash', status: 'paid' },
  { id: 'INV-2039', orderId: 'ORD-1034', customer: 'Neha Patel', subtotal: 666, tax: 34, discount: 0, total: 700, method: 'Pending', status: 'pending' },
  { id: 'INV-2038', orderId: 'ORD-1033', customer: 'Rajesh Kumar', subtotal: 428, tax: 22, discount: 0, total: 450, method: 'Pending', status: 'pending' },
];

const UNBILLED_ORDERS = [
  { id: 'ORD-1042', customer: 'Arjun Sharma', items: [{ n: 'Paneer Tikka', p: 320, q: 1 }, { n: 'Dal Makhani', p: 280, q: 2 }], subtotal: 880 },
];

export const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setBills(INITIAL_BILLS); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleMarkPaid = (id) => {
    if (!window.confirm('Mark this bill as paid?')) return;
    setBills(bills.map(b => b.id === id ? { ...b, status: 'paid', method: 'Cash' } : b));
  };

  const filteredBills = activeTab === 'All' ? bills : bills.filter(b => b.status === activeTab.toLowerCase());
  
  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.total, 0);
  const pendingCount = bills.filter(b => b.status === 'pending').length;

  const columns = [
    { key: 'id', label: 'Invoice' },
    { key: 'orderId', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'subtotal', label: 'Subtotal', render: (row) => <span>₹{row.subtotal}</span> },
    { key: 'tax', label: 'Tax', render: (row) => <span>₹{row.tax}</span> },
    { key: 'discount', label: 'Discount', render: (row) => <span>₹{row.discount}</span> },
    { key: 'total', label: 'Total', render: (row) => <span className="font-bold">₹{row.total}</span> },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        row.status === 'pending' ? (
          <button onClick={() => handleMarkPaid(row.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer">
            Mark Paid
          </button>
        ) : (
          <span className="text-xs text-gray-400 font-semibold">Done</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Billing & Payments" 
        action={{ label: 'Generate Bill', icon: FileText, onClick: () => setModalOpen(true) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} icon={FileText} color="emerald" />
        <StatCard title="Pending Invoices" value={pendingCount} icon={FileText} color="amber" />
        <StatCard title="Paid Invoices" value={bills.length - pendingCount} icon={FileText} color="indigo" />
      </div>

      <div className="flex gap-1.5 border-b border-gray-100 pb-2">
        {['All', 'Pending', 'Paid'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-150 text-gray-600 hover:bg-gray-200'
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

      <GenerateBillModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(b) => {
        setBills([{ ...b, id: `INV-${Date.now().toString().slice(-4)}`, status: 'paid' }, ...bills]);
        setModalOpen(false);
      }} />
    </div>
  );
};

const GenerateBillModal = ({ isOpen, onClose, onSave }) => {
  const [order] = useState(UNBILLED_ORDERS[0]);
  const [taxPct, setTaxPct] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState('Cash');

  const subtotal = order?.subtotal || 0;
  const taxAmt = Math.round((subtotal * taxPct) / 100);
  const total = subtotal + taxAmt - discount;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ orderId: order.id, customer: order.customer, subtotal, tax: taxAmt, discount, total, method });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Bill" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
          <div className="flex justify-between font-bold border-b border-gray-200 pb-1 mb-1">
            <span>Order {order.id} ({order.customer})</span>
            <span>Subtotal: ₹{subtotal}</span>
          </div>
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between text-gray-600">
              <span>{i.q}x {i.n}</span>
              <span>₹{i.p * i.q}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tax (%)</label>
            <input type="number" value={taxPct} onChange={e => setTaxPct(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Discount (₹)</label>
            <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-right">
              <span className="text-xs text-gray-500 block">Grand Total</span>
              <span className="text-lg font-bold text-gray-900">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Cancel</button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer">Generate Invoice</button>
        </div>
      </form>
    </Modal>
  );
};

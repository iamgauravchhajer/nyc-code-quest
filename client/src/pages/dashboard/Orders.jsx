import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { Badge } from '../../components/dashboard/Badge';
import { Modal } from '../../components/dashboard/Modal';
import { DataTable } from '../../components/dashboard/DataTable';

const INITIAL_ORDERS = [
  { id: 'ORD-1042', type: 'Dine-In', customer: 'Arjun Sharma', table: 'T-4', items: [{ name: 'Paneer Tikka', qty: 1 }, { name: 'Dal Makhani', qty: 2 }], total: 1250, status: 'cooking', time: '5m ago' },
  { id: 'ORD-1041', type: 'Takeaway', customer: 'Priya Mehta', table: '-', items: [{ name: 'Chicken 65', qty: 2 }], total: 640, status: 'ready', time: '12m ago' },
  { id: 'ORD-1040', type: 'Dine-In', customer: 'Rohan Das', table: 'T-7', items: [{ name: 'Chicken Biryani', qty: 3 }, { name: 'Masala Chai', qty: 2 }], total: 2100, status: 'served', time: '25m ago' },
  { id: 'ORD-1039', type: 'Delivery', customer: 'Sneha Iyer', table: '-', items: [{ name: 'Fish Curry', qty: 1 }], total: 380, status: 'completed', time: '42m ago' },
  { id: 'ORD-1038', type: 'Dine-In', customer: 'Karthik V.', table: 'T-2', items: [{ name: 'Butter Naan', qty: 4 }], total: 1680, status: 'completed', time: '1h ago' },
  { id: 'ORD-1037', type: 'Dine-In', customer: 'Amit Singh', table: 'T-1', items: [{ name: 'Jeera Rice', qty: 1 }], total: 450, status: 'pending', time: '2m ago' },
  { id: 'ORD-1036', type: 'Takeaway', customer: 'Meera K.', table: '-', items: [{ name: 'Gulab Jamun', qty: 5 }], total: 600, status: 'accepted', time: '8m ago' },
  { id: 'ORD-1035', type: 'Delivery', customer: 'Vikram B.', table: '-', items: [{ name: 'Cold Coffee', qty: 2 }], total: 360, status: 'cancelled', time: '1.5h ago' },
  { id: 'ORD-1034', type: 'Dine-In', customer: 'Neha Patel', table: 'T-8', items: [{ name: 'Paneer Butter Masala', qty: 2 }], total: 700, status: 'served', time: '30m ago' },
  { id: 'ORD-1033', type: 'Dine-In', customer: 'Rajesh Kumar', table: 'T-5', items: [{ name: 'Rasmalai', qty: 3 }], total: 450, status: 'completed', time: '2h ago' },
];

const TABS = ['All', 'Pending', 'Accepted', 'Cooking', 'Ready', 'Served', 'Completed', 'Cancelled'];

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setOrders(INITIAL_ORDERS); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this order?')) return;
    setOrders(orders.filter(o => o.id !== row.id));
  };

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

  const columns = [
    { key: 'id', label: 'Order ID', render: (row) => <span className="font-semibold text-indigo-600">{row.id}</span> },
    { key: 'type', label: 'Type' },
    { key: 'customer', label: 'Customer' },
    { key: 'table', label: 'Table' },
    {
      key: 'items', label: 'Items',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
        </span>
      )
    },
    { key: 'total', label: 'Total', render: (row) => <span>₹{row.total}</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      key: 'updateStatus', label: 'Change Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="bg-slate-50 border border-gray-250 rounded px-2 py-1 text-xs focus:outline-none"
        >
          {TABS.filter(t => t !== 'All').map(t => (
            <option key={t} value={t.toLowerCase()}>{t}</option>
          ))}
        </select>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Order Management" 
        action={{ label: 'New Order', icon: Plus, onClick: () => setModalOpen(true) }}
      />

      <div className="flex gap-1.5 overflow-x-auto pb-2 scroll-hide border-b border-gray-100">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-150 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredOrders} 
        loading={loading}
        onDelete={handleDelete}
      />

      <NewOrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(o) => {
        setOrders([{ ...o, id: `ORD-${Date.now().toString().slice(-4)}`, status: 'pending', time: 'Just now' }, ...orders]);
        setModalOpen(false);
      }} />
    </div>
  );
};

const NewOrderModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({ type: 'Dine-In', table: '', customer: '' });
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isOpen) { setForm({ type: 'Dine-In', table: '', customer: '' }); setItems([]); }
  }, [isOpen]);

  const menu = [
    { name: 'Paneer Tikka', price: 320 },
    { name: 'Chicken Biryani', price: 420 },
    { name: 'Butter Naan', price: 70 },
  ];

  const handleQtyChange = (name, price, qty) => {
    const ex = items.find(i => i.name === name);
    if (qty <= 0) {
      setItems(items.filter(i => i.name !== name));
    } else if (ex) {
      setItems(items.map(i => i.name === name ? { ...i, qty } : i));
    } else {
      setItems([...items, { name, price, qty }]);
    }
  };

  const total = items.reduce((acc, i) => acc + (i.price * i.qty), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Select at least one item');
      return;
    }
    onSave({ ...form, items, total });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Order Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm">
              <option value="Dine-In">Dine-In</option>
              <option value="Takeaway">Takeaway</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          {form.type === 'Dine-In' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Table Number</label>
              <input required type="text" value={form.table} onChange={e => setForm({...form, table: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm" placeholder="e.g. T-1" />
            </div>
          )}
          <div className={form.type === 'Dine-In' ? 'col-span-1' : 'col-span-2'}>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Customer Name</label>
            <input required type="text" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-gray-700">Select Items</p>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {menu.map(m => {
              const current = items.find(i => i.name === m.name)?.qty || 0;
              return (
                <div key={m.name} className="flex justify-between items-center text-sm py-1 border-b border-gray-50">
                  <span>{m.name} (₹{m.price})</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleQtyChange(m.name, m.price, current - 1)} className="px-2 py-0.5 border border-gray-200 rounded font-bold">-</button>
                    <span className="w-4 text-center font-semibold">{current}</span>
                    <button type="button" onClick={() => handleQtyChange(m.name, m.price, current + 1)} className="px-2 py-0.5 border border-gray-200 rounded font-bold">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Total: ₹{total}</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Cancel</button>
            <button type="submit" disabled={total === 0} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer disabled:opacity-50">Place Order</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Modal } from '../../components/dashboard/Modal';

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Arjun Sharma', phone: '+91 98765 43210', email: 'arjun@example.com', city: 'Mumbai', orders: 12, spent: 14500 },
  { id: 2, name: 'Priya Mehta', phone: '+91 87654 32109', email: 'priya@example.com', city: 'Delhi', orders: 8, spent: 8200 },
  { id: 3, name: 'Rohan Das', phone: '+91 76543 21098', email: 'rohan@example.com', city: 'Bangalore', orders: 24, spent: 32400 },
  { id: 4, name: 'Sneha Iyer', phone: '+91 65432 10987', email: 'sneha@example.com', city: 'Chennai', orders: 3, spent: 2100 },
  { id: 5, name: 'Karthik V.', phone: '+91 54321 09876', email: 'karthik@example.com', city: 'Hyderabad', orders: 15, spent: 18600 },
  { id: 6, name: 'Amit Singh', phone: '+91 99887 76655', email: 'amit@example.com', city: 'Pune', orders: 5, spent: 4500 },
  { id: 7, name: 'Meera K.', phone: '+91 88776 65544', email: 'meera@example.com', city: 'Ahmedabad', orders: 9, spent: 9800 },
  { id: 8, name: 'Vikram B.', phone: '+91 77665 54433', email: 'vikram@example.com', city: 'Kolkata', orders: 2, spent: 1200 },
  { id: 9, name: 'Neha Patel', phone: '+91 66554 43322', email: 'neha@example.com', city: 'Surat', orders: 11, spent: 11200 },
  { id: 10, name: 'Rajesh Kumar', phone: '+91 55443 32211', email: 'rajesh@example.com', city: 'Jaipur', orders: 18, spent: 21500 },
  { id: 11, name: 'Anjali D.', phone: '+91 99988 87776', email: 'anjali@example.com', city: 'Lucknow', orders: 1, spent: 800 },
  { id: 12, name: 'Sanjay Gupta', phone: '+91 88877 76665', email: 'sanjay@example.com', city: 'Kanpur', orders: 6, spent: 5400 },
  { id: 13, name: 'Pooja R.', phone: '+91 77766 65554', email: 'pooja@example.com', city: 'Nagpur', orders: 14, spent: 16800 },
  { id: 14, name: 'Deepak M.', phone: '+91 66655 54443', email: 'deepak@example.com', city: 'Indore', orders: 7, spent: 7200 },
  { id: 15, name: 'Kavita S.', phone: '+91 55544 43332', email: 'kavita@example.com', city: 'Bhopal', orders: 4, spent: 3600 },
];

export const Customers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setData(INITIAL_CUSTOMERS); setLoading(false); }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = (row) => {
    if (!window.confirm('Are you sure you want to remove this customer?')) return;
    setData(data.filter(item => item.id !== row.id));
  };

  const handleExport = () => {
    alert('Exporting customers list to CSV...');
  };

  let filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.phone.includes(search)
  );

  if (sortBy === 'name') filteredData.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'spent') filteredData.sort((a, b) => b.spent - a.spent);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-sky-500'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const columns = [
    {
      key: 'name', label: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${getAvatarColor(row.name)} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
            {getInitials(row.name)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone', render: (row) => <span className="font-medium text-gray-600">{row.phone}</span> },
    { key: 'city', label: 'City', render: (row) => <span className="text-gray-600">{row.city}</span> },
    { key: 'orders', label: 'Total Orders', render: (row) => <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">{row.orders}</span> },
    { key: 'spent', label: 'Total Spent', render: (row) => <span className="font-black text-emerald-600">₹{row.spent.toLocaleString()}</span> },
  ];

  return (
    <div className="animate-fade-up pb-20">
      <PageHeader 
        title="Customer Directory" 
        subtitle="Manage customer relationships and history"
        action={{ label: 'Add Customer', icon: Plus, onClick: () => { setEditingItem(null); setModalOpen(true); } }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 mb-1">Total Customers</p>
          <h3 className="text-3xl font-black text-gray-900">{data.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 mb-1">New This Month</p>
          <h3 className="text-3xl font-black text-indigo-600">+12</h3>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-2xl border border-indigo-500 shadow-lg text-white">
          <p className="text-sm font-semibold text-indigo-100 mb-1">Top Spender</p>
          <h3 className="text-xl font-black truncate">Rohan Das</h3>
          <p className="text-xs font-medium text-indigo-200 mt-1">₹32,400 total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 focus:outline-none focus:border-indigo-500">
            <option value="name">Sort by Name</option>
            <option value="spent">Sort by Spent</option>
          </select>
          <button onClick={handleExport} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer" title="Export CSV">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        loading={loading}
        onEdit={(item) => { setEditingItem(item); setModalOpen(true); }}
        onDelete={handleDelete}
      />

      <CustomerModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={editingItem}
        onSave={(newItem) => {
          if (editingItem) {
            setData(data.map(i => i.id === editingItem.id ? { ...newItem, id: editingItem.id } : i));
          } else {
            setData([{ ...newItem, id: Date.now(), orders: 0, spent: 0 }, ...data]);
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
};

const CustomerModal = ({ isOpen, onClose, item, onSave }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '' });

  useEffect(() => {
    if (item) setForm(item);
    else setForm({ name: '', phone: '', email: '', city: '' });
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
          <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
            <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" placeholder="+91 ..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
            <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address (Optional)</label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer">Save Customer</button>
        </div>
      </form>
    </Modal>
  );
};

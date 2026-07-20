import { useState, useEffect } from 'react';
import { Plus, Search, Download, Users, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Modal } from '../../components/dashboard/Modal';
import { 
  getCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '../../api/customers';

export const Customers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      // API response returns { customers: [...] }
      setData(res.data?.customers || res.customers || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch customers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to remove "${row.name}" from the directory?`)) return;
    try {
      await deleteCustomer(row._id);
      setData(data.filter(item => item._id !== row._id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete customer entry.');
    }
  };

  const handleExport = () => {
    // Generate CSV and trigger download
    if (data.length === 0) {
      alert('No customer data to export.');
      return;
    }
    const headers = ['Name', 'Phone', 'Email', 'City', 'Orders Count', 'Spent Amount'];
    const rows = data.map(c => [c.name, c.phone, c.email || '', c.city || '', c.orders || 0, c.spent || 0]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.phone.includes(search)
  );

  if (sortBy === 'name') {
    filteredData.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'spent') {
    filteredData.sort((a, b) => b.spent - a.spent);
  } else if (sortBy === 'orders') {
    filteredData.sort((a, b) => b.orders - a.orders);
  }

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-sky-500'];
    return colors[name ? name.charCodeAt(0) % colors.length : 0];
  };

  const topSpender = data.length > 0 ? [...data].sort((a, b) => b.spent - a.spent)[0] : null;

  const columns = [
    {
      key: 'name', label: 'Customer Name & Email',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${getAvatarColor(row.name)} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
            {getInitials(row.name)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400 font-semibold">{row.email || 'No email registered'}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone Number', render: (row) => <span className="font-bold text-gray-600">{row.phone}</span> },
    { key: 'city', label: 'City Location', render: (row) => <span className="text-gray-500 font-semibold">{row.city || '—'}</span> },
    { key: 'orders', label: 'Orders placed', render: (row) => <span className="font-extrabold text-gray-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">{row.orders || 0}</span> },
    { key: 'spent', label: 'Total Spent', render: (row) => <span className="font-black text-emerald-600">₹{(row.spent || 0).toLocaleString()}</span> },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <PageHeader 
        title="Customer Directory" 
        action={{ label: 'Add Customer', icon: Plus, onClick: () => { setEditingItem(null); setModalOpen(true); } }}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Database</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{data.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Average Spending</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              ₹{data.length > 0 ? Math.round(data.reduce((acc, c) => acc + (c.spent || 0), 0) / data.length) : 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-2xl border border-indigo-500 shadow-lg text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-150">Top Spender</p>
            <h3 className="text-lg font-black mt-1 truncate max-w-[160px]">{topSpender ? topSpender.name : '—'}</h3>
            <p className="text-[10px] text-indigo-200 font-bold uppercase mt-0.5">₹{topSpender ? topSpender.spent : 0} spent</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Directory Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all font-semibold"
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)} 
            className="px-4 py-2 bg-slate-50 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="spent">Sort by Spent</option>
            <option value="orders">Sort by Orders</option>
          </select>
          <button 
            onClick={handleExport} 
            className="p-2 border border-gray-250 rounded-xl hover:bg-slate-50 text-gray-600 transition-colors cursor-pointer shadow-sm" 
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
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

      {/* Customer Form Modal */}
      <CustomerModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={editingItem}
        onSave={async (newItem) => {
          try {
            if (editingItem) {
              const res = await updateCustomer(editingItem._id, newItem);
              const updated = res.data?.customer || res.customer;
              setData(data.map(i => i._id === editingItem._id ? updated : i));
            } else {
              const res = await createCustomer(newItem);
              const created = res.data?.customer || res.customer;
              setData([created, ...data]);
            }
            setModalOpen(false);
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to save customer.');
          }
        }}
      />
    </div>
  );
};

const CustomerModal = ({ isOpen, onClose, item, onSave }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '' });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        phone: item.phone,
        email: item.email || '',
        city: item.city || ''
      });
    } else {
      setForm({ name: '', phone: '', email: '', city: '' });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
          <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
            <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" placeholder="+91 ..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
            <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address (Optional)</label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" />
        </div>
        
        <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-gray-150">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-150 hover:bg-gray-200 rounded-xl cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer">Save Customer</button>
        </div>
      </form>
    </Modal>
  );
};

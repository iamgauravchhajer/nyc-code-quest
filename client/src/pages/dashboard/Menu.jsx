/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Modal } from '../../components/dashboard/Modal';

const INITIAL_DATA = [
  { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 320, description: 'Marinated cottage cheese grilled in tandoor', prepTime: '15m', isVeg: true, isAvailable: true },
  { id: 2, name: 'Chicken 65', category: 'Starters', price: 380, description: 'Spicy, deep-fried chicken dish', prepTime: '15m', isVeg: false, isAvailable: true },
  { id: 3, name: 'Paneer Butter Masala', category: 'Main Course', price: 350, description: 'Rich tomato gravy with paneer cubes', prepTime: '20m', isVeg: true, isAvailable: true },
  { id: 4, name: 'Chicken Biryani', category: 'Rice', price: 420, description: 'Aromatic basmati rice cooked with tender chicken', prepTime: '25m', isVeg: false, isAvailable: true },
  { id: 5, name: 'Dal Makhani', category: 'Main Course', price: 280, description: 'Slow-cooked black lentils in creamy tomato gravy', prepTime: '20m', isVeg: true, isAvailable: true },
  { id: 6, name: 'Gulab Jamun', category: 'Desserts', price: 120, description: 'Deep-fried milk solids soaked in sugar syrup', prepTime: '5m', isVeg: true, isAvailable: true },
  { id: 7, name: 'Masala Chai', category: 'Beverages', price: 60, description: 'Indian spiced tea', prepTime: '10m', isVeg: true, isAvailable: true },
  { id: 8, name: 'Butter Naan', category: 'Main Course', price: 70, description: 'Soft and buttery flatbread', prepTime: '5m', isVeg: true, isAvailable: true },
  { id: 9, name: 'Fish Curry', category: 'Main Course', price: 450, description: 'Spicy and tangy fish curry', prepTime: '25m', isVeg: false, isAvailable: false },
  { id: 10, name: 'Jeera Rice', category: 'Rice', price: 180, description: 'Basmati rice tempered with cumin seeds', prepTime: '15m', isVeg: true, isAvailable: true },
  { id: 11, name: 'Rasmalai', category: 'Desserts', price: 150, description: 'Cottage cheese dumplings in sweetened milk', prepTime: '5m', isVeg: true, isAvailable: true },
  { id: 12, name: 'Cold Coffee', category: 'Beverages', price: 180, description: 'Blended iced coffee with milk', prepTime: '10m', isVeg: true, isAvailable: true },
];

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Rice', 'Desserts', 'Beverages'];

export const Menu = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setData(INITIAL_DATA); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleToggleAvailable = (id) => {
    setData(data.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this item?')) return;
    setData(data.filter(item => item.id !== row.id));
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      key: 'name', label: 'Item Name',
      render: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${row.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-semibold text-gray-900">{row.name}</span>
          </div>
          {row.description && <p className="text-xs text-gray-400 mt-0.5">{row.description}</p>}
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (row) => <span>₹{row.price}</span> },
    { key: 'prepTime', label: 'Prep Time' },
    {
      key: 'isAvailable', label: 'Available',
      render: (row) => (
        <input
          type="checkbox"
          checked={row.isAvailable}
          onChange={() => handleToggleAvailable(row.id)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Menu Items" 
        action={{ label: 'Add Item', icon: Plus, onClick: () => { setEditingItem(null); setModalOpen(true); } }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-150 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full sm:w-60 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        loading={loading}
        onEdit={(item) => { setEditingItem(item); setModalOpen(true); }}
        onDelete={handleDelete}
      />

      <MenuModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={editingItem}
        onSave={(newItem) => {
          if (editingItem) {
            setData(data.map(i => i.id === editingItem.id ? { ...newItem, id: editingItem.id } : i));
          } else {
            setData([{ ...newItem, id: Date.now() }, ...data]);
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
};

const MenuModal = ({ isOpen, onClose, item, onSave }) => {
  const [form, setForm] = useState({ name: '', category: 'Starters', price: '', description: '', prepTime: '', isVeg: true, isAvailable: true });

  useEffect(() => {
    if (item) setForm(item);
    else setForm({ name: '', category: 'Starters', price: '', description: '', prepTime: '', isVeg: true, isAvailable: true });
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Menu Item' : 'Add New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Item Name</label>
          <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Price (₹)</label>
            <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
          <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Prep Time (e.g. 15m)</label>
            <input required type="text" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex items-center gap-4 mt-5">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={form.isVeg} onChange={e => setForm({...form, isVeg: e.target.checked})} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-350" />
              <span className="text-xs font-semibold text-gray-600">Veg</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-350" />
              <span className="text-xs font-semibold text-gray-600">Available</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Cancel</button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer">Save Item</button>
        </div>
      </form>
    </Modal>
  );
};

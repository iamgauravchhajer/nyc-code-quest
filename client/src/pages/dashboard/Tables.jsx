import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { Modal } from '../../components/dashboard/Modal';
import { Badge } from '../../components/dashboard/Badge';

const INITIAL_TABLES = [
  { id: 1, number: 'T-1', capacity: 2, status: 'available' },
  { id: 2, number: 'T-2', capacity: 4, status: 'occupied' },
  { id: 3, number: 'T-3', capacity: 4, status: 'cleaning' },
  { id: 4, number: 'T-4', capacity: 6, status: 'occupied' },
  { id: 5, number: 'T-5', capacity: 2, status: 'available' },
  { id: 6, number: 'T-6', capacity: 8, status: 'reserved' },
  { id: 7, number: 'T-7', capacity: 4, status: 'available' },
  { id: 8, number: 'T-8', capacity: 4, status: 'occupied' },
  { id: 9, number: 'T-9', capacity: 2, status: 'available' },
  { id: 10, number: 'T-10', capacity: 6, status: 'cleaning' },
  { id: 11, number: 'T-11', capacity: 4, status: 'reserved' },
  { id: 12, number: 'T-12', capacity: 10, status: 'available' },
];

const STATUSES = ['available', 'occupied', 'reserved', 'cleaning'];

export const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setTables(INITIAL_TABLES);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setTables(tables.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this table?')) return;
    setTables(tables.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Table Management" 
        action={{ label: 'Add Table', icon: Plus, onClick: () => setModalOpen(true) }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-gray-150 animate-pulse" />
          ))
        ) : (
          tables.map(table => (
            <div key={table.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-32 text-gray-700">
              <div className="flex justify-between items-start">
                <span className="text-lg font-bold text-gray-900">{table.number}</span>
                <span className="text-xs text-gray-400 font-semibold">{table.capacity} seats</span>
              </div>
              
              <div className="mt-2 space-y-2">
                <select
                  value={table.status}
                  onChange={(e) => handleStatusChange(table.id, e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex justify-between items-center text-xs">
                  <Badge status={table.status} />
                  <button onClick={() => handleDelete(table.id)} className="text-red-500 hover:text-red-700 font-semibold cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddTableModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={(t) => {
        setTables([...tables, { ...t, id: Date.now(), status: 'available' }]);
        setModalOpen(false);
      }} />
    </div>
  );
};

const AddTableModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({ number: 'T-', capacity: 2 });

  useEffect(() => { if (isOpen) setForm({ number: 'T-', capacity: 2 }); }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, capacity: Number(form.capacity) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Table" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Table Number</label>
          <input required type="text" value={form.number} onChange={e => setForm({...form, number: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Capacity (Seats)</label>
          <input required type="number" min="1" max="20" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Cancel</button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer">Add Table</button>
        </div>
      </form>
    </Modal>
  );
};

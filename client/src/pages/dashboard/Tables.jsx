import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Grid3x3, CheckCircle, AlertTriangle, RefreshCw, QrCode } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { Modal } from '../../components/dashboard/Modal';
import { Badge } from '../../components/dashboard/Badge';
import { getTables, createTable, updateTable, deleteTable } from '../../api/tables';

const STATUSES = ['available', 'occupied', 'reserved', 'cleaning'];

export const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await getTables();
      // Backend returns { tables: [...] }
      setTables(res.data?.tables || res.tables || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tables from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateTable(id, { status: newStatus });
      const updated = res.data?.table || res.table;
      setTables(tables.map(t => t._id === id ? { ...t, ...updated } : t));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update table status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this table?')) return;
    try {
      await deleteTable(id);
      setTables(tables.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete table.');
    }
  };

  const handleDownloadQR = async (tableNumber, qrCodePath) => {
    try {
      if (!qrCodePath) {
        alert('No QR Code URL found for this table.');
        return;
      }
      const fullUrl = window.location.origin + qrCodePath;
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
      const response = await fetch(apiUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `table_T-${tableNumber}_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to download QR Code.');
    }
  };

  // Helper to render chairs around a table card
  const renderChairs = (capacity) => {
    const chairsCount = Math.min(capacity, 10);
    return (
      <div className="flex justify-center gap-1 mt-3">
        {[...Array(chairsCount)].map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300 dark:border-slate-700" />
        ))}
        {capacity > 10 && <span className="text-[10px] text-gray-400 font-bold">+{capacity - 10}</span>}
      </div>
    );
  };

  const activeCount = tables.filter(t => t.status === 'occupied').length;
  const availableCount = tables.filter(t => t.status === 'available').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <PageHeader 
        title="Table Management" 
        action={{ label: 'Add Table', icon: Plus, onClick: () => setModalOpen(true) }}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Tables</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{tables.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Grid3x3 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Occupied Tables</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{activeCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Available Tables</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{availableCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tables Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-gray-150 shadow-sm animate-pulse flex flex-col p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-5 w-12 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
              </div>
              <div className="h-8 bg-gray-50 rounded" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))
        ) : tables.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
            <Grid3x3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-800 text-lg">No tables defined</h3>
            <p className="text-xs text-gray-400 mt-1">Get started by creating your first dining table.</p>
          </div>
        ) : (
          tables.map(table => {
            const isOccupied = table.status === 'occupied';
            const isCleaning = table.status === 'cleaning';
            const isReserved = table.status === 'reserved';

            let statusBorderColor = 'border-gray-200 focus-within:ring-indigo-500/20';
            let shadowStyle = 'hover:shadow-md';
            if (table.status === 'available') {
              statusBorderColor = 'border-emerald-200 focus-within:ring-emerald-500/20';
              shadowStyle = 'hover:shadow-emerald-100 hover:shadow-lg';
            } else if (isOccupied) {
              statusBorderColor = 'border-rose-200 focus-within:ring-rose-500/20';
              shadowStyle = 'hover:shadow-rose-100 hover:shadow-lg';
            } else if (isReserved) {
              statusBorderColor = 'border-amber-200 focus-within:ring-amber-500/20';
              shadowStyle = 'hover:shadow-amber-100 hover:shadow-lg';
            } else if (isCleaning) {
              statusBorderColor = 'border-sky-200 focus-within:ring-sky-500/20';
              shadowStyle = 'hover:shadow-sky-100 hover:shadow-lg';
            }

            return (
              <div 
                key={table._id} 
                className={`bg-white border-2 ${statusBorderColor} rounded-2xl p-5 flex flex-col justify-between h-48 text-gray-700 transition-all duration-300 ${shadowStyle}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Table</span>
                    <span className="text-2xl font-black text-gray-900">T-{table.tableNumber}</span>
                  </div>
                  <Badge status={table.status} />
                </div>

                <div className="my-1 text-center bg-slate-50 py-1.5 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-gray-600 block">{table.capacity} seats</span>
                  {renderChairs(table.capacity)}
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <select
                      value={table.status}
                      onChange={(e) => handleStatusChange(table._id, e.target.value)}
                      className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 cursor-pointer transition-all"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                    <button 
                      onClick={() => handleDownloadQR(table.tableNumber, table.qrCode)} 
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-100 cursor-pointer transition-colors"
                      title="Download Table QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(table._id)} 
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-xl border border-red-100 cursor-pointer transition-colors"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddTableModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAdd={async (t) => {
          try {
            const res = await createTable({ 
              tableNumber: Number(t.tableNumber), 
              capacity: Number(t.capacity) 
            });
            const newTable = res.data?.table || res.table;
            setTables([...tables, newTable]);
            setModalOpen(false);
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create table. Remember Table Number must be a positive integer and unique.');
          }
        }} 
      />
    </div>
  );
};

export const AddTableModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({ tableNumber: '', capacity: 4 });

  useEffect(() => {
    if (isOpen) setForm({ tableNumber: '', capacity: 4 });
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ 
      tableNumber: Number(form.tableNumber), 
      capacity: Number(form.capacity) 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Table" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Table Number</label>
          <input 
            required 
            type="number" 
            min="1" 
            placeholder="e.g. 1"
            value={form.tableNumber} 
            onChange={e => setForm({...form, tableNumber: e.target.value})} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-250 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Capacity (Seats)</label>
          <input 
            required 
            type="number" 
            min="1" 
            max="24" 
            value={form.capacity} 
            onChange={e => setForm({...form, capacity: e.target.value})} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-250 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold" 
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors">Add Table</button>
        </div>
      </form>
    </Modal>
  );
};

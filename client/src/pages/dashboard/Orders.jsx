import { useState, useEffect } from 'react';
import { Plus, Search, ShoppingBag, ClipboardList, Utensils, IndianRupee, Clock, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { Badge } from '../../components/dashboard/Badge';
import { Modal } from '../../components/dashboard/Modal';
import { DataTable } from '../../components/dashboard/DataTable';
import { getOrders, createOrder, changeOrderStatus } from '../../api/orders';
import { getTables, createTable } from '../../api/tables';
import { getMenuItems } from '../../api/menu';
import { SearchableSelect } from '../../components/dashboard/SearchableSelect';
import { AddTableModal } from './Tables';

const TABS = ['All', 'Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'];

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, tablesRes, menuRes] = await Promise.all([
        getOrders(),
        getTables(),
        getMenuItems()
      ]);
      
      setOrders(ordersRes.data?.orders || ordersRes.orders || []);
      setTables(tablesRes.data?.tables || tablesRes.tables || []);
      setMenuItems(menuRes.data?.menuItems || menuRes.menuItems || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load orders, tables, or menu items from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await changeOrderStatus(id, newStatus);
      const updated = res.data?.order || res.order;
      setOrders(orders.map(o => o._id === id ? { ...o, ...updated } : o));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === activeTab.toLowerCase());

  const columns = [
    { 
      key: 'orderNumber', 
      label: 'Order ID', 
      render: (row) => <span className="font-bold text-indigo-600 text-sm tracking-wide">{row.orderNumber}</span> 
    },
    { 
      key: 'table', 
      label: 'Table',
      render: (row) => (
        <span className="font-semibold text-gray-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
          T-{row.table?.tableNumber || '?'}
        </span>
      )
    },
    {
      key: 'items', label: 'Ordered Items',
      render: (row) => (
        <div className="flex flex-col gap-1 max-w-xs">
          {row.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs text-gray-500">
              <span className="font-medium truncate mr-2">{item.menuItem?.name || 'Unknown Item'}</span>
              <span className="font-bold text-gray-800 bg-gray-50 border border-gray-150 px-1.5 py-0.2 rounded-md shrink-0">x{item.quantity}</span>
            </div>
          ))}
        </div>
      )
    },
    { 
      key: 'totalAmount', 
      label: 'Total Amount', 
      render: (row) => <span className="font-black text-gray-900">₹{row.totalAmount}</span> 
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black border ${
          row.paymentStatus === 'paid' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {row.paymentStatus}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status Badge', 
      render: (row) => <Badge status={row.status} /> 
    },
    {
      key: 'updateStatus', label: 'Action & Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className="bg-slate-50 border border-gray-250 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 cursor-pointer transition-all"
        >
          {TABS.filter(t => t !== 'All').map(t => (
            <option key={t} value={t.toLowerCase()}>{t}</option>
          ))}
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <PageHeader 
        title="Order Management" 
        action={{ label: 'New Order', icon: Plus, onClick: () => setModalOpen(true) }}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Tabs Filter Section */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scroll-hide border-b border-gray-150">
        {TABS.map(tab => {
          const count = tab === 'All' ? orders.length : orders.filter(o => o.status?.toLowerCase() === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-50 border border-slate-200 text-gray-500 hover:bg-slate-100 hover:text-gray-800'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredOrders} 
        loading={loading}
      />

      <NewOrderModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        tables={tables}
        menuItems={menuItems}
        onCreateTable={() => setTableModalOpen(true)}
        onSave={async (o) => {
          try {
            const res = await createOrder({
              tableId: o.tableId,
              items: o.items.map(i => ({ menuItemId: i._id, quantity: i.qty }))
            });
            const newOrder = res.data?.order || res.order;
            // Fetch fresh list to ensure relationships are fully loaded and formatted
            loadData();
            setModalOpen(false);
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to place new order.');
          }
        }} 
      />

      <AddTableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onAdd={async (t) => {
          try {
            const res = await createTable({ 
              tableNumber: Number(t.tableNumber), 
              capacity: Number(t.capacity) 
            });
            const newTable = res.data?.table || res.table;
            setTables([...tables, newTable]);
            setTableModalOpen(false);
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create table. Remember Table Number must be a positive integer and unique.');
          }
        }}
      />
    </div>
  );
};

const NewOrderModal = ({ isOpen, onClose, tables, menuItems, onSave, onCreateTable }) => {
  const [tableId, setTableId] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setTableId(tables.find(t => t.status === 'available')?._id || '');
      setItems([]);
    }
  }, [isOpen, tables]);

  const handleQtyChange = (menuItem, qty) => {
    const ex = items.find(i => i._id === menuItem._id);
    if (qty <= 0) {
      setItems(items.filter(i => i._id !== menuItem._id));
    } else if (ex) {
      setItems(items.map(i => i._id === menuItem._id ? { ...i, qty } : i));
    } else {
      setItems([...items, { ...menuItem, qty }]);
    }
  };

  const total = items.reduce((acc, i) => acc + (i.price * i.qty), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableId) {
      alert('Please select an available dining table.');
      return;
    }
    if (items.length === 0) {
      alert('Select at least one menu item.');
      return;
    }
    onSave({ tableId, items });
  };

  const availableTables = tables.filter(t => t.status === 'available');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Table</label>
            <SearchableSelect
              options={availableTables.map(t => ({ value: t._id, label: `T-${t.tableNumber} (${t.capacity} seats)` }))}
              value={tableId}
              onChange={val => setTableId(val)}
              placeholder="Select available table..."
              onCreateNew={onCreateTable}
              createNewText="Add Table"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-sm font-bold text-slate-700 mb-1.5">Select Menu Items</p>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 border border-slate-100 rounded-xl p-3 bg-slate-50">
            {menuItems.map(m => {
              const current = items.find(i => i._id === m._id)?.qty || 0;
              return (
                <div key={m._id} className="flex justify-between items-center text-sm py-2 border-b border-gray-200/50 last:border-b-0">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{m.name}</span>
                    <span className="text-xs text-gray-400 font-semibold">₹{m.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleQtyChange(m, current - 1)} 
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-white active:scale-95 transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-gray-900">{current}</span>
                    <button 
                      type="button" 
                      onClick={() => handleQtyChange(m, current + 1)} 
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-white active:scale-95 transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
            {menuItems.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No menu items defined yet.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-150 mt-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grand Total</span>
            <span className="text-lg font-black text-gray-900">₹{total}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={total === 0 || !tableId} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg cursor-pointer">Place Order</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

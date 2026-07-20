import { useState, useEffect } from 'react';
import { Clock, ChefHat, AlertTriangle, Play, CheckCircle, Package } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { getOrders, changeOrderStatus } from '../../api/orders';

export const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      // Fetch active kitchen orders: pending, preparing, served
      const allOrders = res.data?.orders || res.orders || [];
      const kitchenOrders = allOrders.filter(o => 
        ['pending', 'preparing', 'served'].includes(o.status?.toLowerCase())
      );
      setOrders(kitchenOrders);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders for the Kitchen display.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll the kitchen status every 10 seconds to keep order sync alive
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await changeOrderStatus(id, newStatus);
      // Immediately pull fresh state
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update kitchen order status.');
    }
  };

  const getCol = (status) => orders.filter(o => o.status === status);

  // Helper to compute minutes elapsed since creation
  const getMinutesElapsed = (createdAtStr) => {
    if (!createdAtStr) return 0;
    const created = new Date(createdAtStr);
    const diffMs = new Date() - created;
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const OrderCard = ({ order, action, actionLabel, buttonBg, icon: ActionIcon }) => {
    const elapsed = getMinutesElapsed(order.createdAt);
    // Find max preparation time from items in order
    const maxPrep = order.items?.reduce((max, item) => {
      const prep = item.menuItem?.preparationTime || 15;
      return prep > max ? prep : max;
    }, 0) || 15;

    const isOverdue = elapsed > maxPrep;

    return (
      <div className={`p-4 rounded-2xl border-2 bg-white space-y-3 shadow-sm hover:shadow-md transition-all duration-300 ${
        isOverdue ? 'border-red-200 shadow-red-50/50' : 'border-slate-150'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-extrabold text-gray-900 text-sm tracking-wide">{order.orderNumber}</h4>
            <p className="text-[11px] font-bold text-gray-400 mt-0.5">Table T-{order.table?.tableNumber || '?'}</p>
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
            isOverdue 
              ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <Clock className="w-3 h-3" /> {elapsed}m / {maxPrep}m
          </div>
        </div>
        
        <div className="space-y-1.5 py-1 border-t border-b border-gray-50 my-2">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700">{item.menuItem?.name || 'Unknown Item'}</span>
              <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.2 rounded-md">x{item.quantity}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleStatusUpdate(order._id, action)}
          className={`w-full py-2 rounded-xl text-xs font-bold text-white cursor-pointer transition-all flex items-center justify-center gap-1.5 ${buttonBg} shadow-sm active:scale-95`}
        >
          <ActionIcon className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Kitchen Display System" />
        <span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm self-start">
          Auto-updates active (10s)
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PENDING COLUMN */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1 border-b border-slate-200 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 ring-4 ring-amber-100 block" />
              Incoming
            </span>
            <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-lg font-black">{getCol('pending').length}</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {loading ? (
              <div className="h-28 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ) : getCol('pending').length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-semibold">No pending orders</div>
            ) : (
              getCol('pending').map(o => (
                <OrderCard 
                  key={o._id} 
                  order={o} 
                  action="preparing" 
                  actionLabel="Start Preparation" 
                  buttonBg="bg-amber-500 hover:bg-amber-600 shadow-amber-100 hover:shadow-lg" 
                  icon={Play}
                />
              ))
            )}
          </div>
        </div>

        {/* COOKING COLUMN */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1 border-b border-slate-200 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-100 block" />
              In Progress
            </span>
            <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-lg font-black">{getCol('preparing').length}</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {loading ? (
              <div className="h-28 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ) : getCol('preparing').length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-semibold">No cooking in progress</div>
            ) : (
              getCol('preparing').map(o => (
                <OrderCard 
                  key={o._id} 
                  order={o} 
                  action="served" 
                  actionLabel="Mark Ready / Served" 
                  buttonBg="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-lg" 
                  icon={CheckCircle}
                />
              ))
            )}
          </div>
        </div>

        {/* READY / SERVED COLUMN */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1 border-b border-slate-200 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 block" />
              Ready & Served
            </span>
            <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-lg font-black">{getCol('served').length}</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {loading ? (
              <div className="h-28 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ) : getCol('served').length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-semibold">No served orders waiting</div>
            ) : (
              getCol('served').map(o => (
                <OrderCard 
                  key={o._id} 
                  order={o} 
                  action="completed" 
                  actionLabel="Archive Order" 
                  buttonBg="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 hover:shadow-lg" 
                  icon={Package}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

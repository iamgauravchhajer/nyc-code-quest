import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';

const INITIAL_ORDERS = [
  { id: 'ORD-1045', customer: 'Arjun S.', table: 'T-4', items: [{ n: 'Paneer Tikka', q: 2 }, { n: 'Dal Makhani', q: 1 }], status: 'pending', time: 2 },
  { id: 'ORD-1046', customer: 'Priya M.', table: 'Delivery', items: [{ n: 'Chicken 65', q: 1 }], status: 'pending', time: 8 },
  { id: 'ORD-1044', customer: 'Rohan D.', table: 'T-7', items: [{ n: 'Chicken Biryani', q: 3 }], status: 'cooking', time: 14 },
  { id: 'ORD-1043', customer: 'Sneha I.', table: 'T-2', items: [{ n: 'Fish Curry', q: 1 }, { n: 'Jeera Rice', q: 1 }], status: 'cooking', time: 22 },
  { id: 'ORD-1042', customer: 'Karthik V.', table: 'Takeaway', items: [{ n: 'Butter Naan', q: 4 }], status: 'ready', time: 35 },
];

export const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setOrders(INITIAL_ORDERS); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleStatus = (id, newStatus) => {
    if (newStatus === 'served') {
      setOrders(orders.filter(o => o.id !== id));
    } else {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const getCol = (status) => orders.filter(o => o.status === status);

  const OrderCard = ({ order, action, actionLabel, buttonBg }) => {
    return (
      <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{order.id}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{order.customer} ({order.table})</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            <Clock className="w-3 h-3" /> {order.time}m
          </div>
        </div>
        
        <div className="space-y-1 text-xs">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-gray-700">
              <span>{item.n}</span>
              <span className="font-semibold text-gray-900">x{item.q}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleStatus(order.id, action)}
          className={`w-full py-1.5 rounded text-xs font-semibold text-white cursor-pointer transition-colors ${buttonBg}`}
        >
          {actionLabel}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      <PageHeader title="Kitchen Display" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PENDING */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col gap-3 min-h-[300px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase text-gray-500">Pending</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded font-bold">{getCol('pending').length}</span>
          </div>
          <div className="space-y-3">
            {loading ? <div className="h-20 bg-white rounded-lg animate-pulse" /> : 
             getCol('pending').map(o => <OrderCard key={o.id} order={o} action="cooking" actionLabel="Start Cooking" buttonBg="bg-amber-600 hover:bg-amber-700" />)}
          </div>
        </div>

        {/* COOKING */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col gap-3 min-h-[300px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase text-gray-500">Cooking</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded font-bold">{getCol('cooking').length}</span>
          </div>
          <div className="space-y-3">
            {loading ? <div className="h-20 bg-white rounded-lg animate-pulse" /> : 
             getCol('cooking').map(o => <OrderCard key={o.id} order={o} action="ready" actionLabel="Mark Ready" buttonBg="bg-indigo-600 hover:bg-indigo-700" />)}
          </div>
        </div>

        {/* READY */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col gap-3 min-h-[300px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase text-gray-500">Ready</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded font-bold">{getCol('ready').length}</span>
          </div>
          <div className="space-y-3">
            {loading ? <div className="h-20 bg-white rounded-lg animate-pulse" /> : 
             getCol('ready').map(o => <OrderCard key={o.id} order={o} action="served" actionLabel="Mark Served" buttonBg="bg-emerald-600 hover:bg-emerald-700" />)}
          </div>
        </div>
      </div>
    </div>
  );
};

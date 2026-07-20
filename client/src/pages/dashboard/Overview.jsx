import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, IndianRupee, UtensilsCrossed, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/dashboard/Badge';
import { getOrders } from '../../api/orders';
import { getTables } from '../../api/tables';

export const Overview = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, tablesRes] = await Promise.all([
        getOrders(),
        getTables()
      ]);
      setOrders(ordersRes.data?.orders || ordersRes.orders || []);
      setTables(tablesRes.data?.tables || tablesRes.tables || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute stats from active Mongoose data
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeTablesCount = tables.filter(t => t.status === 'occupied').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;

  // Compute popular items dynamically from real orders
  const computePopularItems = () => {
    const itemMap = {};
    orders.forEach(o => {
      o.items?.forEach(item => {
        const name = item.menuItem?.name || 'Unknown Item';
        const price = item.price || item.menuItem?.price || 0;
        const category = item.menuItem?.category?.name || 'Menu';
        if (!itemMap[name]) {
          itemMap[name] = { name, category, orders: 0, revenue: 0 };
        }
        itemMap[name].orders += item.quantity || 0;
        itemMap[name].revenue += price * (item.quantity || 0);
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  };

  const popularItems = computePopularItems();
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-gray-150 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} color="emerald" />
            <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} color="indigo" />
            <StatCard title="Active Tables" value={`${activeTablesCount}/${tables.length}`} icon={UtensilsCrossed} color="amber" />
            <StatCard title="Pending Orders" value={pendingOrdersCount} icon={Clock} color="red" />
            <StatCard title="Completed" value={completedOrdersCount} icon={CheckCircle2} color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Items */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Popular Items
          </h3>
          <div className="divide-y divide-gray-100">
            {popularItems.map((item, i) => (
              <div key={i} className="py-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-gray-800">{item.name}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">{item.orders} orders</p>
                  <p className="text-[10px] text-emerald-600 font-extrabold mt-0.5">₹{item.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {popularItems.length === 0 && !loading && (
              <p className="text-xs text-gray-400 text-center py-6">No sales recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-600" /> Recent Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left font-black text-gray-400 border-b border-gray-150 pb-2 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Table</th>
                  <th className="pb-3">Summary</th>
                  <th className="pb-3">Grand Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-3">
                        <div className="h-6 bg-gray-50 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (
                  recentOrders.map(o => (
                    <tr key={o._id} className="text-gray-700 font-medium">
                      <td className="py-3 font-extrabold text-indigo-600">{o.orderNumber}</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-slate-100 rounded-lg font-bold">T-{o.table?.tableNumber || '?'}</span></td>
                      <td className="py-3 text-gray-500 truncate max-w-[120px]">
                        {o.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')}
                      </td>
                      <td className="py-3 font-black text-gray-900">₹{o.totalAmount}</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase border ${
                          o.paymentStatus === 'paid' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3"><Badge status={o.status} /></td>
                    </tr>
                  ))
                )}
                {recentOrders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-gray-400 font-semibold">No recent order activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, IndianRupee, UtensilsCrossed } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/dashboard/Badge';

const RECENT_ORDERS = [
  { id: 'ORD-1042', customer: 'Arjun Sharma', table: 'T-4', items: 3, total: 1250, status: 'cooking', time: '5m ago' },
  { id: 'ORD-1041', customer: 'Priya Mehta', table: 'Takeaway', items: 2, total: 640, status: 'ready', time: '12m ago' },
  { id: 'ORD-1040', customer: 'Rohan Das', table: 'T-7', items: 5, total: 2100, status: 'served', time: '25m ago' },
  { id: 'ORD-1039', customer: 'Sneha Iyer', table: 'Delivery', items: 1, total: 380, status: 'completed', time: '42m ago' },
  { id: 'ORD-1038', customer: 'Karthik V.', table: 'T-2', items: 4, total: 1680, status: 'completed', time: '1h ago' },
];

const POPULAR = [
  { name: 'Paneer Butter Masala', cat: 'Main Course', orders: 84, revenue: '₹25,200' },
  { name: 'Chicken Biryani', cat: 'Rice', orders: 72, revenue: '₹21,600' },
  { name: 'Dal Makhani', cat: 'Main Course', orders: 61, revenue: '₹15,250' },
  { name: 'Gulab Jamun', cat: 'Desserts', orders: 48, revenue: '₹7,200' },
  { name: 'Masala Chai', cat: 'Beverages', orders: 120, revenue: '₹6,000' },
];

export const Overview = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard title="Today's Revenue" value="₹42,890" icon={IndianRupee} color="emerald" />
            <StatCard title="Today's Orders" value="142" icon={ShoppingBag} color="indigo" />
            <StatCard title="Active Tables" value="12/20" icon={UtensilsCrossed} color="amber" />
            <StatCard title="Pending Orders" value="8" icon={Clock} color="red" />
            <StatCard title="Completed" value="114" icon={CheckCircle2} color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Items */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Popular Items</h3>
          <div className="divide-y divide-gray-50">
            {POPULAR.map((item, i) => (
              <div key={i} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.cat}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{item.orders} orders</p>
                  <p className="text-xs text-gray-400">{item.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 border-b border-gray-100">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Table</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="py-3">
                        <div className="h-5 bg-gray-50 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (
                  RECENT_ORDERS.map(o => (
                    <tr key={o.id} className="text-gray-700">
                      <td className="py-3 font-semibold text-indigo-600">{o.id}</td>
                      <td className="py-3 font-medium">{o.customer}</td>
                      <td className="py-3 text-gray-500">{o.table}</td>
                      <td className="py-3 font-semibold text-gray-900">₹{o.total}</td>
                      <td className="py-3"><Badge status={o.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

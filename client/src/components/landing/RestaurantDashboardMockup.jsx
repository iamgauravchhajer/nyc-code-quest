import {
  useRef, useState, useEffect
} from 'react';
import {
  LayoutDashboard, UtensilsCrossed, TableProperties,
  ShoppingBag, ChefHat, Receipt, Users, TrendingUp,
  Clock, CheckCircle2, AlertCircle, DollarSign
} from 'lucide-react';

// Scaled wrapper — identical logic to original ScaledDashboard
export const ScaledRestaurantDashboard = ({ children }) => {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const handleResize = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const targetWidth = 960;
      const currentScale = Math.min(1, containerWidth / targetWidth);
      setScale(currentScale);
      setHeight(inner.offsetHeight * currentScale);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    observer.observe(inner);
    handleResize();
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ height }} className="w-full relative overflow-hidden">
      <div
        ref={innerRef}
        style={{
          width: '960px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// The main dashboard mockup for the restaurant product
export const RestaurantDashboardMockup = () => {
  const orders = [
    { id: '#ORD-042', table: 'T-04', items: 3, total: '₹840', status: 'Cooking', statusColor: 'text-amber-400' },
    { id: '#ORD-043', table: 'T-07', items: 5, total: '₹1,320', status: 'Ready', statusColor: 'text-emerald-400' },
    { id: '#ORD-044', table: 'T-02', items: 2, total: '₹490', status: 'Pending', statusColor: 'text-blue-400' },
    { id: '#ORD-045', table: 'Takeaway', items: 4, total: '₹970', status: 'Served', statusColor: 'text-white/40' },
  ];

  const tables = [
    { id: 'T-01', cap: 4, status: 'Available', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' },
    { id: 'T-02', cap: 2, status: 'Occupied', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
    { id: 'T-03', cap: 6, status: 'Reserved', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
    { id: 'T-04', cap: 4, status: 'Occupied', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
    { id: 'T-05', cap: 8, status: 'Cleaning', color: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
    { id: 'T-06', cap: 2, status: 'Available', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: UtensilsCrossed, label: 'Menu' },
    { icon: TableProperties, label: 'Tables' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: ChefHat, label: 'Kitchen' },
    { icon: Receipt, label: 'Billing' },
    { icon: Users, label: 'Customers' },
  ];

  return (
    <div className="bg-[#111113] text-left select-none font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Browser Title Bar */}
      <div className="bg-[#1c1c1f] border-b border-white/5 px-4 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 max-w-xs mx-auto">
          <div className="bg-[#111113] rounded-md px-3 py-1 flex items-center justify-center gap-1.5 text-[10px] text-white/50 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
            tableos.app/dashboard
          </div>
        </div>
      </div>

      {/* App Shell */}
      <div className="flex" style={{ height: '480px' }}>
        {/* Sidebar */}
        <div className="w-[200px] shrink-0 bg-[#0f0f11] border-r border-white/5 flex flex-col">
          {/* Brand */}
          <div className="px-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <ChefHat className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[12px] font-bold text-white">TableOS</span>
            </div>
            <div className="mt-3 text-[9px] text-white/35 font-medium">Spice Garden • Mumbai</div>
          </div>

          {/* Nav */}
          <div className="flex-1 px-2 py-3 flex flex-col gap-0.5">
            {navItems.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium cursor-pointer transition-all ${
                  active
                    ? 'bg-orange-500/15 text-orange-300'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-400' : 'text-white/30'}`} />
                {label}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-[9px] font-bold text-white">O</div>
              <div>
                <div className="text-[9px] font-semibold text-white/70">Owner</div>
                <div className="text-[8px] text-white/30">Admin Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#111113] px-5 py-4 overflow-y-auto flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-white">Today's Overview</h2>
              <p className="text-[9px] text-white/35 mt-0.5">Sunday, July 20, 2026 • Live</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-white/40">Real-time</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Today's Revenue", value: '₹24,800', icon: DollarSign, trend: '+12%', color: 'text-emerald-400' },
              { label: "Active Tables", value: '8 / 12', icon: TableProperties, trend: '67%', color: 'text-blue-400' },
              { label: "Orders Today", value: '47', icon: ShoppingBag, trend: '+8', color: 'text-orange-400' },
              { label: "Pending", value: '3', icon: Clock, trend: 'Live', color: 'text-amber-400' },
            ].map(({ label, value, icon: Icon, trend, color }) => (
              <div key={label} className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] text-white/35 font-semibold uppercase tracking-wider">{label}</span>
                  <Icon className={`w-3 h-3 ${color}`} />
                </div>
                <div className="text-[18px] font-semibold text-white leading-none">{value}</div>
                <div className={`text-[8px] mt-1 font-medium ${color}`}>{trend}</div>
              </div>
            ))}
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-3 gap-3 flex-1">
            {/* Active Orders */}
            <div className="col-span-2 rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
              <div className="text-[9px] font-bold text-white/35 tracking-wider uppercase mb-2">Active Orders</div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[8px] text-white/25 font-semibold tracking-wider border-b border-white/5">
                    <th className="pb-1.5 pr-2">Order</th>
                    <th className="pb-1.5 pr-2">Table</th>
                    <th className="pb-1.5 pr-2">Items</th>
                    <th className="pb-1.5 pr-2">Total</th>
                    <th className="pb-1.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[9px]">
                  {orders.map((o) => (
                    <tr key={o.id} className="text-white/70">
                      <td className="py-1.5 pr-2 font-mono text-white/50">{o.id}</td>
                      <td className="py-1.5 pr-2">{o.table}</td>
                      <td className="py-1.5 pr-2">{o.items}</td>
                      <td className="py-1.5 pr-2 font-semibold text-white">{o.total}</td>
                      <td className={`py-1.5 text-right font-medium ${o.statusColor}`}>{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Status */}
            <div className="col-span-1 rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
              <div className="text-[9px] font-bold text-white/35 tracking-wider uppercase mb-2">Tables</div>
              <div className="grid grid-cols-2 gap-1.5">
                {tables.map((t) => (
                  <div key={t.id} className={`rounded-lg border px-2 py-1.5 ${t.color}`}>
                    <div className="text-[10px] font-bold">{t.id}</div>
                    <div className="text-[8px] opacity-70 mt-0.5">{t.status}</div>
                    <div className="text-[7px] opacity-50">{t.cap} seats</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

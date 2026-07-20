import { TrendingUp, ShoppingBag, TableProperties, Clock } from 'lucide-react';

const stats = [
  { value: '₹2.4L+', label: 'Revenue tracked daily', icon: TrendingUp, color: 'from-orange-500 to-amber-400' },
  { value: '500+', label: 'Orders managed per day', icon: ShoppingBag, color: 'from-blue-500 to-cyan-400' },
  { value: '99.9%', label: 'System uptime guaranteed', icon: Clock, color: 'from-emerald-500 to-teal-400' },
  { value: '12+', label: 'Table types & statuses', icon: TableProperties, color: 'from-purple-500 to-pink-400' },
];

export const StatsSection = () => {
  return (
    <section className="relative bg-[#0a0a0b] py-20 px-5">
      {/* Top separator line */}
      <div className="max-w-6xl mx-auto">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] hover:ring-white/10 transition-all duration-300 hover:-translate-y-0.5">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {/* Stat */}
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{value}</div>
              <div className="text-sm text-white/40 mt-1.5 leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

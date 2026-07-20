import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'indigo' }) => {
  const colors = {
    indigo:  { icon: 'text-indigo-500',  bg: 'bg-indigo-50' },
    emerald: { icon: 'text-emerald-500', bg: 'bg-emerald-50' },
    amber:   { icon: 'text-amber-500',   bg: 'bg-amber-50' },
    red:     { icon: 'text-red-500',     bg: 'bg-red-50' },
    purple:  { icon: 'text-purple-500',  bg: 'bg-purple-50' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xl font-bold text-gray-900">{value}</span>
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

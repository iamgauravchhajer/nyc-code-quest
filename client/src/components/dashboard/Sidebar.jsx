import { LayoutDashboard, UtensilsCrossed, Grid3x3, ClipboardList, ChefHat, Receipt, Users, LogOut, Settings } from 'lucide-react';
import { Logo } from '../Logo';

export const Sidebar = ({ activeSection, onNavigate }) => {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'tables', label: 'Tables', icon: Grid3x3 },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-full shrink-0 shadow-2xl z-10 font-sans border-r border-slate-900">
      <div className="p-6 flex items-center gap-3 text-white mb-2 border-b border-slate-900/50">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Logo className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-black text-lg tracking-tight block">Questly</span>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mt-0.5">RMS Dashboard</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scroll-hide mt-4">
        {items.map((item) => {
          const isActive = activeSection === item.id || (activeSection === '' && item.id === 'overview');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10' 
                  : 'hover:bg-slate-900 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ring-4 ring-indigo-400/50" />}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t border-slate-900 space-y-1.5">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all text-slate-400 cursor-pointer">
          <Settings className="w-4.5 h-4.5 text-slate-500" />
          Settings
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold hover:bg-red-950 hover:text-red-400 text-slate-400 transition-all cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 text-slate-500" />
          Logout
        </button>
      </div>
    </aside>
  );
};

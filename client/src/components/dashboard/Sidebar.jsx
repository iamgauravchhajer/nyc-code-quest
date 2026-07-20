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
    <aside className="w-64 bg-gray-950 text-gray-300 flex flex-col h-full shrink-0 shadow-xl z-10 font-sans">
      <div className="p-6 flex items-center gap-3 text-white mb-2">
        <Logo className="w-8 h-8 text-indigo-500" />
        <span className="font-bold text-xl tracking-tight">Questly</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scroll-hide mt-2">
        {items.map((item) => {
          const isActive = activeSection === item.id || (activeSection === '' && item.id === 'overview');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'hover:bg-gray-800 hover:text-white text-gray-400'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-200' : 'text-gray-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-800 space-y-1.5">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 hover:text-white transition-all text-gray-400 cursor-pointer">
          <Settings className="w-5 h-5 text-gray-500" />
          Settings
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-red-950 hover:text-red-400 text-gray-400 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          Logout
        </button>
      </div>
    </aside>
  );
};

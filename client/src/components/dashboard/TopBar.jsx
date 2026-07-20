import React from 'react';
import { Bell, Search } from 'lucide-react';

export const TopBar = ({ title, subtitle }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="bg-white border-b border-gray-100 px-7 py-4 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle || dateStr}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all w-48"
          />
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-gray-500 transition-colors cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          R
        </div>
      </div>
    </header>
  );
};

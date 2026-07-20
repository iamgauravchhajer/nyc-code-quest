import React from 'react';

const CONFIG = {
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',  ring: 'ring-amber-200',  dot: 'bg-amber-400',  label: 'Pending' },
  accepted:  { bg: 'bg-blue-50',    text: 'text-blue-700',   ring: 'ring-blue-200',   dot: 'bg-blue-400',   label: 'Accepted' },
  cooking:   { bg: 'bg-orange-50',  text: 'text-orange-700', ring: 'ring-orange-200', dot: 'bg-orange-400', label: 'Cooking' },
  ready:     { bg: 'bg-emerald-50', text: 'text-emerald-700',ring: 'ring-emerald-200',dot: 'bg-emerald-400',label: 'Ready' },
  served:    { bg: 'bg-purple-50',  text: 'text-purple-700', ring: 'ring-purple-200', dot: 'bg-purple-400', label: 'Served' },
  completed: { bg: 'bg-gray-100',   text: 'text-gray-600',   ring: 'ring-gray-200',   dot: 'bg-gray-400',   label: 'Completed' },
  cancelled: { bg: 'bg-red-50',     text: 'text-red-700',    ring: 'ring-red-200',    dot: 'bg-red-400',    label: 'Cancelled' },
  available: { bg: 'bg-emerald-50', text: 'text-emerald-700',ring: 'ring-emerald-200',dot: 'bg-emerald-400',label: 'Available' },
  occupied:  { bg: 'bg-red-50',     text: 'text-red-700',    ring: 'ring-red-200',    dot: 'bg-red-400',    label: 'Occupied' },
  reserved:  { bg: 'bg-amber-50',   text: 'text-amber-700',  ring: 'ring-amber-200',  dot: 'bg-amber-400',  label: 'Reserved' },
  cleaning:  { bg: 'bg-sky-50',     text: 'text-sky-700',    ring: 'ring-sky-200',    dot: 'bg-sky-400',    label: 'Cleaning' },
  paid:      { bg: 'bg-emerald-50', text: 'text-emerald-700',ring: 'ring-emerald-200',dot: 'bg-emerald-400',label: 'Paid' },
  unpaid:    { bg: 'bg-red-50',     text: 'text-red-700',    ring: 'ring-red-200',    dot: 'bg-red-400',    label: 'Unpaid' },
  veg:       { bg: 'bg-green-50',   text: 'text-green-700',  ring: 'ring-green-200',  dot: 'bg-green-500',  label: 'Veg' },
  'non-veg': { bg: 'bg-red-50',     text: 'text-red-700',    ring: 'ring-red-200',    dot: 'bg-red-500',    label: 'Non-Veg' },
};

export const Badge = ({ status, size = 'sm' }) => {
  const c = CONFIG[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-200', dot: 'bg-gray-400', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ring-1 rounded-full ${c.bg} ${c.text} ${c.ring} ${
      size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

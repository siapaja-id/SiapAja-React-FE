import React from 'react';

export const PropertyRow: React.FC<{ icon: React.ReactNode, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex sm:items-center items-start gap-4 py-3 border-b border-white/5 last:border-0 group">
    <div className="flex items-center gap-2 w-28 shrink-0 text-on-surface-variant sm:pt-0 pt-1">
      <div className="opacity-60">{icon}</div>
      <span className="text-1sm font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex-grow flex flex-wrap gap-2 items-center min-h-[28px]">
      {children}
    </div>
  </div>
);

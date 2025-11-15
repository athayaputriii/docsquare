import { SelectHTMLAttributes } from 'react';

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Dropdown({ children, ...props }: DropdownProps) {
  return (
    <select
      className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white"
      {...props}
    >
      {children}
    </select>
  );
}

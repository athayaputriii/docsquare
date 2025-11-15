import { ReactNode } from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
};

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-white/10 bg-slate-900 accent-cyan-400"
        {...props}
      />
      {label}
    </label>
  );
}

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-2.5 rounded-xl text-sm
              bg-[var(--color-bg-secondary)] border
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-tertiary)]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-border-focus)]
              ${error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-primary)]'}
              ${icon ? 'pl-10' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-danger)] mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

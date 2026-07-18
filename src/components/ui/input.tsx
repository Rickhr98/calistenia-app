import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'rounded-[9px] border border-line bg-surface-2 px-3 py-2 text-center font-mono text-[15px] font-bold outline-none focus:border-accent',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

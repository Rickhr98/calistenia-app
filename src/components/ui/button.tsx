import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] text-sm font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border border-line bg-surface text-ink',
        primary: 'border border-accent bg-accent text-white',
        dark: 'border border-ink bg-ink text-white',
        ghost: 'text-muted-foreground',
      },
      size: {
        default: 'px-3.5 py-2.5',
        sm: 'px-2.5 py-2',
        lg: 'px-4 py-3.5 text-[15px] justify-center',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';

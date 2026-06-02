import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error'

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-200',
  accent: 'bg-cyan-900/50 text-cyan-300',
  success: 'bg-emerald-900/50 text-emerald-300',
  warning: 'bg-amber-900/50 text-amber-300',
  error: 'bg-red-900/50 text-red-300',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

import * as React from 'react'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'default'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/20 text-success border-success/30',
  danger: 'bg-danger/20 text-danger border-danger/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  default: 'bg-muted text-muted-foreground border-border',
}

function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tracking-wide ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeProps }

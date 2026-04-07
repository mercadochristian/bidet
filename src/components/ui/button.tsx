'use client'

import * as React from 'react'

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground hover:opacity-90 active:opacity-80',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted active:bg-muted',
  ghost: 'bg-transparent text-foreground hover:bg-muted active:bg-muted',
  destructive:
    'bg-destructive text-foreground hover:opacity-90 active:opacity-80',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = '', variant = 'default', size = 'default', onClick, children, ...props },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Ripple effect
      const button = e.currentTarget
      const ripple = document.createElement('span')
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const diameter = Math.max(rect.width, rect.height) * 2

      ripple.style.cssText = `
        position: absolute;
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${x - diameter / 2}px;
        top: ${y - diameter / 2}px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 500ms ease-out forwards;
        pointer-events: none;
      `
      button.style.position = 'relative'
      button.style.overflow = 'hidden'
      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 500)

      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        className={`inline-flex cursor-pointer items-center justify-center rounded-[var(--radius)] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, PlusCircle, Info } from 'lucide-react'
import { InstallPrompt } from '@/components/install-prompt'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/submit', label: 'Submit', icon: PlusCircle, highlight: true },
  { href: '/about', label: 'About', icon: Info },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main content — bottom padding accounts for tab bar + safe area */}
      <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      {/* PWA install prompt — shown once per session after 3s delay */}
      <InstallPrompt />

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon, highlight }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? highlight
                      ? 'text-primary'
                      : 'text-primary'
                    : highlight
                    ? 'text-primary/60 hover:text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute -top-px left-1/4 right-1/4 h-0.5 rounded-full bg-primary" />
                )}
                <Icon
                  size={22}
                  className={highlight && !isActive ? 'text-primary/70' : undefined}
                />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
        {/* Subtle credit line */}
        <div className="flex items-center justify-center pb-1">
          <a
            href="https://www.instagram.com/meronbangbidet/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            Inspired by @meronbangbidet
          </a>
        </div>
      </nav>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { BidetIcon } from '@/components/icons/bidet-icon'

export function BidetLoader() {
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 450)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-card p-9 shadow-lg min-w-[220px]">
      <style>{`
        .stroke-icon svg * {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawStroke 2s ease-in-out infinite;
        }
        .stroke-icon svg *:nth-child(2) { animation-delay: 0.1s; }
        .stroke-icon svg *:nth-child(3) { animation-delay: 0.2s; }
        .stroke-icon svg *:nth-child(4) { animation-delay: 0.3s; }
        .stroke-icon svg *:nth-child(5) { animation-delay: 0.4s; }
        .stroke-icon svg *:nth-child(6) { animation-delay: 0.5s; }
        .stroke-icon svg *:nth-child(7) { animation-delay: 0.6s; }
        .stroke-icon svg *:nth-child(8) { animation-delay: 0.7s; }

        @keyframes drawStroke {
          0%   { stroke-dashoffset: 400; opacity: 0.2; }
          45%  { stroke-dashoffset: 0;   opacity: 1; }
          75%  { stroke-dashoffset: 0;   opacity: 1; }
          100% { stroke-dashoffset: -400; opacity: 0.2; }
        }
      `}</style>

      <div className="stroke-icon">
        <BidetIcon size={80} color="var(--primary)" strokeWidth={2.5} />
      </div>

      <p className="m-0 text-[13px] font-semibold text-primary tracking-wider uppercase">
        Finding bidets{'.'.repeat(dots)}
      </p>
    </div>
  )
}

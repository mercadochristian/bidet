// Single-stroke icon: toilet + magnifying glass
export function BidetIcon({
  size = 64,
  color = 'currentColor',
  strokeWidth = 2.5,
  className,
}: {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tank */}
      <rect x="18" y="4" width="22" height="12" rx="3"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Left side of bowl */}
      <path d="M13 16 Q11 33 13 37"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Right side of bowl */}
      <path d="M45 16 Q47 33 45 37"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Seat oval */}
      <ellipse cx="29" cy="33" rx="16" ry="11"
        stroke={color} strokeWidth={strokeWidth} />
      {/* Bottom bowl curve to base */}
      <path d="M13 37 Q13 46 22 48 L36 48 Q47 46 45 37"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Foot/base */}
      <path d="M19 48 L19 52 Q29 54 39 52 L39 48"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Magnifying glass lens */}
      <circle cx="61" cy="22" r="12"
        stroke={color} strokeWidth={strokeWidth} />
      {/* Magnifying glass handle */}
      <line x1="70" y1="31" x2="77" y2="42"
        stroke={color} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" />
    </svg>
  )
}

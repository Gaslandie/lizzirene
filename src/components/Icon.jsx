// Jeu d'icônes maison : traits fins, style épuré, une seule source pour tout le site.
// Usage : <Icon name="bag" size={22} />
const OUTLINE = {
  bag: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  truck: (
    <>
      <path d="M14 17V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1" />
      <path d="M9 17h3" />
      <path d="M18 17h3a1 1 0 0 0 1-1v-3.4a1 1 0 0 0-.22-.62l-2.9-3.6a1 1 0 0 0-.78-.38H14" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="16.5" cy="17.5" r="2" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="9" r="2.2" />
      <circle cx="12" cy="4.6" r="2.6" />
      <circle cx="16.2" cy="7.2" r="2.6" />
      <circle cx="14.6" cy="12" r="2.6" />
      <circle cx="9.4" cy="12" r="2.6" />
      <circle cx="7.8" cy="7.2" r="2.6" />
      <path d="M12 14.4V21" />
      <path d="M12 18.4c-1.3-1.4-2.9-1.9-4.6-1.6.4 1.7 1.8 2.8 4.6 3" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
      <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5c2.5 0 4.5 5 4.5 5s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.9 5.8L19.7 10l-5.8 1.9L12 17.7l-1.9-5.8L4.3 10l5.8-1.2z" />
      <path d="M18 15.5 18.8 18l2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8z" />
      <path d="M5 3v3M3.5 4.5h3" />
    </>
  ),
  gem: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="m11 3-3 6 4 12 4-12-3-6" />
      <path d="M2 9h20" />
    </>
  ),
  cake: (
    <>
      <path d="M20 21v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7" />
      <path d="M4 16c.7-.8 1.4-1 2-1 1.2 0 1.8 1.5 3 1.5S10.8 15 12 15s1.8 1.5 3 1.5 1.8-1.5 3-1.5c.6 0 1.3.2 2 1" />
      <path d="M2 21h20" />
      <path d="M8 9V7M12 9V6.5M16 9V7" />
      <path d="M8 4.5h.01M12 4h.01M16 4.5h.01" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M10 22v-4h4v4" />
      <path d="M8.5 6.5h.01M12 6.5h.01M15.5 6.5h.01M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01M8.5 14.5h.01M15.5 14.5h.01" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  plus: <path d="M5 12h14M12 5v14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </>
  ),
  arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
    </>
  ),
}

const FILLED = {
  star: (
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  ),
  whatsapp: (
    <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 27l6.2-1.5c1.2.6 2.5.9 3.8.9h.1c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.2 0-2.4-.3-3.5-.8l-.6-.3-3.4.8.7-3.3-.3-.6C7.4 18.6 7 16.8 7 15c0-5 4-9 9-9s9 4 9 9-4 10-9 10zm5-7.1c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" />
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
}

function Icon({ name, size = 22, strokeWidth = 1.6, className = '' }) {
  const filled = FILLED[name]
  const viewBox = name === 'whatsapp' ? '0 0 32 32' : '0 0 24 24'

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {filled || OUTLINE[name] || null}
    </svg>
  )
}

export default Icon

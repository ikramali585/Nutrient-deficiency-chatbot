import React, { useEffect, useState } from 'react'

const defaultLinks = [
  { label: 'Analysis', href: '#image-analysis' },
  { label: 'AgriBot', href: '#agribot' }
]

const NavLinkSlider = ({ links = defaultLinks, className = '', compact = false }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash
      const index = links.findIndex((link) => link.href === hash)
      if (index >= 0) setActiveIndex(index)
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [links])

  return (
    <nav className={className}>
      <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-3'}`}>
        {links.map((link, index) => {
          const isActive = index === activeIndex
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActiveIndex(index)}
              className={`rounded-md border text-center font-medium transition-colors ${
                compact ? 'px-2.5 py-1 text-sm' : 'px-4 py-1.5 text-sm'
              } ${
                isActive
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {link.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default NavLinkSlider

import NavLinkSlider from './NavLinkSlider'

const Header = () => {
  return (
    // ========Sticky site header==========
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* ====Header content container =======*/}
      <div className="mx-auto max-w-6xl px-4 py-5 sm:py-4">
        {/* ===Brand title ===*/}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-slate-900 sm:text-lg">RCND Detector</h1>
          {/* ====Mobile navigation links===== */}
          <NavLinkSlider className="shrink-0 md:hidden" compact />
          {/* ====Desktop navigation links===== */}
          <NavLinkSlider className="hidden md:block" />
        </div>
      </div>
    </header>
  )
}

export default Header

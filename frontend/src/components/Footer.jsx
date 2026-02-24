import NavLinkSlider from './NavLinkSlider'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-slate-600 sm:gap-3 sm:py-6">
        <NavLinkSlider className="md:hidden" compact />
        <NavLinkSlider className="hidden md:block" />
        <p className="text-xs leading-relaxed sm:text-sm">(c) {new Date().getFullYear()} RCND Frontend. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

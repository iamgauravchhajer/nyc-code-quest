import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 w-full">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 text-gray-900">
        <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold text-base sm:text-lg tracking-tight select-none">Questly</span>
      </a>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <button className="flex items-center gap-1.5 text-[13px] text-gray-700 hover:text-gray-900 font-medium transition-colors cursor-pointer">
          Toolkit
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <a href="#" className="text-[13px] text-gray-700 hover:text-gray-900 font-medium transition-colors">
          Plans
        </a>
        <a href="#" className="text-[13px] text-gray-700 hover:text-gray-900 font-medium transition-colors">
          News
        </a>
      </div>

      {/* Action / CTA + Hamburger */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Try It Free
        </a>
        
        {/* Hamburger Menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-900 hover:bg-gray-900/10 transition-colors cursor-pointer focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/80 backdrop-blur-xl ring-1 ring-gray-200/50 px-5 py-3 animate-fade-up z-30 shadow-xl">
          <div className="flex flex-col">
            <a
              href="#"
              className="text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-100 last:border-b-0 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Toolkit
            </a>
            <a
              href="#"
              className="text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-100 last:border-b-0 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Plans
            </a>
            <a
              href="#"
              className="text-[15px] text-gray-700 hover:text-gray-900 py-3 border-b border-gray-100 last:border-b-0 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              News
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

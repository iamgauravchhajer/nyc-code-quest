import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronDown, Menu, X, LogOut, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, organization, isAuthenticated, hasOrganization, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 w-full">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 text-gray-900">
        <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold text-base sm:text-lg tracking-tight select-none">TableOS</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <button className="flex items-center gap-1.5 text-[13px] text-gray-700 hover:text-gray-900 font-medium transition-colors cursor-pointer bg-transparent border-none">
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
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* User / Organization Info */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-gray-900 leading-tight">
                {hasOrganization ? organization.name : user.name}
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">
                {hasOrganization ? 'Owner' : 'Setup Pending'}
              </span>
            </div>

            {hasOrganization ? (
              <div 
                className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm select-none"
                title={organization.name}
              >
                {organization.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <Link
                to="/onboarding"
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all animate-pulse shadow-sm hover:shadow"
              >
                Set up Org
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 transition-colors p-1.5 sm:p-2 hover:bg-gray-100/80 rounded-xl cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/sign-in"
              className="text-[13px] text-gray-700 hover:text-gray-900 font-medium px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Try It Free
            </Link>
          </>
        )}
        
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
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200/50 px-5 py-3 animate-fade-up z-30 shadow-xl">
          <div className="flex flex-col">
            {isAuthenticated && (
              <div className="py-2.5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                  {hasOrganization ? organization.name.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {hasOrganization ? organization.name : user.name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {hasOrganization ? 'Owner' : 'Setup Pending'}
                  </p>
                </div>
              </div>
            )}
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
            {isAuthenticated ? (
              <>
                {!hasOrganization && (
                  <Link
                    to="/onboarding"
                    className="text-[15px] text-amber-600 hover:text-amber-700 py-3 border-b border-gray-100 font-medium transition-colors flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Sparkles className="w-4 h-4" />
                    Complete Setup
                  </Link>
                )}
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="text-left text-[15px] text-red-600 hover:text-red-700 py-3 font-medium transition-colors flex items-center gap-2 bg-transparent border-none cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 pb-1">
                <Link
                  to="/sign-in"
                  className="text-center text-[15px] text-gray-700 hover:text-gray-900 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="text-center text-[15px] text-white bg-gray-900 hover:bg-gray-800 py-2.5 rounded-xl transition-colors font-medium shadow-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Try It Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

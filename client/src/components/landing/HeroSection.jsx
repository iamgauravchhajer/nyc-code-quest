import { Link } from 'react-router';
import { ArrowRight, ChefHat, Zap, Shield } from 'lucide-react';
import { Navbar } from '../Navbar';
import { RestaurantDashboardMockup } from './RestaurantDashboardMockup';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0a0b]">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-b from-orange-500/10 via-red-500/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -left-64 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-500/8 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-orange-600/6 to-transparent blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Navbar */}
      <div className="relative z-20">
        <RestaurantNavbar />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-0 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs text-white/70 mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Restaurant ERP — Built for modern kitchens
        </div>

        {/* Headline */}
        <h1 className="text-white font-semibold leading-[1.06] tracking-tight text-[42px] sm:text-[60px] lg:text-[76px] xl:text-[88px] max-w-5xl animate-fade-up [animation-delay:100ms]">
          Run your restaurant{' '}
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            smarter, faster
          </span>
          .
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-white/50 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl animate-fade-up [animation-delay:220ms]">
          One unified platform for tables, orders, kitchen, billing, and your whole team.
          From the first seat to the final receipt — totally seamless.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:340ms]">
          <Link
            to="/sign-up"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold px-7 py-3 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:scale-[1.03]"
          >
            Start for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium px-7 py-3 rounded-full ring-1 ring-white/10 hover:ring-white/25 hover:bg-white/5 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Trust pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/40 animate-fade-up [animation-delay:460ms]">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Secure & role-based access</span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Real-time kitchen updates</span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1.5"><ChefHat className="w-3.5 h-3.5 text-orange-400" /> Dine-in, Takeaway & Delivery</span>
        </div>
      </div>

      {/* Dashboard Mockup */}
      <div className="relative z-10 w-[90%] sm:w-[82%] lg:w-[72%] max-w-5xl mx-auto mt-12 animate-hero-rise [animation-delay:580ms] -mb-12 sm:-mb-20 lg:-mb-28">
        <div className="rounded-t-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_-30px_100px_rgba(251,146,60,0.08)]">
          <RestaurantDashboardMockup />
        </div>
      </div>
    </section>
  );
};

// Inline restaurant-branded Navbar
const RestaurantNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 animate-fade-down">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-base tracking-tight">TableOS</span>
      </a>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-7">
        {['Features', 'Workflow', 'Roles', 'Pricing'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[13px] text-white/55 hover:text-white font-medium transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Link to="/sign-in" className="text-[13px] text-white/55 hover:text-white font-medium transition-colors hidden sm:block">
          Log in
        </Link>
        <Link
          to="/sign-up"
          className="bg-white text-gray-900 text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-orange-50 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

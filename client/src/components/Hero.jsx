import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUp, Sparkles, LogOut, ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { ScaledDashboard, DashboardMockup } from './DashboardMockup';
import { useAuth } from '../context/AuthContext';

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { organization, isAuthenticated, hasOrganization, logout } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}"`);
    }
  };

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')`,
      }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Spacer between Navbar and Content */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Hero Content Area */}
      <div className="relative z-10 w-full px-5 text-center flex flex-col items-center">
        {/* Headline */}
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px]">
          <span className="block animate-fade-up">
            Get cited.
          </span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            Effortlessly.
          </span>
        </h1>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 w-full max-w-xl"
        >
          <div className="flex items-center gap-3 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 pl-5 pr-1.5 py-1.5 shadow-sm focus-within:ring-gray-300 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What makes content rank in AI search?"
              className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none py-2"
            />
            <button
              type="submit"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white hover:scale-105 active:scale-95 transition-transform shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Submit search query"
            >
              <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </form>

        {/* Description */}
        <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
          Ship articles that answer actual customer questions 
          <br className="hidden sm:inline" /> — and be seen on{' '}
          <span className="inline-flex items-center gap-0.5 text-gray-800 font-medium">
            <Sparkles className="inline w-4 h-4 -mt-1 text-yellow-500" />
            ChatGPT
          </span>
        </p>

        {/* Setup Pending Banner */}
        {isAuthenticated && !hasOrganization && (
          <div className="animate-fade-up [animation-delay:400ms] mt-5 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md text-amber-900 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 max-w-md shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <span>Finish setting up your restaurant to unlock full features.</span>
            <Link to="/onboarding" className="underline font-bold hover:text-amber-950 flex items-center gap-0.5 shrink-0 ml-1">
              Start <ArrowRight className="w-3.5 h-3.5 inline" />
            </Link>
          </div>
        )}

        {/* Call to Actions */}
        <div className="animate-fade-up [animation-delay:460ms] mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            hasOrganization ? (
              <>
                <button
                  onClick={() => alert(`Refreshing search engine statistics for ${organization.name}...`)}
                  className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all cursor-pointer"
                >
                  Refresh Engine
                </button>
                <button
                  onClick={logout}
                  className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors bg-white/20 backdrop-blur-sm cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/onboarding"
                  className="bg-amber-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-amber-600 hover:shadow-lg transition-all animate-pulse"
                >
                  Complete Onboarding
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors bg-white/20 backdrop-blur-sm cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            )
          ) : (
            <>
              <Link
                to="/sign-up"
                className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all"
              >
                Try It Free
              </Link>
              <a
                href="#"
                className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors bg-white/20 backdrop-blur-sm"
              >
                Talk to sales
              </a>
            </>
          )}
        </div>
      </div>

      {/* Spacer between Content and Dashboard Mockup */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup Container */}
      <div className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32">
        <ScaledDashboard>
          <DashboardMockup organization={organization} />
        </ScaledDashboard>
      </div>

      {/* Grass Overlay */}
      <img
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
        alt="Decorative grass overlay"
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
      />
    </section>
  );
};

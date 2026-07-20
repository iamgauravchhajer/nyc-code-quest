import { Link } from 'react-router';
import { ArrowRight, ChefHat } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-24 px-5 bg-[#0d0d0f]">
      <div className="max-w-3xl mx-auto text-center">
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-orange-500/8 blur-3xl" />

        <div className="relative rounded-3xl bg-gradient-to-b from-orange-500/15 via-amber-500/8 to-transparent border border-orange-500/25 px-8 py-16 overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          {/* Icon */}
          <div className="relative flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h2 className="relative text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Ready to transform
            <br />
            your restaurant?
          </h2>
          <p className="relative text-white/45 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Join hundreds of restaurants already running smarter with TableOS.
            Start free — no credit card needed.
          </p>

          {/* CTAs */}
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl shadow-orange-500/25 transition-all duration-200 hover:scale-[1.03]"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white font-medium px-8 py-3.5 rounded-full ring-1 ring-white/15 hover:ring-white/30 hover:bg-white/5 transition-all duration-200"
            >
              Already have an account?
            </Link>
          </div>

          {/* Trust note */}
          <p className="relative mt-6 text-xs text-white/25">
            Free plan available forever · No credit card required · Setup in minutes
          </p>
        </div>
      </div>
    </section>
  );
};

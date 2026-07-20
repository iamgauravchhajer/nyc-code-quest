import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for small family restaurants just getting started.',
    features: [
      'Up to 10 tables',
      'Menu management',
      'Basic order tracking',
      'Billing & payments',
      '1 staff account',
      'Email support',
    ],
    cta: 'Get Started Free',
    ctaTo: '/sign-up',
    highlight: false,
    badge: null,
  },
  {
    name: 'Professional',
    price: '₹2,999',
    period: '/ month',
    description: 'For growing restaurants that need the full operations suite.',
    features: [
      'Unlimited tables',
      'Full menu & categories',
      'Kitchen display system',
      'All order types',
      'Customer management',
      'Analytics dashboard',
      'Up to 20 staff accounts',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaTo: '/sign-up',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For multi-location restaurant chains and large venues.',
    features: [
      'Multi-location support',
      'Dedicated onboarding',
      'Custom roles & permissions',
      'SLA uptime guarantee',
      'Unlimited staff accounts',
      'White-label option',
      '24/7 phone support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    ctaTo: '/sign-up',
    highlight: false,
    badge: null,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 px-5 bg-[#0a0a0b]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold text-white/60 mb-5">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Simple, transparent
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-5 text-white/40 text-lg max-w-md mx-auto">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map(({ name, price, period, description, features, cta, ctaTo, highlight, badge }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-0.5 ${
                highlight
                  ? 'bg-gradient-to-b from-orange-500/15 to-amber-500/5 border border-orange-500/35 shadow-xl shadow-orange-500/10'
                  : 'bg-white/[0.03] border border-white/[0.08]'
              }`}
            >
              {/* Badge */}
              {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    <Zap className="w-2.5 h-2.5" />
                    {badge}
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{name}</div>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-bold ${highlight ? 'text-white' : 'text-white'}`}>{price}</span>
                  <span className="text-white/35 text-sm pb-1">{period}</span>
                </div>
                <p className="text-xs text-white/40 mt-2 leading-relaxed">{description}</p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-white/60">
                    <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${highlight ? 'text-orange-400' : 'text-white/30'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={ctaTo}
                className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  highlight
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

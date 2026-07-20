import { Link } from 'react-router';
import {
  ChefHat,
  UtensilsCrossed,
  TableProperties,
  ShoppingBag,
  Receipt,
  Users,
  LayoutDashboard,
  ArrowRight,
  Check,
  Crown,
  Briefcase,
  Shirt,
  Calculator,
  IndianRupee,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

/* ─── DATA ────────────────────────────────────────────── */

const BG_IMAGE = `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')`;

const features = [
  { icon: UtensilsCrossed, title: 'Menu Management',    desc: 'Manage items, categories, pricing and availability in real time.' },
  { icon: TableProperties, title: 'Table Management',   desc: 'Track every table — Available, Occupied, Reserved, or Cleaning.' },
  { icon: ShoppingBag,     title: 'Order Management',   desc: 'Dine-in, takeaway, or delivery with a full status lifecycle.' },
  { icon: ChefHat,         title: 'Kitchen Display',    desc: 'Chefs see live orders and update status with one tap.' },
  { icon: Receipt,         title: 'Billing & Payments', desc: 'Auto-generate bills. Accept Cash, UPI, or Card.' },
  { icon: Users,           title: 'Customer Records',   desc: 'Maintain a guest database for personalised service.' },
  { icon: LayoutDashboard, title: 'Analytics',          desc: "Revenue, active tables and today's orders at a glance." },
];

const roles = [
  { icon: Crown,      title: 'Owner',    desc: 'Full access — settings, analytics, staff.' },
  { icon: Briefcase,  title: 'Manager',  desc: 'Operations, menu edits, billing oversight.' },
  { icon: Shirt,      title: 'Waiter',   desc: 'Create orders, update tables, mark served.' },
  { icon: ChefHat,    title: 'Chef',     desc: 'Kitchen queue — cooking & ready updates.' },
  { icon: Calculator, title: 'Cashier',  desc: 'Bills, discounts, and payment confirmation.' },
];

const steps = [
  { n: '01', label: 'Log in with your role',   sub: 'Owner, Manager, Waiter, Chef, or Cashier' },
  { n: '02', label: 'View & manage tables',    sub: 'Set status: Available, Occupied, Reserved, Cleaning' },
  { n: '03', label: 'Create an order',         sub: 'Dine-in, takeaway, or delivery — attach items & notes' },
  { n: '04', label: 'Send to kitchen',         sub: 'Order appears instantly on the Kitchen Display' },
  { n: '05', label: 'Mark as served',          sub: 'Waiter confirms; status updates to Completed' },
  { n: '06', label: 'Generate bill',           sub: 'Tax & discounts auto-applied, grand total calculated' },
  { n: '07', label: 'Accept payment',          sub: 'Cash, UPI, or Card — table freed for next guest' },
];

const plans = [
  {
    name: 'Free',
    price: '₹0',
    note: 'forever',
    feats: ['Up to 10 tables', 'Menu & orders', 'Basic billing', '1 staff account'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹2,999',
    note: '/ month',
    feats: ['Unlimited tables', 'Kitchen display', 'All order types', 'Customer database', 'Analytics', '20 staff accounts'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    note: '',
    feats: ['Multi-location', 'Dedicated setup', 'Custom roles', 'SLA & 24/7 support'],
    cta: 'Contact Us',
    highlight: false,
  },
];

const stats = [
  { icon: IndianRupee,    val: '₹2.4L+', lbl: 'Revenue tracked daily' },
  { icon: ShoppingBag,    val: '500+',   lbl: 'Orders managed per day' },
  { icon: Clock,          val: '99.9%',  lbl: 'System uptime' },
  { icon: CheckCircle2,   val: '5',      lbl: 'Built-in staff roles' },
];

/* ─── COMPONENT ──────────────────────────────────────── */

export const LandingPage = () => (
  <div className="min-h-screen bg-slate-50 font-sans text-gray-900 overflow-x-hidden">

    {/* ─── NAV ─── */}
    <nav className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 lg:px-12 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <a href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
          <ChefHat size={14} className="text-white" />
        </div>
        <span className="font-bold text-[15px] tracking-tight text-gray-900">TableOS</span>
      </a>

      <div className="hidden md:flex items-center gap-7">
        {['features','workflow','roles','pricing'].map(id => (
          <a key={id} href={`#${id}`}
            className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors capitalize">
            {id}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <Link to="/sign-in"
          className="hidden sm:block text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
          Log in
        </Link>
        <Link to="/sign-up"
          className="text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors px-4 py-1.5 rounded-lg">
          Get Started
        </Link>
      </div>
    </nav>

    {/* ─── HERO ─── */}
    <section
      className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-5 bg-cover bg-center"
      style={{ backgroundImage: BG_IMAGE }}
    >
      {/* Subtle overlay matching auth pages */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-md border border-white/50 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 mb-6 shadow-sm">
          <Sparkles size={12} className="text-yellow-500" />
          Restaurant ERP — Complete operations platform
        </div>

        {/* Headline */}
        <h1 className="text-[42px] sm:text-6xl lg:text-7xl font-semibold text-gray-900 leading-[1.07] tracking-tight mb-5 animate-fade-up">
          Run your restaurant<br />without the chaos.
        </h1>

        {/* Sub */}
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mb-8 animate-fade-up [animation-delay:100ms]">
          One platform for tables, orders, kitchen, billing, and your whole team.
          From first seat to final receipt.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:200ms]">
          <Link to="/sign-up"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            Start for Free <ArrowRight size={15} />
          </Link>
          <Link to="/sign-in"
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-700 text-sm font-medium px-6 py-3 rounded-xl ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-white transition-all">
            Log in
          </Link>
        </div>
      </div>
    </section>

    {/* ─── STATS ─── */}
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        {stats.map(({ icon: Icon, val, lbl }) => (
          <div key={lbl} className="flex flex-col items-center gap-1 py-8 px-4 text-center">
            <Icon size={16} className="text-indigo-500 mb-1" />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{val}</span>
            <span className="text-xs text-gray-400">{lbl}</span>
          </div>
        ))}
      </div>
    </section>

    {/* ─── FEATURES ─── */}
    <section id="features" className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">Everything in one place</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">All the tools your restaurant needs — no stitching together apps.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <Icon size={17} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── WORKFLOW ─── */}
    <section id="workflow" className="py-20 px-5 bg-white border-y border-gray-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Workflow</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">How a shift works</h2>
          <p className="text-gray-500 text-base">The full service flow — from login to payment — in 7 steps.</p>
        </div>

        <div className="flex flex-col gap-0">
          {steps.map(({ n, label, sub }, i) => (
            <div key={n}
              className={`flex items-start gap-4 p-5 rounded-xl hover:bg-slate-50 transition-colors ${i < steps.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {n}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── ROLES ─── */}
    <section id="roles" className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Access Control</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">Every role has its own view</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Five built-in roles — each person sees exactly what they need.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {roles.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-3 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <Icon size={16} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── PRICING ─── */}
    <section id="pricing" className="py-20 px-5 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">Simple, transparent pricing</h2>
          <p className="text-gray-500 text-base">Start free. Scale as you grow. No hidden fees.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 items-start">
          {plans.map(({ name, price, note, feats, cta, highlight }) => (
            <div key={name}
              className={`rounded-2xl p-6 flex flex-col gap-5 ${
                highlight
                  ? 'bg-gray-900 text-white ring-2 ring-gray-900 shadow-xl'
                  : 'bg-white border border-gray-100'
              }`}>
              {/* Name */}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>
                  {name}
                </p>
                <p className={`text-4xl font-bold tracking-tight leading-none ${highlight ? 'text-white' : 'text-gray-900'}`}>
                  {price}
                  {note && <span className={`text-sm font-normal ml-1 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>{note}</span>}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5">
                {feats.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className={`mt-0.5 shrink-0 ${highlight ? 'text-indigo-400' : 'text-indigo-500'}`} />
                    <span className={highlight ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/sign-up"
                className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition-all ${
                  highlight
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── CTA ─── */}
    <section
      className="relative py-24 px-5 bg-cover bg-center"
      style={{ backgroundImage: BG_IMAGE }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-10">
          <Sparkles size={20} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-500 text-sm mb-7">No credit card required. Setup takes minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              Start for Free <ArrowRight size={15} />
            </Link>
            <Link to="/sign-in"
              className="inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md text-gray-700 text-sm font-medium px-6 py-3 rounded-xl ring-1 ring-gray-200 hover:ring-gray-300 transition-all">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* ─── FOOTER ─── */}
    <footer className="bg-white border-t border-gray-100 px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <a href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
          <ChefHat size={12} className="text-white" />
        </div>
        <span className="font-bold text-sm text-gray-900">TableOS</span>
      </a>
      <span className="text-xs text-gray-400">© 2026 TableOS. All rights reserved.</span>
      <div className="flex gap-5">
        <Link to="/sign-in" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Log in</Link>
        <Link to="/sign-up" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Sign up</Link>
      </div>
    </footer>

  </div>
);

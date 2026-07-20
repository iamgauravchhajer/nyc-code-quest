import {
  UtensilsCrossed, TableProperties, ShoppingBag,
  ChefHat, Receipt, Users, LayoutDashboard, Smartphone
} from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Menu Management',
    description:
      'Create categories, add items with pricing, preparation times, and availability. Toggle items on/off in real time during service.',
    highlights: ['Categories & sub-menus', 'Prep time tracking', 'Live availability toggle'],
    gradient: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    tag: '⭐⭐⭐⭐⭐',
  },
  {
    icon: TableProperties,
    title: 'Table Management',
    description:
      'Visualize your floor plan. Set capacity, track status — Available, Occupied, Reserved, Cleaning — with a single click.',
    highlights: ['Floor plan view', 'Live status updates', 'Quick status switch'],
    gradient: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    tag: '⭐⭐⭐⭐⭐',
  },
  {
    icon: ShoppingBag,
    title: 'Order Management',
    description:
      'Create dine-in, takeaway, or delivery orders. Attach items, notes, quantities. Track every order through its full lifecycle.',
    highlights: ['Dine-in, Takeaway, Delivery', '7-stage order flow', 'Per-item notes'],
    gradient: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    tag: '⭐⭐⭐⭐⭐',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Display',
    description:
      'Chefs see only what matters — pending and cooking orders. Mark ready in one tap. No miscommunication, no missed tickets.',
    highlights: ['Pending & cooking queue', 'One-tap status update', 'Mark served from table'],
    gradient: 'from-red-500/20 to-rose-500/10',
    border: 'border-red-500/20',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    tag: '⭐⭐⭐⭐☆',
  },
  {
    icon: Receipt,
    title: 'Billing & Payments',
    description:
      'Auto-generate bills with tax & discounts applied. Accept Cash, UPI, or Card. Mark payments complete with full audit trail.',
    highlights: ['Tax & discount engine', 'Cash / UPI / Card', 'Payment status audit'],
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    tag: '⭐⭐⭐⭐☆',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description:
      'Maintain a customer database with name, phone, email, and address. Identify returning guests and personalize their experience.',
    highlights: ['Customer profiles', 'Order history link', 'Quick repeat order'],
    gradient: 'from-yellow-500/20 to-orange-500/10',
    border: 'border-yellow-500/20',
    iconBg: 'bg-yellow-500/15',
    iconColor: 'text-yellow-400',
    tag: '⭐⭐⭐☆☆',
  },
  {
    icon: LayoutDashboard,
    title: 'Analytics Dashboard',
    description:
      "Today's revenue, order count, active tables, and popular menu items — all at a glance. Make decisions with real data.",
    highlights: ["Today's revenue", 'Popular items', 'Active table count'],
    gradient: 'from-sky-500/20 to-blue-500/10',
    border: 'border-sky-500/20',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    tag: '⭐⭐⭐☆☆',
  },
  {
    icon: Smartphone,
    title: 'Role-Based Access',
    description:
      'Five built-in roles — Owner, Manager, Waiter, Chef, Cashier — each with tailored permissions so everyone sees exactly what they need.',
    highlights: ['5 staff roles', 'Granular permissions', 'Secure auth tokens'],
    gradient: 'from-fuchsia-500/20 to-purple-500/10',
    border: 'border-fuchsia-500/20',
    iconBg: 'bg-fuchsia-500/15',
    iconColor: 'text-fuchsia-400',
    tag: 'Security',
  },
];

export const CoreFeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-5 bg-[#0a0a0b]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-xs font-semibold text-orange-400 mb-5">
            Core Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Everything your restaurant
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              needs, built in
            </span>
          </h2>
          <p className="mt-5 text-white/45 text-lg max-w-2xl mx-auto leading-relaxed">
            From the first order to the last payment — every module you need to run
            a smooth, efficient restaurant operation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, description, highlights, gradient, border, iconBg, iconColor, tag }) => (
            <div
              key={title}
              className={`group relative rounded-2xl bg-gradient-to-b ${gradient} border ${border} p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>

              {/* Tag */}
              <div className="text-[10px] text-white/30 mb-2">{tag}</div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>

              {/* Description */}
              <p className="text-xs text-white/45 leading-relaxed mb-4">{description}</p>

              {/* Highlights */}
              <ul className="flex flex-col gap-1">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-[11px] text-white/55">
                    <span className={`w-1 h-1 rounded-full ${iconColor.replace('text-', 'bg-')} shrink-0`} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Crown, Briefcase, Shirt, ChefHat, Calculator } from 'lucide-react';

const roles = [
  {
    icon: Crown,
    role: 'Owner',
    tagline: 'Full control, complete visibility',
    description:
      'Access everything — dashboard analytics, staff management, full menu control, billing reports, and system settings.',
    permissions: ['All features unlocked', 'Revenue & analytics', 'Staff role management', 'System configuration'],
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    border: 'border-yellow-500/30',
    iconBg: 'from-yellow-500 to-amber-400',
    badge: 'Admin',
    badgeColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  },
  {
    icon: Briefcase,
    role: 'Manager',
    tagline: 'Oversight and operations',
    description:
      'Manage staff, oversee orders, update menu, monitor tables and billing. Perfect for shift managers and floor supervisors.',
    permissions: ['Orders & tables', 'Menu updates', 'Billing access', 'Staff oversight'],
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    border: 'border-blue-500/30',
    iconBg: 'from-blue-500 to-cyan-400',
    badge: 'Ops',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  },
  {
    icon: Shirt,
    role: 'Waiter',
    tagline: 'Table & order focus',
    description:
      'Create orders, update table status, mark items as served. The frontline role designed for efficient table service.',
    permissions: ['Create orders', 'View menu', 'Table status', 'Mark served'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-500/30',
    iconBg: 'from-emerald-500 to-teal-400',
    badge: 'Service',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  },
  {
    icon: ChefHat,
    role: 'Chef',
    tagline: 'Kitchen-first display',
    description:
      'See only incoming orders in the kitchen queue. Mark orders as Cooking and Ready with zero friction.',
    permissions: ['Kitchen queue view', 'Mark cooking', 'Mark ready', 'Served confirmation'],
    gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
    border: 'border-red-500/30',
    iconBg: 'from-red-500 to-rose-400',
    badge: 'Kitchen',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/25',
  },
  {
    icon: Calculator,
    role: 'Cashier',
    tagline: 'Payments made simple',
    description:
      'Generate bills, apply discounts, accept Cash/UPI/Card payments, and mark transactions complete.',
    permissions: ['Generate bills', 'Apply discounts', 'Cash/UPI/Card', 'Payment history'],
    gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    border: 'border-purple-500/30',
    iconBg: 'from-purple-500 to-fuchsia-400',
    badge: 'Finance',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  },
];

export const RolesSection = () => {
  return (
    <section id="roles" className="py-24 px-5 bg-[#0d0d0f]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold text-white/60 mb-5">
            Role-Based Access
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Every team member
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              has their own view
            </span>
          </h2>
          <p className="mt-5 text-white/40 text-lg max-w-xl mx-auto">
            5 built-in roles ensure every staff member sees exactly what they need — nothing more, nothing less.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {roles.map(({ icon: Icon, role, tagline, description, permissions, gradient, border, iconBg, badge, badgeColor }) => (
            <div
              key={role}
              className={`relative rounded-2xl bg-gradient-to-b ${gradient} border ${border} p-5 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Badge */}
              <div className={`self-start text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {badge}
              </div>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Role info */}
              <div>
                <h3 className="text-sm font-bold text-white">{role}</h3>
                <p className="text-[11px] text-white/40 mt-0.5">{tagline}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-white/40 leading-relaxed">{description}</p>

              {/* Permissions */}
              <ul className="flex flex-col gap-1.5 mt-auto">
                {permissions.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[10px] text-white/50">
                    <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    {p}
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

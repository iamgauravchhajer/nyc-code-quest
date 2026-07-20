import { LogIn, Eye, PlusCircle, UtensilsCrossed, CheckCircle2, Receipt, CreditCard } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: LogIn,
    title: 'Log In to Your Workspace',
    description: 'Authenticate with your role-based credentials. Owner, Manager, Waiter, Chef, or Cashier — each gets a tailored view.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    step: '02',
    icon: Eye,
    title: 'View & Manage Tables',
    description: 'See your live floor plan. Available, Occupied, Reserved, Cleaning — switch table status with a single tap.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    step: '03',
    icon: PlusCircle,
    title: 'Create an Order',
    description: "Select dine-in, takeaway, or delivery. Assign a table (or customer), then add menu items with quantities and special notes.",
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    step: '04',
    icon: UtensilsCrossed,
    title: 'Send to Kitchen',
    description: "The order appears instantly on the Kitchen Display. Chefs mark it 'Cooking' and then 'Ready' when done.",
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    step: '05',
    icon: CheckCircle2,
    title: 'Mark as Served',
    description: 'Waiter confirms the order is served. Status updates to Completed. The full lifecycle is logged for reporting.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    step: '06',
    icon: Receipt,
    title: 'Generate Bill',
    description: 'Cashier generates the bill with tax & discounts auto-applied. Grand total is calculated instantly.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    step: '07',
    icon: CreditCard,
    title: 'Mark Payment Complete',
    description: 'Accept Cash, UPI, or Card. Mark payment as Paid. The table is freed and ready for the next guest.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
];

export const WorkflowSection = () => {
  return (
    <section id="workflow" className="py-24 px-5 bg-gradient-to-b from-[#0a0a0b] to-[#0d0d0f]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold text-white/60 mb-5">
            Demo Flow
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            From first seat to{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              final receipt
            </span>
          </h2>
          <p className="mt-5 text-white/40 text-lg max-w-xl mx-auto">
            The entire service flow in 7 simple steps — built so your team never misses a beat.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/30 via-white/10 to-transparent hidden sm:block" />

          <div className="flex flex-col gap-6">
            {steps.map(({ step, icon: Icon, title, description, color, bg, border }) => (
              <div key={step} className="flex items-start gap-5 group">
                {/* Step bullet */}
                <div className={`relative z-10 w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>

                {/* Content */}
                <div className={`flex-1 rounded-2xl bg-white/[0.03] border ${border} p-5 hover:bg-white/[0.045] transition-colors`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={`text-[10px] font-bold tracking-widest ${color} mb-1`}>STEP {step}</div>
                      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                      <p className="text-xs text-white/45 leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

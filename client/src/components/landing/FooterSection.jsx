import { ChefHat, Globe, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router';

const links = {
  Product: ['Features', 'Workflow', 'Roles', 'Pricing'],
  Platform: ['Dashboard', 'Kitchen Display', 'Billing', 'Analytics'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export const FooterSection = () => {
  return (
    <footer className="bg-[#0a0a0b] border-t border-white/[0.06] px-5 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">TableOS</span>
            </div>
            <p className="text-xs text-white/35 leading-relaxed max-w-[220px]">
              The complete restaurant ERP — orders, kitchen, billing, and team management in one platform.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[Globe, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase mb-4">{section}</div>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.06] mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <span>© 2026 TableOS. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sign-in" className="hover:text-white/60 transition-colors">Log in</Link>
            <Link to="/sign-up" className="hover:text-white/60 transition-colors">Sign up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

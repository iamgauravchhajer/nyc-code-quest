import { useRef, useState, useEffect } from 'react';
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCw,
  Share,
  Plus,
  Copy,
  Compass,
  Layers,
  ListTodo,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Logo } from './Logo';

// ScaledDashboard wrapper using ResizeObserver to scale the 896px design width mockup to fit container
export const ScaledDashboard = ({ children }) => {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const handleResize = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const targetWidth = 896; // Fixed design width
      const currentScale = Math.min(1, containerWidth / targetWidth);
      setScale(currentScale);
      setHeight(inner.offsetHeight * currentScale);
    };

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(container);
    observer.observe(inner);

    handleResize();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: height }}
      className="w-full relative overflow-hidden"
    >
      <div
        ref={innerRef}
        style={{
          width: '896px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const DashboardMockup = ({ organization }) => {
  const orgName = organization?.name || 'CareNest';
  const orgInitial = orgName.charAt(0).toUpperCase();

  return (
    <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left font-sans select-none">
      
      {/* Title Bar / Browser Chrome */}
      <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
        
        {/* Left: Traffic Lights & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          
          <div className="flex items-center gap-2">
            <PanelLeft className="w-3.5 h-3.5 text-white/40 hover:text-white/60 cursor-pointer" />
            <div className="flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5 text-white/20" />
              <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            </div>
          </div>
        </div>

        {/* Center: Address Bar */}
        <div className="flex-1 max-w-sm mx-auto">
          <div className="bg-[#1a1a1c] rounded-md px-3 py-1 flex items-center justify-center gap-1.5 text-[10px] text-white/60 font-medium">
            <Monitor className="w-3.5 h-3.5 text-white/40" />
            <span>questly.ai</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 text-white/40">
          <RotateCw className="w-3.5 h-3.5 hover:text-white/60 cursor-pointer" />
          <Share className="w-3.5 h-3.5 hover:text-white/60 cursor-pointer" />
          <Plus className="w-3.5 h-3.5 hover:text-white/60 cursor-pointer" />
          <Copy className="w-3.5 h-3.5 hover:text-white/60 cursor-pointer" />
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex h-[490px]">
        
        {/* Sidebar (22% width) */}
        <div className="w-[22%] shrink-0 border-r border-white/5 bg-[#1e1e21] px-3 py-4 flex flex-col justify-between">
          <div>
            {/* Sidebar Logo & Grid */}
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-1.5 text-white/80">
                <Logo className="w-4 h-4 text-white/70" />
                <span className="text-[10px] font-bold tracking-tight">Questly</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-white/30" />
            </div>

            {/* Workspace Badge */}
            <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg bg-white/5 border border-white/5 mb-6">
              <div className="w-4 h-4 rounded bg-[#e8553f] flex items-center justify-center text-[9px] text-white font-bold select-none shrink-0">
                {orgInitial}
              </div>
              <span className="text-[10px] text-white/80 font-medium truncate">{orgName}</span>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex flex-col gap-1">
              <div className="text-[8px] tracking-wider text-white/25 font-bold mb-1 px-2 select-none">DISCOVERY</div>
              <div className="text-[10px] text-white/80 bg-white/5 flex items-center gap-2 px-2 py-1.5 rounded font-medium cursor-pointer">
                <Compass className="w-3.5 h-3.5 text-white/70" />
                <span>Uncover</span>
              </div>
              <div className="text-[10px] text-white/60 hover:text-white/90 hover:bg-white/[0.03] flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer">
                <Layers className="w-3.5 h-3.5 text-white/40" />
                <span>Subjects</span>
              </div>
              <div className="text-[10px] text-white/60 hover:text-white/90 hover:bg-white/[0.03] flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer">
                <ListTodo className="w-3.5 h-3.5 text-white/40" />
                <span>Inbox</span>
              </div>
            </div>

            {/* Recent Articles */}
            <div className="mt-6">
              <div className="text-[8px] tracking-wider text-white/25 font-bold mb-2 px-2 select-none">RELEASED</div>
              <div className="flex flex-col gap-1.5 px-2">
                <div className="flex items-center gap-2 text-[9px] text-white/65 hover:text-white transition-colors cursor-pointer truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                  <span className="truncate">Elder Care Guide 2026</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/65 hover:text-white transition-colors cursor-pointer truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                  <span className="truncate">Home Safety Tips for Seniors</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/65 hover:text-white transition-colors cursor-pointer truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                  <span className="truncate">Choosing Assisted Living</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="px-2 pt-2 border-t border-white/5 text-[9px] text-white/35 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>v1.0.4 - Developer Mode</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#151517] px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#e8553f] flex items-center justify-center text-sm text-white font-bold shadow-md">
                {orgInitial}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  {orgName} Workspace
                  <span className="text-[8px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded">Pro</span>
                </h2>
                <p className="text-[10px] text-white/45">Search discovery engine configuration active</p>
              </div>
            </div>

            <button className="bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-md px-3 py-1 flex items-center gap-1.5 text-[10px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <Sparkles className="w-3 h-3 text-[#febc2e]" />
              <span>Generate Articles</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.02] ring-1 ring-white/5 py-3.5">
            {/* RELEASED */}
            <div className="px-4">
              <span className="text-[8px] tracking-wider text-white/35 font-semibold block mb-0.5">RELEASED</span>
              <span className="text-xl font-medium text-white block leading-tight">62</span>
              <span className="text-[8px] text-white/45 font-medium">Posts indexed</span>
            </div>
            {/* BREADTH */}
            <div className="px-4">
              <span className="text-[8px] tracking-wider text-white/35 font-semibold block mb-0.5">BREADTH</span>
              <span className="text-xl font-medium text-white block leading-tight">12</span>
              <span className="text-[8px] text-white/45 font-medium">Subject groups</span>
            </div>
            {/* REMAINING */}
            <div className="px-4">
              <span className="text-[8px] tracking-wider text-white/35 font-semibold block mb-0.5">REMAINING</span>
              <span className="text-xl font-medium text-white block leading-tight">412</span>
              <span className="text-[8px] text-white/45 font-medium">Ready to draft</span>
            </div>
            {/* MAX REACH */}
            <div className="px-4">
              <span className="text-[8px] tracking-wider text-white/35 font-semibold block mb-0.5">MAX REACH</span>
              <span className="text-xl font-medium text-white block leading-tight">3.1M</span>
              <span className="text-[8px] text-white/45 font-medium">Searches / mo</span>
            </div>
          </div>

          {/* Subject Cards */}
          <div>
            <div className="text-[9px] tracking-wider text-white/35 font-bold mb-2 select-none">ACTIVE SUBJECT GROUPS</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/[0.02] hover:bg-white/[0.04] ring-1 ring-white/5 p-3 flex flex-col gap-1 transition-colors cursor-pointer">
                <span className="text-[10px] font-semibold text-white/90">Elder Care</span>
                <div className="flex items-center justify-between text-[9px] text-white/45 mt-1.5">
                  <span>24 Articles</span>
                  <span className="text-[#28c840]">88% Match</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.02] hover:bg-white/[0.04] ring-1 ring-white/5 p-3 flex flex-col gap-1 transition-colors cursor-pointer">
                <span className="text-[10px] font-semibold text-white/90">Mobility</span>
                <div className="flex items-center justify-between text-[9px] text-white/45 mt-1.5">
                  <span>18 Articles</span>
                  <span className="text-[#28c840]">94% Match</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.02] hover:bg-white/[0.04] ring-1 ring-white/5 p-3 flex flex-col gap-1 transition-colors cursor-pointer">
                <span className="text-[10px] font-semibold text-white/90">Home Safety</span>
                <div className="flex items-center justify-between text-[9px] text-white/45 mt-1.5">
                  <span>20 Articles</span>
                  <span className="text-[#febc2e]">76% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drafting Inbox Table */}
          <div>
            <div className="text-[9px] tracking-wider text-white/35 font-bold mb-2 select-none">DRAFTING INBOX</div>
            <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[8px] text-white/35 font-semibold tracking-wider bg-white/[0.01]">
                    <th className="py-2 px-3">QUESTION</th>
                    <th className="py-2 px-2 text-right">VOLUME</th>
                    <th className="py-2 px-2 text-center">DIFFICULTY</th>
                    <th className="py-2 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[9px]">
                  <tr className="hover:bg-white/[0.01] transition-colors text-white/80">
                    <td className="py-2 px-3 truncate max-w-[200px]">How to test elder home safety sensors?</td>
                    <td className="py-2 px-2 text-right text-white/60">3,400</td>
                    <td className="py-2 px-2 text-center text-white/60">Easy</td>
                    <td className="py-2 px-3 text-right text-[#febc2e]/80 font-medium">Drafting</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors text-white/80">
                    <td className="py-2 px-3 truncate max-w-[200px]">What is the best wheelchair ramp slope?</td>
                    <td className="py-2 px-2 text-right text-white/60">12,600</td>
                    <td className="py-2 px-2 text-center text-white/60">Medium</td>
                    <td className="py-2 px-3 text-right text-[#28c840]/80 font-medium">Ready</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors text-white/80">
                    <td className="py-2 px-3 truncate max-w-[200px]">Does Medicare cover bath safety bars?</td>
                    <td className="py-2 px-2 text-right text-white/60">48,000</td>
                    <td className="py-2 px-2 text-center text-white/60">Hard</td>
                    <td className="py-2 px-3 text-right text-[#28c840]/80 font-medium">Ready</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors text-white/80">
                    <td className="py-2 px-3 truncate max-w-[200px]">How to help parents transition to assisted living?</td>
                    <td className="py-2 px-2 text-right text-white/60">9,200</td>
                    <td className="py-2 px-2 text-center text-white/60">Medium</td>
                    <td className="py-2 px-3 text-right text-[#febc2e]/80 font-medium">Drafting</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors text-white/80">
                    <td className="py-2 px-3 truncate max-w-[200px]">Elderly mobility aids for small apartments</td>
                    <td className="py-2 px-2 text-right text-white/60">5,800</td>
                    <td className="py-2 px-2 text-center text-white/60">Easy</td>
                    <td className="py-2 px-3 text-right text-white/35 font-medium">In Queue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Phone,
  MapPin,
  Settings,
  FileText,
  Sparkles,
  Globe,
  Clock,
  ImageIcon,
  Hash,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';

/* ─── Step metadata ──────────────────────────────────────────── */
const STEPS = [
  {
    id: 1,
    label: 'General Info',
    icon: Building2,
    hint: 'Tell us about your organization',
    color: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-50',
    ring: 'ring-violet-200',
  },
  {
    id: 2,
    label: 'Contact Details',
    icon: Phone,
    hint: 'How can customers reach you?',
    color: 'from-sky-500 to-cyan-500',
    bg: 'bg-sky-50',
    ring: 'ring-sky-200',
  },
  {
    id: 3,
    label: 'Address',
    icon: MapPin,
    hint: 'Where is your business located?',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
  },
  {
    id: 4,
    label: 'Operations',
    icon: Settings,
    hint: 'Working hours & preferences',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
  },
  {
    id: 5,
    label: 'IDs & Assets',
    icon: FileText,
    hint: 'Compliance docs & brand visuals',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    ring: 'ring-rose-200',
  },
];

const TOTAL = STEPS.length;

/* ─── Reusable field components (defined outside to avoid remount) ── */
function FieldWrap({ label, hint, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1.5">
          <span className="w-1 h-1 bg-rose-400 rounded-full shrink-0 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors pointer-events-none" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white/60 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-800 focus:bg-white transition-all ${className}`}
      />
    </div>
  );
}

function StyledSelect({ icon: Icon, children, className = '', ...props }) {
  return (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors pointer-events-none" />
      )}
      <select
        {...props}
        className={`w-full appearance-none ${Icon ? 'pl-10' : 'pl-4'} pr-8 py-2.5 bg-white/60 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-800 focus:bg-white transition-all cursor-pointer ${className}`}
      >
        {children}
      </select>
      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 rotate-90 pointer-events-none" />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Ref to the inner scrollable div — not the outer card
  const scrollAreaRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    type: 'restaurant',
    description: '',
    phone: '',
    website: '',
    address: { line1: '', line2: '', city: '', state: '', country: '', pincode: '' },
    gstNumber: '',
    fssaiNumber: '',
    panNumber: '',
    tableCount: 10,
    openingTime: '09:00',
    closingTime: '22:00',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    logo: '',
    banner: '',
  });

  const setField = useCallback((name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  const setAddr = useCallback((field, value) => {
    setForm((p) => ({ ...p, address: { ...p.address, [field]: value } }));
  }, []);

  const clearErr = useCallback((key) => {
    setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }, []);

  // Memoised per-step validator
  const validate = useCallback((currentStep, currentForm) => {
    const errs = {};
    if (currentStep === 1) {
      if (!currentForm.name || currentForm.name.trim().length < 3)
        errs.name = 'Organization name must be at least 3 characters';
      if (!currentForm.description || currentForm.description.trim().length < 10)
        errs.description = 'Description must be at least 10 characters';
    }
    if (currentStep === 2) {
      if (!currentForm.phone.trim()) {
        errs.phone = 'Phone number is required';
      } else {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
        if (!phoneRegex.test(currentForm.phone.trim())) {
          errs.phone = 'Invalid phone number format';
        }
      }
      if (currentForm.website && currentForm.website.trim()) {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (!urlRegex.test(currentForm.website.trim())) {
          errs.website = 'Invalid website URL format';
        }
      }
    }
    if (currentStep === 3) {
      if (!currentForm.address.line1 || !currentForm.address.line1.trim())
        errs.line1 = 'Street Address Line 1 is required';
      if (!currentForm.address.city || !currentForm.address.city.trim())
        errs.city = 'City is required';
      if (!currentForm.address.state || !currentForm.address.state.trim())
        errs.state = 'State is required';
      if (!currentForm.address.country || !currentForm.address.country.trim())
        errs.country = 'Country is required';
      if (!currentForm.address.pincode || !currentForm.address.pincode.trim()) {
        errs.pincode = 'Pincode / ZIP code is required';
      } else if (currentForm.address.pincode.trim().length < 3 || currentForm.address.pincode.trim().length > 10) {
        errs.pincode = 'Pincode / ZIP must be between 3 and 10 characters';
      }
    }
    if (currentStep === 4) {
      if (!currentForm.openingTime) {
        errs.openingTime = 'Opening time is required';
      }
      if (!currentForm.closingTime) {
        errs.closingTime = 'Closing time is required';
      }
      if (currentForm.openingTime && currentForm.closingTime && currentForm.openingTime === currentForm.closingTime) {
        errs.closingTime = 'Closing time cannot be the same as opening time';
      }
      if (currentForm.tableCount === '' || Number(currentForm.tableCount) <= 0) {
        errs.tableCount = 'Table count must be greater than 0';
      }
    }
    if (currentStep === 5) {
      if (currentForm.gstNumber && currentForm.gstNumber.trim()) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(currentForm.gstNumber.trim().toUpperCase())) {
          errs.gstNumber = 'Invalid GST number format';
        }
      }
      if (currentForm.fssaiNumber && currentForm.fssaiNumber.trim()) {
        const fssaiRegex = /^\d{14}$/;
        if (!fssaiRegex.test(currentForm.fssaiNumber.trim())) {
          errs.fssaiNumber = 'FSSAI number must be exactly 14 digits';
        }
      }
      if (currentForm.panNumber && currentForm.panNumber.trim()) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(currentForm.panNumber.trim().toUpperCase())) {
          errs.panNumber = 'Invalid PAN format';
        }
      }
      if (currentForm.logo && currentForm.logo.trim()) {
        try {
          new URL(currentForm.logo.trim());
        } catch (e) {
          errs.logo = 'Invalid logo URL format';
        }
      }
      if (currentForm.banner && currentForm.banner.trim()) {
        try {
          new URL(currentForm.banner.trim());
        } catch (e) {
          errs.banner = 'Invalid banner URL format';
        }
      }
    }
    return errs;
  }, []);

  const transition = useCallback((newStep, dir) => {
    setDirection(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(newStep);
      setFieldErrors({});
      setVisible(true);
      // Scroll the inner scrollable area — not the outer card
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
      }
    }, 200);
  }, []);

  const advance = useCallback(() => {
    // Read step + form from state via functional update to avoid stale closure
    setForm((currentForm) => {
      setStep((currentStep) => {
        const errs = validate(currentStep, currentForm);
        if (Object.keys(errs).length) {
          setFieldErrors(errs);
          return currentStep; // no change
        }
        if (currentStep < TOTAL) {
          transition(currentStep + 1, 'forward');
        }
        return currentStep;
      });
      return currentForm;
    });
  }, [validate, transition]);

  const retreat = useCallback(() => {
    setStep((s) => {
      if (s > 1) transition(s - 1, 'back');
      return s;
    });
  }, [transition]);

  // Keyboard: Enter to advance — stable deps, no stale closure
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter' || e.shiftKey) return;
      const tag = document.activeElement?.tagName;
      // Don't intercept Enter inside textarea or select
      if (tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
      advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFieldErrors({});
    setForm((currentForm) => {
      (async () => {
        const payload = {
          name: currentForm.name,
          type: currentForm.type || undefined,
          description: currentForm.description,
          phone: currentForm.phone,
          website: currentForm.website || undefined,
          address: currentForm.address,
          openingTime: currentForm.openingTime,
          closingTime: currentForm.closingTime,
          tableCount: Number(currentForm.tableCount),
          currency: currentForm.currency,
          timezone: currentForm.timezone,
          gstNumber: currentForm.gstNumber || undefined,
          fssaiNumber: currentForm.fssaiNumber || undefined,
          panNumber: currentForm.panNumber || undefined,
          logo: currentForm.logo || undefined,
          banner: currentForm.banner || undefined,
        };
        try {
          await axios.post('/api/organizations', payload, { withCredentials: true });
          setDone(true);
          setTimeout(() => navigate('/'), 2400);
        } catch (err) {
          setFieldErrors({
            _submit:
              err.response?.data?.message || 'Something went wrong. Please try again.',
          });
        } finally {
          setLoading(false);
        }
      })();
      return currentForm;
    });
  }, [navigate]);

  const current = STEPS[step - 1];
  const progress = Math.round((step / TOTAL) * 100);

  // Direction-aware animation class — only swap during transitions
  const animClass = visible
    ? direction === 'forward'
      ? 'animate-slide-in-right'
      : 'animate-slide-in-left'
    : 'opacity-0';

  /* ─── Success screen ──────────────────────────────────────── */
  if (done) {
    return (
      <div
        className="h-screen w-screen overflow-hidden flex items-center justify-center font-sans"
        style={{
          backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4 animate-pop-in">
          <div className="w-20 h-20 rounded-full bg-green-400 flex items-center justify-center shadow-[0_0_60px_rgba(74,222,128,0.4)]">
            <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">You're all set!</h2>
            <p className="text-white/60 mt-2 text-sm">Taking you to your dashboard…</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Main layout ─────────────────────────────────────────── */
  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col font-sans"
      style={{
        backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[3px]" />

      {/* ── Cancel / Back Button ─────────────────────────────── */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 hover:ring-gray-300 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel setup
        </button>
      </div>

      {/* ── Top progress bar ─────────────────────────────────── */}
      <div className="relative z-20 w-full px-4 pt-5 pb-4">
        <div className="max-w-[540px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br ${current.color}`}>
                <current.icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-xs font-semibold tracking-wide">
                {current.label}
              </span>
            </div>
            <span className="text-white/60 text-xs font-medium">
              {step} / {TOTAL}
            </span>
          </div>
          <div className="h-1 w-full bg-white/15 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${current.color} transition-[width] duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-6 overflow-hidden">

        {/* Card wrapper — handles animation at this level */}
        <div
          className={`w-full max-w-[540px] bg-white/82 backdrop-blur-2xl border border-white/60 shadow-[0_24px_80px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden ${animClass}`}
          style={{ maxHeight: 'calc(100vh - 9rem)', transition: 'opacity 0.2s ease' }}
        >

          {/* Scrollable inner area */}
          <div
            ref={scrollAreaRef}
            className="overflow-y-auto scroll-hide"
            style={{ maxHeight: 'calc(100vh - 9rem)' }}
          >
            <div className="p-6 sm:p-8">
              {/* Step header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${current.color} shadow-md shrink-0`}
                  >
                    <current.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                      Step {step} of {TOTAL}
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                      {current.label}
                    </h2>
                  </div>
                </div>

                {step === TOTAL && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="shrink-0 text-[11px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer disabled:pointer-events-none"
                  >
                    Skip &amp; finish
                  </button>
                )}
              </div>

              {/* Global submit error */}
              {fieldErrors._submit && (
                <div className="mb-5 px-4 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
                  {fieldErrors._submit}
                </div>
              )}

              {/* ── Step 1: General Info ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <FieldWrap label="Organization Name" required error={fieldErrors.name}>
                    <Input
                      icon={Building2}
                      name="name"
                      type="text"
                      autoFocus
                      autoComplete="organization"
                      placeholder="e.g. The Grand Bistro"
                      value={form.name}
                      onChange={(e) => { setField('name', e.target.value); clearErr('name'); }}
                    />
                  </FieldWrap>

                  <FieldWrap
                    label="Description"
                    required
                    hint={`${form.description.length}/200`}
                    error={fieldErrors.description}
                  >
                    <textarea
                      rows={4}
                      maxLength={200}
                      placeholder="A short description of your organization (min 10 chars)..."
                      value={form.description}
                      onChange={(e) => { setField('description', e.target.value); clearErr('description'); }}
                      className="w-full px-4 py-2.5 bg-white/60 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-800 focus:bg-white transition-all resize-none"
                    />
                  </FieldWrap>
                </div>
              )}

              {/* ── Step 2: Contact ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <FieldWrap label="Phone Number" required error={fieldErrors.phone}>
                    <Input
                      icon={Phone}
                      name="phone"
                      type="tel"
                      autoFocus
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => { setField('phone', e.target.value); clearErr('phone'); }}
                    />
                  </FieldWrap>

                  <FieldWrap label="Website URL" hint="optional" error={fieldErrors.website}>
                    <Input
                      icon={Globe}
                      name="website"
                      type="url"
                      autoComplete="url"
                      placeholder="https://yourrestaurant.com"
                      value={form.website}
                      onChange={(e) => { setField('website', e.target.value); clearErr('website'); }}
                    />
                  </FieldWrap>
                </div>
              )}

              {/* ── Step 3: Address ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <FieldWrap label="Street Address Line 1" required error={fieldErrors.line1}>
                    <Input
                      icon={MapPin}
                      type="text"
                      autoFocus
                      autoComplete="address-line1"
                      placeholder="123 Main Street"
                      value={form.address.line1}
                      onChange={(e) => { setAddr('line1', e.target.value); clearErr('line1'); }}
                    />
                  </FieldWrap>

                  <FieldWrap label="Street Address Line 2" hint="optional" error={fieldErrors.line2}>
                    <Input
                      type="text"
                      autoComplete="address-line2"
                      placeholder="Suite, Floor, Landmark…"
                      value={form.address.line2}
                      onChange={(e) => { setAddr('line2', e.target.value); clearErr('line2'); }}
                    />
                  </FieldWrap>

                  <div className="grid grid-cols-2 gap-3.5">
                    <FieldWrap label="City" required error={fieldErrors.city}>
                      <Input
                        type="text"
                        autoComplete="address-level2"
                        placeholder="Mumbai"
                        value={form.address.city}
                        onChange={(e) => { setAddr('city', e.target.value); clearErr('city'); }}
                      />
                    </FieldWrap>
                    <FieldWrap label="State" required error={fieldErrors.state}>
                      <Input
                        type="text"
                        autoComplete="address-level1"
                        placeholder="Maharashtra"
                        value={form.address.state}
                        onChange={(e) => { setAddr('state', e.target.value); clearErr('state'); }}
                      />
                    </FieldWrap>
                    <FieldWrap label="Country" required error={fieldErrors.country}>
                      <Input
                        type="text"
                        autoComplete="country-name"
                        placeholder="India"
                        value={form.address.country}
                        onChange={(e) => { setAddr('country', e.target.value); clearErr('country'); }}
                      />
                    </FieldWrap>
                    <FieldWrap label="Pincode / ZIP" required error={fieldErrors.pincode}>
                      <Input
                        type="text"
                        autoComplete="postal-code"
                        placeholder="400001"
                        value={form.address.pincode}
                        onChange={(e) => { setAddr('pincode', e.target.value); clearErr('pincode'); }}
                      />
                    </FieldWrap>
                  </div>
                </div>
              )}

              {/* ── Step 4: Operations ── */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3.5">
                    <FieldWrap label="Opening Time" required error={fieldErrors.openingTime}>
                      <Input
                        icon={Clock}
                        type="time"
                        name="openingTime"
                        autoFocus
                        value={form.openingTime}
                        onChange={(e) => { setField('openingTime', e.target.value); clearErr('openingTime'); }}
                      />
                    </FieldWrap>
                    <FieldWrap label="Closing Time" required error={fieldErrors.closingTime}>
                      <Input
                        icon={Clock}
                        type="time"
                        name="closingTime"
                        value={form.closingTime}
                        onChange={(e) => { setField('closingTime', e.target.value); clearErr('closingTime'); }}
                      />
                    </FieldWrap>
                  </div>

                  <FieldWrap label="Number of Tables" required error={fieldErrors.tableCount}>
                    <Input
                      icon={Hash}
                      type="number"
                      name="tableCount"
                      min={1}
                      max={999}
                      value={form.tableCount}
                      onChange={(e) => { setField('tableCount', e.target.value); clearErr('tableCount'); }}
                    />
                  </FieldWrap>

                  <FieldWrap label="Currency">
                    <StyledSelect
                      name="currency"
                      value={form.currency}
                      onChange={(e) => setField('currency', e.target.value)}
                    >
                      <option value="INR">🇮🇳  INR — Indian Rupee (₹)</option>
                      <option value="USD">🇺🇸  USD — US Dollar ($)</option>
                      <option value="EUR">🇪🇺  EUR — Euro (€)</option>
                      <option value="GBP">🇬🇧  GBP — British Pound (£)</option>
                      <option value="AED">🇦🇪  AED — UAE Dirham (د.إ)</option>
                      <option value="SGD">🇸🇬  SGD — Singapore Dollar (S$)</option>
                    </StyledSelect>
                  </FieldWrap>

                  <FieldWrap label="Timezone">
                    <StyledSelect
                      name="timezone"
                      value={form.timezone}
                      onChange={(e) => setField('timezone', e.target.value)}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata — IST (UTC +5:30)</option>
                      <option value="UTC">UTC — Coordinated Universal Time</option>
                      <option value="America/New_York">America/New_York — EST (UTC −5)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles — PST (UTC −8)</option>
                      <option value="Europe/London">Europe/London — GMT (UTC +0)</option>
                      <option value="Europe/Paris">Europe/Paris — CET (UTC +1)</option>
                      <option value="Asia/Dubai">Asia/Dubai — GST (UTC +4)</option>
                      <option value="Asia/Singapore">Asia/Singapore — SGT (UTC +8)</option>
                    </StyledSelect>
                  </FieldWrap>
                </div>
              )}

              {/* ── Step 5: IDs & Assets ── */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${current.bg} ${current.ring} ring-1 space-y-3.5`}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Compliance Numbers{' '}
                      <span className="normal-case font-normal text-gray-400">(all optional)</span>
                    </p>
                    <FieldWrap label="GST Number" hint="15 chars" error={fieldErrors.gstNumber}>
                      <Input
                        icon={Hash}
                        name="gstNumber"
                        type="text"
                        maxLength={15}
                        autoFocus
                        placeholder="22AAAAA0000A1Z5"
                        value={form.gstNumber}
                        onChange={(e) => { setField('gstNumber', e.target.value.toUpperCase()); clearErr('gstNumber'); }}
                        className="uppercase tracking-widest"
                      />
                    </FieldWrap>
                    <FieldWrap label="FSSAI Number" hint="14 chars" error={fieldErrors.fssaiNumber}>
                      <Input
                        icon={Hash}
                        name="fssaiNumber"
                        type="text"
                        maxLength={14}
                        placeholder="12345678901234"
                        value={form.fssaiNumber}
                        onChange={(e) => { setField('fssaiNumber', e.target.value); clearErr('fssaiNumber'); }}
                      />
                    </FieldWrap>
                    <FieldWrap label="PAN Number" hint="10 chars" error={fieldErrors.panNumber}>
                      <Input
                        icon={Hash}
                        name="panNumber"
                        type="text"
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        value={form.panNumber}
                        onChange={(e) => { setField('panNumber', e.target.value.toUpperCase()); clearErr('panNumber'); }}
                        className="uppercase tracking-widest"
                      />
                    </FieldWrap>
                  </div>

                  <FieldWrap label="Logo Image URL" hint="optional" error={fieldErrors.logo}>
                    <Input
                      icon={ImageIcon}
                      name="logo"
                      type="url"
                      placeholder="https://yourdomain.com/logo.png"
                      value={form.logo}
                      onChange={(e) => { setField('logo', e.target.value); clearErr('logo'); }}
                    />
                  </FieldWrap>

                  <FieldWrap label="Banner Image URL" hint="optional" error={fieldErrors.banner}>
                    <Input
                      icon={ImageIcon}
                      name="banner"
                      type="url"
                      placeholder="https://yourdomain.com/banner.jpg"
                      value={form.banner}
                      onChange={(e) => { setField('banner', e.target.value); clearErr('banner'); }}
                    />
                  </FieldWrap>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-7 pt-5 border-t border-gray-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={retreat}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < TOTAL ? (
                  <button
                    type="button"
                    onClick={advance}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${current.color} hover:opacity-90 active:scale-[0.97] transition-all cursor-pointer shadow-md`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 active:scale-[0.97] transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                        Complete Setup
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

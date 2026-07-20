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
  Upload,
  Trash2,
} from 'lucide-react';
import axios from 'axios';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { uploadToImageKit } from '../api/imagekit';


/* ─── Step metadata ──────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'General Info',    icon: Building2 },
  { id: 2, label: 'Contact Details', icon: Phone },
  { id: 3, label: 'Address',         icon: MapPin },
  { id: 4, label: 'Operations',      icon: Settings },
  { id: 5, label: 'IDs & Assets',    icon: FileText },
];

const TOTAL = STEPS.length;

function FieldWrap({ label, hint, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1.5 animate-fade-down">
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
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors pointer-events-none" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white/50 border border-gray-200/80 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all ${className}`}
      />
    </div>
  );
}


/* ─── Main component ─────────────────────────────────────────── */
export const Onboarding = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
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

  const handleFileUpload = useCallback(async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: 'Image size must be less than 2MB',
      }));
      return;
    }

    try {
      const fileName = `${field}-${Date.now()}-${file.name}`;
      const imageUrl = await uploadToImageKit(file, fileName);

      setForm((p) => ({ ...p, [field]: imageUrl }));
      setFieldErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    } catch (err) {
      console.error(err);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: 'Failed to upload image to ImageKit',
      }));
    }
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
        // eslint-disable-next-line no-useless-escape
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
          await refreshAuth();
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
  }, [navigate, refreshAuth]);

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
      className="h-screen w-screen overflow-hidden bg-cover bg-center flex flex-col justify-center items-center px-4 relative font-sans"
      style={{
        backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')`,
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

      {/* ── Cancel / Back Button ─────────────────────────────── */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 hover:ring-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Cancel setup
        </button>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[480px] sm:max-w-[520px] flex flex-col items-center overflow-hidden animate-fade-up">

        {/* Brand header — matches sign-in/sign-up */}
        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-2 text-gray-900 mb-1.5">
            <Logo className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="font-bold text-xl sm:text-2xl tracking-tight">TableOS</span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Set up your restaurant
          </p>
        </div>

        {/* Card wrapper — handles animation at this level */}
        <div
          className={`w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden ${animClass}`}
          style={{ maxHeight: 'calc(100vh - 10rem)', transition: 'opacity 0.2s ease' }}
        >
          {/* Progress bar */}
          <div className="h-1 w-full bg-gray-200/60 shrink-0">
            <div
              className="h-full bg-gray-900 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Scrollable inner area */}
          <div
            ref={scrollAreaRef}
            className="overflow-y-auto scroll-hide"
            style={{ maxHeight: 'calc(100vh - 10rem - 4px)' }}
          >
            <div className="p-6 sm:p-8">
              {/* Step header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-900 shrink-0">
                    <current.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Step {step} of {TOTAL}
                    </p>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight leading-tight">
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

                  <FieldWrap label="Website URL" error={fieldErrors.website}>
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

                  <FieldWrap label="Street Address Line 2" error={fieldErrors.line2}>
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
                </div>
              )}

              {/* ── Step 5: IDs & Assets ── */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${current.bg} ${current.ring} ring-1 space-y-3.5`}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Compliance Numbers
                    </p>
                    <FieldWrap label="GST Number" error={fieldErrors.gstNumber}>
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
                    <FieldWrap label="FSSAI Number" error={fieldErrors.fssaiNumber}>
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
                    <FieldWrap label="PAN Number" error={fieldErrors.panNumber}>
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

                  <FieldWrap label="Logo Image" hint="Max 2MB" error={fieldErrors.logo}>
                    <div className="flex items-center gap-4">
                      {form.logo ? (
                        <div className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                          <img src={form.logo} alt="Logo preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setField('logo', '')}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none outline-none"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-dashed border-gray-200 bg-white/50 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="hidden"
                        />
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-98 transition-all cursor-pointer shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          {form.logo ? 'Change Logo' : 'Upload Logo'}
                        </div>
                      </label>
                    </div>
                  </FieldWrap>

                  <FieldWrap label="Banner Image" hint="Max 2MB" error={fieldErrors.banner}>
                    <div className="space-y-3">
                      {form.banner ? (
                        <div className="relative group w-full h-24 rounded-xl overflow-hidden border border-gray-200 bg-white">
                          <img src={form.banner} alt="Banner preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setField('banner', '')}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none outline-none"
                          >
                            <Trash2 className="w-4.5 h-4.5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-xl border border-dashed border-gray-200 bg-white/50 flex flex-col items-center justify-center gap-1.5">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                          <span className="text-[10px] text-gray-400">No banner selected</span>
                        </div>
                      )}
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'banner')}
                          className="hidden"
                        />
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-98 transition-all cursor-pointer shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          {form.banner ? 'Change Banner' : 'Upload Banner'}
                        </div>
                      </label>
                    </div>
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
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
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

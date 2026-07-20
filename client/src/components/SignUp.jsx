import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      alert(`Account created successfully for ${formData.name}!`);
    } else {
      alert(`Logged in successfully as ${formData.email}!`);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans"
      style={{
        backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')`,
      }}
    >
      {/* Decorative Blur Background Filter */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 hover:ring-gray-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-[440px] animate-fade-up">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 text-gray-900 mb-2">
            <Logo className="w-7 h-7" />
            <span className="font-bold text-2xl tracking-tight">Questly</span>
          </div>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" /> Get cited effortlessly
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6 text-center">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignUp}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/80 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/80 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/80 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
            >
              {isSignUp ? 'Get started' : 'Sign in'}
            </button>
          </form>

          {/* Toggle Section */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">
              {isSignUp ? 'Already have an account? ' : "Don't have an account yet? "}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-gray-900 hover:underline cursor-pointer"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { Hero } from './components/Hero';
import { CoreFeatures } from './components/CoreFeatures';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Onboarding } from './pages/Onboarding';
import { AuthProvider, useAuth } from './context/AuthContext';

import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Menu } from './pages/dashboard/Menu';
import { Tables } from './pages/dashboard/Tables';
import { Orders } from './pages/dashboard/Orders';
import { Kitchen } from './pages/dashboard/Kitchen';
import { Billing } from './pages/dashboard/Billing';
import { Customers } from './pages/dashboard/Customers';
import PublicMenu from './pages/PublicMenu';

// Protects onboarding page - user must be logged in but must NOT have an organization
const OnboardingRoute = ({ children }) => {
  const { isAuthenticated, hasOrganization, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')` }}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <div className="relative z-10 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (hasOrganization) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Redirects logged in users away from auth pages
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Protects dashboard routes - user must be logged in and have an organization
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, hasOrganization, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')` }}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <div className="relative z-10 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!hasOrganization) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Routing for root path based on authentication and organization status
const HomeRoute = () => {
  const { isAuthenticated, hasOrganization, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85')` }}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <div className="relative z-10 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Hero />
        <CoreFeatures />
      </div>
    );
  }

  if (!hasOrganization) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoute />,
  },
  {
    path: '/sign-up',
    element: (
      <AuthRoute>
        <SignUp />
      </AuthRoute>
    ),
  },
  {
    path: '/sign-in',
    element: (
      <AuthRoute>
        <SignIn />
      </AuthRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <OnboardingRoute>
        <Onboarding />
      </OnboardingRoute>
    ),
  },
  {
    path: '/menu/:orgId',
    element: <PublicMenu />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: 'menu', element: <Menu /> },
      { path: 'tables', element: <Tables /> },
      { path: 'orders', element: <Orders /> },
      { path: 'kitchen', element: <Kitchen /> },
      { path: 'billing', element: <Billing /> },
      { path: 'customers', element: <Customers /> },
    ]
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;


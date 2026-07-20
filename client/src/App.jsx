import { createBrowserRouter, RouterProvider } from 'react-router';
import { Hero } from './components/Hero';
import { CoreFeatures } from './components/CoreFeatures';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Onboarding } from './pages/Onboarding';

import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Menu } from './pages/dashboard/Menu';
import { Tables } from './pages/dashboard/Tables';
import { Orders } from './pages/dashboard/Orders';
import { Kitchen } from './pages/dashboard/Kitchen';
import { Billing } from './pages/dashboard/Billing';
import { Customers } from './pages/dashboard/Customers';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Hero />
        <CoreFeatures />
      </div>
    ),
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
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
  return <RouterProvider router={router} />;
};

export default App;


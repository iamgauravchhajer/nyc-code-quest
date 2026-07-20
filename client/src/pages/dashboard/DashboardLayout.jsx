import { Outlet, useNavigate, useLocation } from 'react-router';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { TopBar } from '../../components/dashboard/TopBar';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathParts = location.pathname.split('/');
  const activeSection = pathParts.length > 2 && pathParts[2] !== '' ? pathParts[2] : 'overview';

  const handleNavigate = (section) => {
    if (section === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${section}`);
  };

  const titles = {
    overview: 'Overview',
    menu: 'Menu Management',
    tables: 'Table Management',
    orders: 'Order Management',
    kitchen: 'Kitchen Display',
    billing: 'Billing & Payments',
    customers: 'Customer Directory',
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-gray-900">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar title={titles[activeSection]} subtitle="Manage your restaurant operations" />
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 scroll-smooth relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

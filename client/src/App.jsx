import { createBrowserRouter, RouterProvider } from 'react-router';
import { Hero } from './components/Hero';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Hero />
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;


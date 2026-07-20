import { createBrowserRouter, RouterProvider } from 'react-router';
import { Hero } from './components/Hero';
import { SignUp } from './components/SignUp';

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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;


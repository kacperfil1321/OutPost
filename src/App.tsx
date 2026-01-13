import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import ClientLogin from './pages/client/ClientLogin';
import ClientDashboard from './pages/client/ClientDashboard.tsx';
import CourierLogin from './pages/courier/CourierLogin';
import CourierDashboard from './pages/courier/CourierDashboard.tsx';

import SendPackage from './pages/client/SendPackage';
import ReceivePackage from './pages/client/ReceivePackage';
import TrackPackage from './pages/client/TrackPackage';
import History from './pages/client/History';
import Support from './pages/client/Support';

// Placeholder components to prevent build errors before we implement them
const CourierPlaceholder = () => <div>Courier Feature Coming Soon</div>;

import ClientRegister from './pages/client/ClientRegister';

import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // Client Routes
      { path: 'client/login', element: <ClientLogin /> },
      { path: 'client/register', element: <ClientRegister /> },
      {
        path: 'client/dashboard',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <ClientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'client/send',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <SendPackage />
          </ProtectedRoute>
        )
      },
      {
        path: 'client/receive',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <ReceivePackage />
          </ProtectedRoute>
        )
      },
      {
        path: 'client/track',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <TrackPackage />
          </ProtectedRoute>
        )
      },
      {
        path: 'client/history',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <History />
          </ProtectedRoute>
        )
      },
      {
        path: 'client/support',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <Support />
          </ProtectedRoute>
        )
      },
      {
        path: 'client/settings',
        element: (
          <ProtectedRoute requiredRole="client" redirectPath="/client/login">
            <Settings />
          </ProtectedRoute>
        )
      },

      // Courier Routes
      { path: 'courier/login', element: <CourierLogin /> },
      {
        path: 'courier/dashboard',
        element: (
          <ProtectedRoute requiredRole="courier" redirectPath="/courier/login">
            <CourierDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'courier/map',
        element: (
          <ProtectedRoute requiredRole="courier" redirectPath="/courier/login">
            <CourierPlaceholder />
          </ProtectedRoute>
        )
      },
      {
        path: 'courier/settings',
        element: (
          <ProtectedRoute requiredRole="courier" redirectPath="/courier/login">
            <Settings />
          </ProtectedRoute>
        )
      },
    ]
  }
]);

import { useEffect } from 'react';
import { useStore } from './store';

function App() {
  const { user, fetchData } = useStore();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]); // Run when user state restores or changes

  return <RouterProvider router={router} />;
}

export default App;

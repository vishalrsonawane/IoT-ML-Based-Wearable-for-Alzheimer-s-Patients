import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import PatientProfile from './PatientProfile';
import About from './About';
import Contact from './Contact';
import DeviceInfo from './DeviceInfo';

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-lg text-gray-600">This page is under construction.</p>
  </div>
);

function ProtectedRoute({ children }) {
    const [auth, setAuth] = React.useState(null);
    React.useEffect(() => {
        fetch('/api/patients', { credentials: 'include' })
            .then(res => setAuth(res.status !== 401))
            .catch(() => setAuth(false));
    }, []);
    if (auth === null) return <div className="text-center mt-10">Checking authentication...</div>;
    return auth ? children : <Navigate to="/login" replace />;
}

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <PatientProfile />
            </ProtectedRoute>
        ),
    },
    {
        path: "/device",
        element: (
            <ProtectedRoute>
               <DeviceInfo />
            </ProtectedRoute>
        ),
    },
    {
        path: "/about",
        element: (
            <ProtectedRoute>
                <About />
            </ProtectedRoute>
        ),
    },
    {
        path: "/contact",
        element: (
            <ProtectedRoute>
                <Contact />
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: <Login />
    }
]);

const Body = () => {
    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )
}

export default Body;
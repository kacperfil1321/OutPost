import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'client' | 'courier';
    redirectPath?: string;
}

export default function ProtectedRoute({ children, requiredRole, redirectPath = '/' }: ProtectedRouteProps) {
    const user = useStore((state) => state.user);

    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
}

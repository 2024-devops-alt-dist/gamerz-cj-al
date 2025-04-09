// src/components/ProtectedRoute.tsx
import { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>; 
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && !user.role.includes(requiredRole)) {
        return <Navigate to="/profil" replace />;
    }

    return children;
};

export default ProtectedRoute;

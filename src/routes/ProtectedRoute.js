import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Поки йде перевірка, нічого не рендеримо
    if (loading) {
        return null; 
    }

    // Якщо користувач є - показуємо сторінку. Якщо ні - на логін.
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
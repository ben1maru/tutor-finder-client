import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Імпорт всіх сторінок
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
// ... інші сторінки ...
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminManageUsersPage from '../pages/admin/AdminManageUsersPage';
import AdminManageTutorsPage from '../pages/admin/AdminManageTutorsPage';
import AdminManageReviewsPage from '../pages/admin/AdminManageReviewsPage';
import AdminManageBlogPage from '../pages/admin/AdminManageBlogPage';

// Імпорт захисту
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterStudentPage from '../pages/RegisterStudentPage';
import RegisterTutorPage from '../pages/RegisterTutorPage';
import SearchPage from '../pages/SearchPage';
import TutorProfilePage from '../pages/TutorProfilePage';
import BlogListPage from '../pages/BlogListPage';
import BlogPostPage from '../pages/BlogPostPage';
import ChatPage from '../pages/ChatPage';
import StudentDashboardPage from '../pages/user/StudentDashboardPage';
import TutorDashboardPage from '../pages/user/TutorDashboardPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Головний Layout для публічної частини */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register-student" element={<RegisterStudentPage />} />
                <Route path="register-tutor" element={<RegisterTutorPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="tutors/:id" element={<TutorProfilePage />} />
                <Route path="blog" element={<BlogListPage />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="dashboard/student" element={<ProtectedRoute roles={['student']}><StudentDashboardPage /></ProtectedRoute>} />
                <Route path="dashboard/tutor" element={<ProtectedRoute roles={['tutor']}><TutorDashboardPage /></ProtectedRoute>} />
            </Route>
            
            {/* МАРШРУТИ АДМІНКИ - ПОВНІСТЮ НЕЗАЛЕЖНІ */}
            {/* Вони не використовують MainLayout */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminManageUsersPage /></ProtectedRoute>} />
            <Route path="/admin/tutors" element={<ProtectedRoute roles={['admin']}><AdminManageTutorsPage /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute roles={['admin']}><AdminManageReviewsPage /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute roles={['admin']}><AdminManageBlogPage /></ProtectedRoute>} />

            {/* Сторінка 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
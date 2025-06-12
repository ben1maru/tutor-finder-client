import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Container, Typography, Box, Link, Paper } from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/'); // Перенаправляємо на головну після успішного входу
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка входу. Перевірте дані.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Вхід
                </Typography>
                <LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
                <Link component={RouterLink} to="/register-student" variant="body2">
                    {"Немає акаунту? Зареєструватися як учень"}
                </Link>
            </Paper>
        </Container>
    );
};

export default LoginPage;
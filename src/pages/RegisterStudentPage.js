import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Container, Typography, Box, Link, Paper } from '@mui/material';
import { RegisterStudentForm } from '../components/auth/RegisterStudentForm';

const RegisterStudentPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { registerStudent } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setError('');
        setLoading(true);
        try {
            await registerStudent(formData);
            navigate('/'); // Учень одразу логіниться і переходить на головну
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка реєстрації.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Реєстрація учня
                </Typography>
                <RegisterStudentForm onSubmit={handleSubmit} error={error} loading={loading} />
                <Link component={RouterLink} to="/login" variant="body2">
                    {"Вже є акаунт? Увійти"}
                </Link>
            </Paper>
        </Container>
    );
};

export default RegisterStudentPage;
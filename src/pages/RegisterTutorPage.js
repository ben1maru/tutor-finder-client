import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { RegisterTutorForm } from '../components/auth/RegisterTutorForm';
import useAuth from '../hooks/useAuth';
import API from '../api';

const RegisterTutorPage = () => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [dictionaries, setDictionaries] = useState({ subjects: [], levels: [] });

    useEffect(() => {
        // Завантажуємо довідники для форми
        API.get('/data/dictionaries')
            .then(res => setDictionaries(res.data))
            .catch(err => console.error("Could not load dictionaries", err));
    }, []);

    const { registerTutor } = useAuth();

    const handleSubmit = async (formData) => {
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            // Перетворюємо об'єкти з Autocomplete в масиви ID
            const payload = {
                ...formData,
                subjects: formData.subjects.map(s => s.id),
                levels: formData.levels.map(l => l.id),
            };
            const response = await registerTutor(payload);
            setSuccessMessage(response.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка відправки анкети.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container component="main" maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>Стати репетитором</Typography>
                <RegisterTutorForm
                    onSubmit={handleSubmit}
                    error={error}
                    successMessage={successMessage}
                    loading={loading}
                    subjectsOptions={dictionaries.subjects}
                    levelsOptions={dictionaries.levels}
                />
            </Paper>
        </Container>
    );
};

export default RegisterTutorPage;
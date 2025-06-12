import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Форма для реєстрації учня.
 * @param {object} props - Властивості компонента.
 * @param {Function} props.onSubmit - Функція, що викликається при відправці форми. Приймає об'єкт { fullName, email, password }.
 * @param {string} props.error - Повідомлення про помилку для відображення.
 * @param {boolean} props.loading - Вказує, чи триває процес відправки форми.
 */
export const RegisterStudentForm = ({ onSubmit, error, loading }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ fullName, email, password });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Повне ім'я"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Електронна пошта"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                {loading ? 'Реєстрація...' : 'Зареєструватися'}
            </Button>
        </Box>
    );
};

RegisterStudentForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool,
};
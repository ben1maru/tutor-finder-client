import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import PropTypes from 'prop-types';

export const RegisterStudentForm = ({ onSubmit, error, success, loading }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ fullName: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = { fullName: '', email: '', password: '' };
    let hasError = false;

    if (!fullName.trim()) {
      newErrors.fullName = "Введіть повне ім’я";
      hasError = true;
    }
    if (!email.trim()) {
      newErrors.email = "Введіть електронну пошту";
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = "Введіть пароль";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onSubmit({ fullName, email, password });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: 400 }}>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          {success}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Повне ім’я"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={!!errors.fullName}
        helperText={errors.fullName}
        margin="normal"
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Електронна пошта"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
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
  success: PropTypes.string,
  loading: PropTypes.bool,
};

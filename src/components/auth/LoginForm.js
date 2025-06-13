import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import PropTypes from 'prop-types';

export const LoginForm = ({ onSubmit, error, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = { email: '', password: '' };
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = 'Введіть електронну пошту';
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = 'Введіть пароль';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
        onSubmit({ email, password });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: 300 }}>
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
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
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Увійти
      </Button>
    </Box>
  );
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool,
};

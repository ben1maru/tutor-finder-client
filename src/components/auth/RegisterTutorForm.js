import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Alert,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Autocomplete
} from '@mui/material';
import PropTypes from 'prop-types';

export const RegisterTutorForm = ({
    onSubmit,
    error,
    successMessage,
    loading,
    subjectsOptions = [],
    levelsOptions = [],
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        photo_url: '',
        description: '',
        subjects: [],
        levels: [],
        experience: '',
        education: '',
        city: '',
        format: 'online',
        price: '',
    });

    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isFieldEmpty = (field) => touched && formData[field].toString().trim() === '';

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched(true);

        // Перевірка обов’язкових полів
        const requiredFields = ['fullName', 'email', 'password', 'description', 'education', 'experience', 'price'];
        const hasEmptyRequired = requiredFields.some(field => !formData[field].toString().trim());

        if (hasEmptyRequired || formData.subjects.length === 0 || formData.levels.length === 0) {
            return;
        }

        onSubmit(formData);
    };

    // --- Якщо є повідомлення про успіх, показуємо його і даємо кнопку "Зареєструвати нового"
    if (successMessage) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setFormData({
                            fullName: '',
                            email: '',
                            password: '',
                            photo_url: '',
                            description: '',
                            subjects: [],
                            levels: [],
                            experience: '',
                            education: '',
                            city: '',
                            format: 'online',
                            price: '',
                        });
                        setTouched(false);
                    }}
                >
                    Зареєструвати нового викладача
                </Button>
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} noValidate>
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

            <Typography variant="h6" gutterBottom>Основна інформація</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="fullName"
                        label="Повне ім'я"
                        required
                        fullWidth
                        value={formData.fullName}
                        onChange={handleChange}
                        error={isFieldEmpty('fullName')}
                        helperText={isFieldEmpty('fullName') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="email"
                        label="Електронна пошта"
                        type="email"
                        required
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        error={isFieldEmpty('email')}
                        helperText={isFieldEmpty('email') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="password"
                        label="Пароль"
                        type="password"
                        required
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                        error={isFieldEmpty('password')}
                        helperText={isFieldEmpty('password') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="photo_url"
                        label="Посилання на фото (URL)"
                        fullWidth
                        value={formData.photo_url}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Професійна інформація</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="description"
                        label="Опис викладання"
                        multiline
                        rows={4}
                        required
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                        error={isFieldEmpty('description')}
                        helperText={isFieldEmpty('description') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="education"
                        label="Освіта"
                        required
                        fullWidth
                        value={formData.education}
                        onChange={handleChange}
                        error={isFieldEmpty('education')}
                        helperText={isFieldEmpty('education') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="experience"
                        label="Досвід (років)"
                        type="number"
                        required
                        fullWidth
                        value={formData.experience}
                        onChange={handleChange}
                        error={isFieldEmpty('experience')}
                        helperText={isFieldEmpty('experience') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="price"
                        label="Ціна за годину (грн)"
                        type="number"
                        required
                        fullWidth
                        value={formData.price}
                        onChange={handleChange}
                        error={isFieldEmpty('price')}
                        helperText={isFieldEmpty('price') && "Обов’язкове поле"}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        options={subjectsOptions}
                        getOptionLabel={(option) => option.name}
                        value={formData.subjects}
                        onChange={(event, newValue) =>
                            setFormData((prev) => ({ ...prev, subjects: newValue }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Предмети"
                                required
                                error={touched && formData.subjects.length === 0}
                                helperText={touched && formData.subjects.length === 0 ? "Оберіть хоча б один предмет" : ''}
                            />
                        )}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        options={levelsOptions}
                        getOptionLabel={(option) => option.name}
                        value={formData.levels}
                        onChange={(event, newValue) =>
                            setFormData((prev) => ({ ...prev, levels: newValue }))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Рівні підготовки"
                                required
                                error={touched && formData.levels.length === 0}
                                helperText={touched && formData.levels.length === 0 ? "Оберіть хоча б один рівень" : ''}
                            />
                        )}
                        disabled={loading}
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Умови занять</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="city"
                        label="Місто (для офлайн)"
                        fullWidth
                        value={formData.city}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Формат занять</InputLabel>
                        <Select
                            name="format"
                            value={formData.format}
                            label="Формат занять"
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <MenuItem value="online">Тільки онлайн</MenuItem>
                            <MenuItem value="offline">Тільки офлайн</MenuItem>
                            <MenuItem value="both">Онлайн та офлайн</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 4, mb: 2 }}
                disabled={loading}
            >
                {loading ? 'Відправка...' : 'Надіслати анкету'}
            </Button>
       
        </Box>
    );
};

RegisterTutorForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    successMessage: PropTypes.string,
    loading: PropTypes.bool,
    subjectsOptions: PropTypes.array,
    levelsOptions: PropTypes.array,
};

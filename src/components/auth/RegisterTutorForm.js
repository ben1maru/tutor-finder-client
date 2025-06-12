import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Grid, Select, MenuItem, FormControl, InputLabel, Typography, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';

export const RegisterTutorForm = ({ onSubmit, error, successMessage, loading, subjectsOptions, levelsOptions }) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (successMessage) {
        return <Alert severity="success">{successMessage}</Alert>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            
            <Typography variant="h6" gutterBottom>Основна інформація</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}><TextField name="fullName" label="Повне ім'я" required fullWidth value={formData.fullName} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="email" label="Електронна пошта" type="email" required fullWidth value={formData.email} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="password" label="Пароль" type="password" required fullWidth value={formData.password} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12}><TextField name="photo_url" label="Посилання на ваше фото (URL)" fullWidth value={formData.photo_url} onChange={handleChange} disabled={loading} /></Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Професійна інформація</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}><TextField name="description" label="Розкажіть про себе та свій підхід" multiline rows={4} required fullWidth value={formData.description} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12}><TextField name="education" label="Освіта (назва закладу, спеціальність)" required fullWidth value={formData.education} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="experience" label="Досвід (років)" type="number" required fullWidth value={formData.experience} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="price" label="Ціна за годину (грн)" type="number" required fullWidth value={formData.price} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12}>
                    <Autocomplete multiple options={subjectsOptions || []} getOptionLabel={(option) => option.name} value={formData.subjects} onChange={(event, newValue) => setFormData(prev => ({ ...prev, subjects: newValue }))} renderInput={(params) => (<TextField {...params} label="Предмети, які ви викладаєте" />)} />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete multiple options={levelsOptions || []} getOptionLabel={(option) => option.name} value={formData.levels} onChange={(event, newValue) => setFormData(prev => ({ ...prev, levels: newValue }))} renderInput={(params) => (<TextField {...params} label="Рівні підготовки" />)} />
                </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Умови занять</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField name="city" label="Місто (для офлайн занять)" fullWidth value={formData.city} onChange={handleChange} disabled={loading} /></Grid>
                <Grid item xs={12} sm={6}><FormControl fullWidth required><InputLabel>Формат занять</InputLabel><Select name="format" value={formData.format} label="Формат занять" onChange={handleChange} disabled={loading}><MenuItem value="online">Тільки онлайн</MenuItem><MenuItem value="offline">Тільки офлайн</MenuItem><MenuItem value="both">Онлайн та офлайн</MenuItem></Select></FormControl></Grid>
            </Grid>
            
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, mb: 2 }} disabled={loading}>
                {loading ? 'Відправка...' : 'Надіслати анкету на модерацію'}
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
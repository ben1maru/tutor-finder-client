import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Tabs, Tab, Paper, Grid, TextField, Button,
    Alert, Select, MenuItem, FormControl, InputLabel, Avatar, Autocomplete
} from '@mui/material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReviewCard } from '../../components/common/ReviewCard';
import API from '../../api';
import useAuth from '../../hooks/useAuth';

// Компонент-обгортка для вмісту вкладок
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const TutorDashboardPage = () => {
    const { user } = useAuth();
    const [tabIndex, setTabIndex] = useState(0);
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dictionaries, setDictionaries] = useState({ subjects: [], levels: [] });

    // Завантажуємо довідники один раз при першому рендері
    useEffect(() => {
        API.get('/data/dictionaries')
            .then(res => setDictionaries(res.data))
            .catch(err => console.error("Could not load dictionaries", err));
    }, []);

    // Функція для завантаження даних профілю
    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const { data } = await API.get(`/profile/tutor/profile`);
            setProfile(data);
        } catch (err) {
            setError(err.response?.data?.message || "Помилка завантаження профілю");
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Функція для завантаження відгуків
    const fetchReviews = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const { data } = await API.get(`/profile/tutor/reviews`);
            setReviews(data);
        } catch (err) {
            setError(err.response?.data?.message || "Помилка завантаження відгуків");
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Цей ефект реагує на зміну вкладки і завантажує відповідні дані
    useEffect(() => {
        if (tabIndex === 0) {
            fetchProfile();
        } else if (tabIndex === 2) {
            fetchReviews();
        }
    }, [tabIndex, user, fetchProfile, fetchReviews]); // Додаємо user і функції в залежності

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleProfileSave = async () => {
        setSuccess('');
        setError('');
        try {
            const payload = {
                ...profile,
                subjects: profile.subjects || [],
                levels: profile.levels || [],
            };
            const { data } = await API.put('/profile/tutor/profile', payload);
            setSuccess(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка оновлення профілю.');
        }
    };

    const renderContent = () => {
        if (loading || !profile || dictionaries.subjects.length === 0) {
            // Показуємо спіннер, поки завантажуються дані профілю або довідники
            return <LoadingSpinner />;
        }
        if (error) {
            return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
        }

        // Знаходимо повні об'єкти предметів/рівнів за їхніми ID для Autocomplete
        const selectedSubjects = dictionaries.subjects.filter(s => profile.subjects?.includes(s.id));
        const selectedLevels = dictionaries.levels.filter(l => profile.levels?.includes(l.id));

        return (
            <>
                <TabPanel value={tabIndex} index={0}>
                    <Typography variant="h6" gutterBottom>Редагування профілю</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar src={profile.photo_url || ''} sx={{ width: 150, height: 150, mb: 2 }}>{user?.full_name?.charAt(0)}</Avatar>
                            <TextField label="Посилання на фото (URL)" name="photo_url" value={profile.photo_url || ''} onChange={handleProfileChange} fullWidth variant="outlined" sx={{ maxWidth: '500px' }} />
                        </Grid>
                        <Grid item xs={12}><TextField label="Опис" name="description" value={profile.description || ''} onChange={handleProfileChange} fullWidth multiline rows={4} /></Grid>
                        <Grid item xs={12}><TextField label="Освіта" name="education" value={profile.education || ''} onChange={handleProfileChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6} md={3}><TextField label="Досвід (років)" name="experience_years" type="number" value={profile.experience_years || ''} onChange={handleProfileChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6} md={3}><TextField label="Місто" name="city" value={profile.city || ''} onChange={handleProfileChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6} md={3}><TextField label="Ціна за годину (грн)" name="price_per_hour" type="number" value={profile.price_per_hour || ''} onChange={handleProfileChange} fullWidth /></Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Формат занять</InputLabel>
                                <Select name="lesson_format" value={profile.lesson_format || 'online'} label="Формат занять" onChange={handleProfileChange}>
                                    <MenuItem value="online">Тільки онлайн</MenuItem>
                                    <MenuItem value="offline">Тільки офлайн</MenuItem>
                                    <MenuItem value="both">Онлайн та офлайн</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete multiple options={dictionaries.subjects} getOptionLabel={(option) => option.name} value={selectedSubjects} isOptionEqualToValue={(option, value) => option.id === value.id} onChange={(event, newValue) => setProfile(prev => ({ ...prev, subjects: newValue.map(s => s.id) }))} renderInput={(params) => <TextField {...params} label="Ваші предмети" />} />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete multiple options={dictionaries.levels} getOptionLabel={(option) => option.name} value={selectedLevels} isOptionEqualToValue={(option, value) => option.id === value.id} onChange={(event, newValue) => setProfile(prev => ({ ...prev, levels: newValue.map(l => l.id) }))} renderInput={(params) => <TextField {...params} label="Ваші рівні підготовки" />} />
                        </Grid>
                        <Grid item xs={12}><Button variant="contained" onClick={handleProfileSave}>Зберегти зміни</Button></Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                     <Typography variant="h6">Статистика профілю</Typography>
                     <Typography variant="body1">Всього переглядів вашого профілю: <strong>{profile?.views_count || 0}</strong></Typography>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Typography variant="h6">Мої відгуки ({reviews.length})</Typography>
                    {reviews.length > 0 ? reviews.map(review => <ReviewCard key={review.id} review={review} />) : <Typography>Про вас ще не залишили жодного відгуку.</Typography>}
                </TabPanel>
            </>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>Особистий кабінет репетитора</Typography>
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="dashboard tabs">
                        <Tab label="Редагувати профіль" />
                        <Tab label="Статистика" />
                        <Tab label="Мої відгуки" />
                    </Tabs>
                </Box>
                {renderContent()}
            </Paper>
        </Container>
    );
};

export default TutorDashboardPage;
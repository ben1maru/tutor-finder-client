import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Alert, Tabs, Tab, Box } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { TutorsTable } from '../../components/admin/TutorsTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

const AdminManageTutorsPage = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabIndex, setTabIndex] = useState(0); // 0: pending, 1: approved, 2: rejected

    // Створюємо мапу, щоб легко перетворювати індекс вкладки в статус
    const statusMap = {
        0: 'pending',
        1: 'approved',
        2: 'rejected',
    };

    // Функція для завантаження репетиторів з певним статусом
    const fetchTutors = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const status = statusMap[tabIndex];
            
            // --- КЛЮЧОВЕ ВИПРАВЛЕННЯ ---
            // Тепер ми відправляємо запит на правильний URL з параметром
            const { data } = await API.get('/admin/tutors', { 
                params: { status: status } 
            });
            
            setTutors(data);
        } catch (err) {
            setError('Не вдалося завантажити анкети репетиторів.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [tabIndex]); // Додаємо tabIndex в залежності

    // Викликаємо завантаження даних при першому рендері та при зміні вкладки
    useEffect(() => {
        fetchTutors();
    }, [fetchTutors]);

    const handleModerate = async (tutorId, newStatus) => {
        try {
            await API.patch(`/admin/tutors/${tutorId}/moderate`, { status: newStatus });
            // Після модерації оновлюємо список, щоб анкета зникла з поточної вкладки
            fetchTutors(); 
        } catch (err) {
            alert('Помилка модерації. Спробуйте ще раз.');
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <AdminLayout>
            <Typography variant="h4" gutterBottom>
                Модерація анкет репетиторів
            </Typography>
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="На модерації" />
                        <Tab label="Схвалені" />
                        <Tab label="Відхилені" />
                    </Tabs>
                </Box>
                {loading ? <LoadingSpinner /> : error ? <Alert severity="error">{error}</Alert> : (
                    <TutorsTable tutors={tutors} onAction={handleModerate} />
                )}
            </Paper>
        </AdminLayout>
    );
};

export default AdminManageTutorsPage;
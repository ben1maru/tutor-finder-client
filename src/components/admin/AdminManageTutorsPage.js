import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Alert, Tabs, Tab, Box } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { TutorsTable } from '../../components/admin/TutorsTable'; // Наша таблиця підходить!
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

const AdminManageTutorsPage = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

    const statusMap = {
        0: 'pending',
        1: 'approved',
        2: 'rejected',
    };

    const fetchTutors = useCallback(async () => {
        setLoading(true);
        try {
            const status = statusMap[tabIndex];
            const { data } = await API.get('/admin/tutors', { params: { status } });
            setTutors(data);
        } catch (err) {
            setError('Не вдалося завантажити анкети репетиторів.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [tabIndex]);

    useEffect(() => {
        fetchTutors();
    }, [fetchTutors]);

    const handleModerate = async (tutorId, newStatus) => {
        try {
            await API.patch(`/admin/tutors/${tutorId}/moderate`, { status: newStatus });
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
                Керування репетиторами
            </Typography>
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="На модерації" />
                        <Tab label="Схвалені" />
                        <Tab label="Відхилені" />
                    </Tabs>
                </Box>
                {loading && <LoadingSpinner />}
                {error && <Alert severity="error">{error}</Alert>}
                {!loading && !error && (
                    <TutorsTable tutors={tutors} onAction={handleModerate} />
                )}
            </Paper>
        </AdminLayout>
    );
};

export default AdminManageTutorsPage;
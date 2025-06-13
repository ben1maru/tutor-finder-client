import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

// Іконки для карток
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';


const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/admin/stats');
                setStats(data);
            } catch (err) {
                setError('Не вдалося завантажити статистику.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <AdminLayout><LoadingSpinner /></AdminLayout>;
    }

    if (error) {
        return <AdminLayout><Typography color="error">{error}</Typography></AdminLayout>;
    }

    return (
        <AdminLayout>
        
            <Typography variant="h4" gutterBottom>
                Дашборд
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Всього користувачів" 
                        value={stats.usersCount} 
                        icon={<PeopleIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Схвалених репетиторів" 
                        value={stats.approvedTutors} 
                        icon={<SchoolIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Анкети на модерації" 
                        value={stats.pendingTutors} 
                        icon={<HourglassEmptyIcon />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Відгуки на модерації" 
                        value={stats.pendingReviews} 
                        icon={<RateReviewIcon />}
                        color="info"
                    />
                </Grid>
            </Grid>
            {/* Тут можна додати інші секції, наприклад, останні дії */}
        </AdminLayout>
    );
};

export default AdminDashboardPage;
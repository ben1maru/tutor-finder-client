import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Alert } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ReviewsTable } from '../../components/admin/ReviewsTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

const AdminManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/admin/reviews');
            setReviews(data);
        } catch (err) {
            setError('Не вдалося завантажити відгуки.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleDelete = async (reviewId) => {
        if (window.confirm('Ви впевнені, що хочете назавжди видалити цей відгук?')) {
            try {
                await API.delete(`/admin/reviews/${reviewId}`);
                fetchReviews();
            } catch (err) {
                alert('Помилка видалення відгуку.');
                console.error(err);
            }
        }
    };

    return (
        <AdminLayout>
            <Typography variant="h4" gutterBottom>
                Керування відгуками
            </Typography>
            <Paper sx={{ p: 2, mt: 2 }}>
                {loading ? <LoadingSpinner /> : error ? <Alert severity="error">{error}</Alert> : (
                    <ReviewsTable reviews={reviews} onDelete={handleDelete} />
                )}
            </Paper>
        </AdminLayout>
    );
};

export default AdminManageReviewsPage;
import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Paper,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ReviewsTable } from '../../components/admin/ReviewsTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

const AdminManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

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

    const requestDelete = (reviewId) => {
        setReviewToDelete(reviewId);
        setConfirmOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await API.delete(`/admin/reviews/${reviewToDelete}`);
            fetchReviews();
        } catch (err) {
            alert('Помилка видалення відгуку.');
            console.error(err);
        } finally {
            setConfirmOpen(false);
            setReviewToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setReviewToDelete(null);
    };

    return (
        <AdminLayout>
            <Typography variant="h4" gutterBottom>
                Керування відгуками
            </Typography>
            <Paper sx={{ p: 2, mt: 2 }}>
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <ReviewsTable reviews={reviews} onDelete={requestDelete} />
                )}
            </Paper>

            <Dialog open={confirmOpen} onClose={handleCancelDelete}>
                <DialogTitle>Підтвердження видалення</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ви впевнені, що хочете назавжди видалити цей відгук? Цю дію не можна скасувати.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Скасувати</Button>
                    <Button onClick={handleDeleteConfirmed} color="error">Видалити</Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminManageReviewsPage;

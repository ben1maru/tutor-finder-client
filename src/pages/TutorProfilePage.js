import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Box, Button, Rating, Chip, Divider, Alert } from '@mui/material';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ReviewCard } from '../components/common/ReviewCard';
import { LeaveReviewForm } from '../components/common/LeaveReviewForm';
import API from '../api';
import useAuth from '../hooks/useAuth';
import ChatIcon from '@mui/icons-material/Chat';

const TutorProfilePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    useEffect(() => {
        const fetchTutor = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/data/tutors/${id}`);
                setTutor(data);
            } catch (err) {
                setError("Профіль репетитора не знайдено або він не активний.");
            } finally {
                setLoading(false);
            }
        };
        fetchTutor();
    }, [id]);

    const handleStartChat = async () => {
        try {
            const { data } = await API.post('/user/chat/start', { tutorId: tutor.id });
            navigate(`/chat?active_id=${data.conversationId}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Не вдалося почати чат.');
        }
    };

    const handleLeaveReview = async (reviewData) => {
        setReviewLoading(true);
        setReviewError('');
        setReviewSuccess('');
        try {
            const payload = { ...reviewData, tutorId: id };
            const { data } = await API.post('/user/reviews', payload);
            setReviewSuccess(data.message);
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Помилка відправки відгуку.');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <Container sx={{ py: 5 }}><LoadingSpinner /></Container>;
    if (error) return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
    if (!tutor) return null;

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 4 } }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Box component="img" sx={{ width: 250, height: 250, borderRadius: '50%', objectFit: 'cover', mb: 2 }} src={tutor.photo_url || `https://i.pravatar.cc/300?u=${tutor.id}`} alt={tutor.full_name} />
                            <Typography variant="h4">{tutor.full_name}</Typography>
                            <Box sx={{ my: 1 }}><Rating value={parseFloat(tutor.average_rating)} precision={0.5} readOnly size="large" /></Box>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', my: 2 }}>{tutor.price_per_hour} грн/год</Typography>
                            {user && user.role === 'student' && user.id !== tutor.user_id && (
                                <Button variant="contained" startIcon={<ChatIcon />} onClick={handleStartChat}>Написати повідомлення</Button>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>Про мене</Typography>
                        <Typography paragraph>{tutor.description}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Предмети та рівні</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                            {tutor.subjects?.map(s => <Chip key={s.id} label={s.name} />)}
                            {tutor.levels?.map(l => <Chip key={l.id} label={l.name} variant="outlined" />)}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                         <Typography variant="h6">Освіта</Typography>
                        <Typography paragraph>{tutor.education}</Typography>
                         <Divider sx={{ my: 2 }} />
                         <Typography variant="h6">Відгуки ({tutor.reviews?.length || 0})</Typography>
                         <Box sx={{ mt: 2, maxHeight: 400, overflowY: 'auto', pr: 2 }}>
                             {tutor.reviews?.length > 0 ? tutor.reviews.map(review => <ReviewCard key={review.id} review={review} />) : <Typography>Відгуків ще немає.</Typography>}
                         </Box>
                        {user && user.role === 'student' && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h5" gutterBottom>Залишити свій відгук</Typography>
                                <LeaveReviewForm onSubmit={handleLeaveReview} loading={reviewLoading} error={reviewError} success={reviewSuccess} />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default TutorProfilePage;
import React from 'react';
import {
    Card, CardContent, CardMedia, Typography, Box, Rating, Chip, Button, CardActions
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import API from '../../api';
import ChatIcon from '@mui/icons-material/Chat';
import PropTypes from 'prop-types';

export const TutorCard = ({ tutor }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const photoUrl = tutor.photo_url || `https://i.pravatar.cc/300?u=${tutor.id}`;

    const handleStartChat = async (e) => {
        e.stopPropagation(); // Зупиняємо спливання події, щоб не переходити на профіль
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await API.post('/user/chat/start', { tutorId: tutor.id });
            navigate(`/chat?active_id=${data.conversationId}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Не вдалося почати чат.');
        }
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Link to={`/tutors/${tutor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardMedia component="img" height="200" image={photoUrl} alt={`Фото ${tutor.full_name}`} />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {tutor.full_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating name="read-only" value={parseFloat(tutor.average_rating)} precision={0.5} readOnly />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {tutor.description.substring(0, 80)}...
                    </Typography>
                </CardContent>
            </Link>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {tutor.price_per_hour} грн/год
                </Typography>
                {user && user.role === 'student' && user.id !== tutor.id && (
                    <Button size="small" variant="outlined" startIcon={<ChatIcon />} onClick={handleStartChat}>
                        Написати
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

// PropTypes залишаються без змін
TutorCard.propTypes = {
    tutor: PropTypes.shape({
        id: PropTypes.number.isRequired,
        full_name: PropTypes.string.isRequired,
        photo_url: PropTypes.string,
        description: PropTypes.string.isRequired,
        average_rating: PropTypes.number,
        reviews_count: PropTypes.number,
        city: PropTypes.string,
        subjects: PropTypes.array,
        experience_years: PropTypes.number.isRequired,
        price_per_hour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
};
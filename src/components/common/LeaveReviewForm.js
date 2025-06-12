import React, { useState } from 'react';
import { Box, TextField, Button, Rating, Typography, Alert } from '@mui/material';
import PropTypes from 'prop-types';

export const LeaveReviewForm = ({ onSubmit, loading, error, success }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!rating) {
            alert('Будь ласка, поставте оцінку.');
            return;
        }
        onSubmit({ rating, comment });
    };

    if (success) {
        return <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography component="legend">Ваша оцінка *</Typography>
            <Rating name="rating" value={rating} onChange={(event, newValue) => { setRating(newValue); }} size="large" />
            <TextField
                label="Ваш відгук"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                helperText="Ваш відгук буде опубліковано після модерації."
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Відправка...' : 'Залишити відгук'}
            </Button>
        </Box>
    );
};

LeaveReviewForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    success: PropTypes.string,
};
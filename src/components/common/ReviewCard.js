import React from 'react';
import { Paper, Box, Typography, Avatar, Rating, Divider } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Відображає один відгук на сторінці профілю репетитора.
 * @param {object} props - Властивості компонента.
 * @param {object} props.review - Об'єкт з даними відгука.
 */
export const ReviewCard = ({ review }) => {
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                    {review.student_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {review.student_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                </Box>
                <Rating value={review.rating} readOnly />
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
                {review.comment}
            </Typography>
        </Paper>
    );
};

ReviewCard.propTypes = {
    review: PropTypes.shape({
        student_name: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
    }).isRequired,
};
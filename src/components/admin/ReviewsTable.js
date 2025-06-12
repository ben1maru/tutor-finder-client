import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, Tooltip, Box, Rating, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

export const ReviewsTable = ({ reviews, onDelete }) => {
    if (!reviews || reviews.length === 0) {
        return <Typography sx={{ p: 2 }}>Немає відгуків для відображення.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Студент</TableCell>
                        <TableCell>Репетитор</TableCell>
                        <TableCell>Рейтинг</TableCell>
                        <TableCell>Коментар</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell align="right">Дія</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reviews.map((review) => (
                        <TableRow key={review.id} hover>
                            <TableCell>{format(new Date(review.created_at), 'dd.MM.yyyy', { locale: uk })}</TableCell>
                            <TableCell>{review.student_name || 'Користувача видалено'}</TableCell>
                            <TableCell>{review.tutor_name}</TableCell>
                            <TableCell><Rating value={review.rating} readOnly size="small" /></TableCell>
                            <TableCell>{review.comment}</TableCell>
                            <TableCell>
                                <Chip 
                                    label={review.status === 'pending' ? 'На модерації' : 'Схвалено'}
                                    color={review.status === 'pending' ? 'warning' : 'success'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Видалити відгук">
                                    <IconButton onClick={() => onDelete(review.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ReviewsTable.propTypes = {
    reviews: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
};
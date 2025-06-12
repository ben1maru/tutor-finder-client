import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, Tooltip, Box, Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PropTypes from 'prop-types';

/**
 * Таблиця для відображення та модерації анкет репетиторів.
 * @param {object} props - Властивості компонента.
 * @param {Array} props.tutors - Масив об'єктів репетиторів.
 * @param {Function} props.onAction - Функція, що викликається при натисканні на кнопку дії.
 *                                     Приймає (tutorId, actionType: 'approved' | 'rejected').
 */
export const TutorsTable = ({ tutors, onAction }) => {
    if (!tutors || tutors.length === 0) {
        return <Typography>Немає анкет для відображення.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tutors table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Ім'я</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Місто</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell align="right">Дії</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tutors.map((tutor) => (
                        <TableRow key={tutor.id}>
                            <TableCell component="th" scope="row">
                                {tutor.full_name}
                            </TableCell>
                            <TableCell>{tutor.email}</TableCell>
                            <TableCell>{tutor.city || 'Не вказано'}</TableCell>
                            <TableCell>
                                <Chip label={tutor.status} color={tutor.status === 'pending' ? 'warning' : 'default'} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <Box>
                                    <Tooltip title="Схвалити">
                                        <IconButton onClick={() => onAction(tutor.id, 'approved')} color="success">
                                            <CheckCircleOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Відхилити">
                                        <IconButton onClick={() => onAction(tutor.id, 'rejected')} color="error">
                                            <CancelOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

TutorsTable.propTypes = {
    tutors: PropTypes.array.isRequired,
    onAction: PropTypes.func.isRequired,
};
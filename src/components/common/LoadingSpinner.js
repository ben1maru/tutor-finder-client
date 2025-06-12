import React from 'react';
import { Box, CircularProgress } from '@mui/material';

/**
 * Відображає центрований індикатор завантаження.
 */
export const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 10, // Вертикальний відступ
            }}
        >
            <CircularProgress />
        </Box>
    );
};
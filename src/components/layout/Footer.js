import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

/**
 * Підвал сайту.
 */
export const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto', // "Притискає" футер до низу сторінки
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'© '}
                    <Link color="inherit" href="https://your-site.com/">
                        TutorFinder
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    Розроблено з любов'ю для освіти
                </Typography>
            </Container>
        </Box>
    );
};
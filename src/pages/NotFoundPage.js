import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <Container>
        <Box sx={{ textAlign: 'center', my: 10 }}>
            <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold' }}>404</Typography>
            <Typography variant="h5" gutterBottom>Сторінку не знайдено</Typography>
            <Typography color="text.secondary">На жаль, сторінка, яку ви шукаєте, не існує.</Typography>
            <Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
                Повернутись на головну
            </Button>
        </Box>
    </Container>
);

export default NotFoundPage;
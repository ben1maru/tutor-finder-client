import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header'; // Імпортуємо Header як окремий компонент
import { Footer } from './Footer';

/**
 * Головний layout для всього сайту. Включає Header, Footer та
 * відображає основний контент сторінки через <Outlet />.
 */
const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, pt: { xs: '56px', sm: '64px' } }}>
                {/* 
                    Відступ зверху (padding-top) потрібен, щоб контент не заходив під
                    фіксовану шапку (AppBar). 56px для мобільних, 64px для десктопу.
                */}
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
};

export default MainLayout;
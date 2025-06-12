import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Drawer, List, ListItemButton, Divider, Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Головна навігаційна панель (шапка) сайту.
 */
export const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const commonLinks = (
        <>
            <Button color="inherit" component={Link} to="/search">Пошук</Button>
            <Button color="inherit" component={Link} to="/blog">Блог</Button>
        </>
    );

    const userMenu = (
        <Stack direction="row" spacing={1} alignItems="center">
            {user?.role === 'admin' && <Button color="inherit" component={Link} to="/admin">Адмін-панель</Button>}
            {user?.role === 'student' && <Button color="inherit" component={Link} to="/dashboard/student">Мій кабінет</Button>}
            {user?.role === 'tutor' && <Button color="inherit" component={Link} to="/dashboard/tutor">Мій кабінет</Button>}
            <Button color="inherit" component={Link} to="/chat">Чати</Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>Вийти</Button>
        </Stack>
    );

    const guestMenu = (
        <Stack direction="row" spacing={1} alignItems="center">
            <Button color="inherit" component={Link} to="/login">Вхід</Button>
            <Button color="inherit" component={Link} to="/register-student">Реєстрація учня</Button>
            <Button color="inherit" component={Link} to="/register-tutor">Стати репетитором</Button>
        </Stack>
    );

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>Меню</Typography>
            <Divider />
            <List>
                <ListItemButton component={Link} to="/">Головна</ListItemButton>
                <ListItemButton component={Link} to="/search">Пошук репетиторів</ListItemButton>
                <ListItemButton component={Link} to="/blog">Блог</ListItemButton>
                <Divider />
                {user ? (
                    <>
                        {user.role === 'admin' && <ListItemButton component={Link} to="/admin">Адмін-панель</ListItemButton>}
                        {user.role === 'student' && <ListItemButton component={Link} to="/dashboard/student">Мій кабінет</ListItemButton>}
                        {user.role === 'tutor' && <ListItemButton component={Link} to="/dashboard/tutor">Мій кабінет</ListItemButton>}
                        <ListItemButton component={Link} to="/chat">Чати</ListItemButton>
                        <ListItemButton onClick={handleLogout}>Вийти</ListItemButton>
                    </>
                ) : (
                    <>
                        <ListItemButton component={Link} to="/login">Вхід</ListItemButton>
                        <ListItemButton component={Link} to="/register-student">Реєстрація учня</ListItemButton>
                        <ListItemButton component={Link} to="/register-tutor">Стати репетитором</ListItemButton>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" color="primary" elevation={1}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.5rem'
                        }}
                    >
                        TutorFinder
                    </Typography>

                    {/* Десктопне меню */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {commonLinks}
                        {user ? userMenu : guestMenu}
                    </Box>

                    {/* Мобільне меню */}
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer для мобільного меню */}
            <Drawer
                anchor="left"
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

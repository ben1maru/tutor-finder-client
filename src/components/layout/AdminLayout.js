import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';

// ... імпорти іконок ...
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArticleIcon from '@mui/icons-material/Article';
import { Header } from './Header';
const drawerWidth = 240;

const menuItems = [
    { text: 'Дашборд', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Користувачі', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Репетитори', icon: <SchoolIcon />, path: '/admin/tutors' },
    { text: 'Відгуки', icon: <RateReviewIcon />, path: '/admin/reviews' },
    { text: 'Блог', icon: <ArticleIcon />, path: '/admin/blog' },
];

export const AdminLayout = ({ children }) => {
    return (
        <>
            <Header />
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar /> 
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    {/* 
                                        NavLink буде обгорнутий в ListItemButton, що є стандартною
                                        практикою і не викликає конфліктів onClick.
                                    */}
                                    <ListItemButton
                                        component={NavLink} 
                                        to={item.path}
                                        end={item.path === '/admin'}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar /> 
                    {children}
                </Box>
            </Box>
        </>
    );
};
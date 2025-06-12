import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Tabs, Tab, Paper, List, ListItem, ListItemText,
    Divider, ListItemButton, Rating, Alert, ListItemIcon // <-- ДОДАНО ListItemIcon
} from '@mui/material';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';
import useAuth from '../../hooks/useAuth';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';

// Компонент-обгортка для вмісту вкладок
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`dashboard-tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const StudentDashboardPage = () => {
    const { user } = useAuth();
    const [tabIndex, setTabIndex] = useState(0);
    const [data, setData] = useState({ chats: [], reviews: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const { data: dashboardData } = await API.get('/profile/student/dashboard');
            setData(dashboardData);
        } catch (err) {
            setError('Не вдалося завантажити дані для вашого кабінету.');
            console.error("Помилка завантаження даних для дашборду учня", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
        }

        return (
            <>
                {/* ВКЛАДКА ЧАТІВ */}
                <TabPanel value={tabIndex} index={0}>
                    <Typography variant="h6" gutterBottom>Історія чатів</Typography>
                    <List>
                        {data.chats && data.chats.length > 0 ? (
                            data.chats.map(chat => (
                                <ListItem key={chat.conversation_id} disablePadding>
                                    <ListItemButton component={Link} to={`/chat?active_id=${chat.conversation_id}`}>
                                        <ListItemIcon><ChatIcon /></ListItemIcon>
                                        <ListItemText 
                                            primary={`Діалог з ${chat.partner_name}`}
                                            secondary={chat.last_message ? `Останнє: ${chat.last_message.substring(0, 50)}...` : 'Повідомлень ще немає'}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <ListItem><ListItemText primary="У вас ще немає чатів." /></ListItem>
                        )}
                    </List>
                </TabPanel>

                {/* ВКЛАДКА ВІДГУКІВ */}
                <TabPanel value={tabIndex} index={1}>
                    <Typography variant="h6" gutterBottom>Залишені відгуки</Typography>
                     <List>
                        {data.reviews && data.reviews.length > 0 ? (
                            data.reviews.map(review => (
                                <React.Fragment key={review.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon sx={{ mt: 1 }}><RateReviewIcon /></ListItemIcon>
                                        <ListItemText 
                                            primary={<>Відгук для <strong>{review.tutor_name}</strong></>} 
                                            secondary={review.comment}
                                        />
                                        <Rating value={review.rating} readOnly size="small" />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))
                        ) : (
                            <ListItem><ListItemText primary="Ви ще не залишили жодного відгуку." /></ListItem>
                        )}
                    </List>
                </TabPanel>
            </>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Особистий кабінет
            </Typography>
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="dashboard tabs">
                        <Tab label={`Мої чати (${data.chats?.length || 0})`} />
                        <Tab label={`Мої відгуки (${data.reviews?.length || 0})`} />
                    </Tabs>
                </Box>
                {renderContent()}
            </Paper>
        </Container>
    );
};

export default StudentDashboardPage;
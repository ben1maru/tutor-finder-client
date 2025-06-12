import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Grid, Paper, Box, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import useAuth from '../hooks/useAuth';
import API from '../api';
import { ConversationList } from '../components/chat/ConversationList';
import { MessageWindow } from '../components/chat/MessageWindow';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const ChatPage = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [searchParams, setSearchParams] = useSearchParams();

    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState('');

    const handleSelectConversation = useCallback(async (conversationId) => {
        if (!conversationId) return;

        // Видаляємо `active_id` з URL, щоб він не заважав при наступних кліках
        searchParams.delete('active_id');
        setSearchParams(searchParams, { replace: true });

        setActiveConversationId(conversationId);
        setMessages([]);
        setLoadingMessages(true);

        try {
            const { data } = await API.get(`/user/chat/conversations/${conversationId}/messages`);
            setMessages(data);
        } catch (err) {
            setError('Не вдалося завантажити повідомлення.');
        } finally {
            setLoadingMessages(false);
        }
    }, [setSearchParams]);

    const fetchConversations = useCallback(async () => {
        if (!user) return;
        setLoadingConversations(true);
        try {
            const { data } = await API.get('/user/chat/conversations');
            setConversations(data);
            
            const activeIdFromUrl = searchParams.get('active_id');
            if (activeIdFromUrl) {
                handleSelectConversation(parseInt(activeIdFromUrl, 10));
            }
        } catch (err) {
            setError('Не вдалося завантажити діалоги.');
        } finally {
            setLoadingConversations(false);
        }
    }, [user, searchParams, handleSelectConversation]);

    useEffect(() => {
        fetchConversations();
    }, [user]); // Залежність від fetchConversations тут може створювати цикл, тому викликаємо тільки по user

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            // Оновлюємо список діалогів, щоб показати останнє повідомлення
            setConversations(prev => 
                prev.map(conv => 
                    conv.conversation_id === newMessage.conversation_id 
                        ? { ...conv, last_message: newMessage.message_text, last_message_date: newMessage.created_at }
                        : conv
                ).sort((a, b) => new Date(b.last_message_date) - new Date(a.last_message_date))
            );

            // Додаємо повідомлення, якщо відкрито відповідний чат
            if (newMessage.conversation_id === activeConversationId) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);
        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [socket, activeConversationId]);

    const handleSendMessage = (text) => {
        const activeConv = conversations.find(c => c.conversation_id === activeConversationId);
        if (!socket || !activeConv) return;
        
        socket.emit('sendMessage', { senderId: user.id, receiverId: activeConv.partner_id, text }, (response) => {
            if (response.status === 'ok') {
                setMessages(prev => [...prev, response.message]);
            } else {
                setError('Помилка відправки повідомлення.');
            }
        });
    };

    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>Чати</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Paper sx={{ height: '75vh', display: 'flex', border: 1, borderColor: 'divider' }}>
                <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
                    {loadingConversations ? <LoadingSpinner /> : (
                        <ConversationList
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onSelectConversation={handleSelectConversation}
                        />
                    )}
                </Grid>

                <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {loadingMessages ? <LoadingSpinner /> : (
                        activeConversationId ? (
                            <MessageWindow
                                messages={messages}
                                onSendMessage={handleSendMessage}
                            />
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography color="text.secondary">Виберіть діалог, щоб почати спілкування</Typography>
                            </Box>
                        )
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default ChatPage;
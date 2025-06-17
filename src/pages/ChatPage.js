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
    }, [setSearchParams, searchParams]);

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
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            setConversations(prev => 
                prev.map(conv => 
                    conv.conversation_id === newMessage.conversation_id 
                        ? { ...conv, last_message: newMessage.message_text, last_message_date: newMessage.created_at }
                        : conv
                ).sort((a, b) => new Date(b.last_message_date) - new Date(a.last_message_date))
            );
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
            
            <Paper 
                sx={{ 
                    height: { xs: 'auto', md: '75vh' }, 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    border: 1, 
                    borderColor: 'divider',
                    overflow: 'hidden'
                }}
            >
                <Grid 
                    item 
                    xs={12} md={4}
                    sx={{ 
                        borderRight: { xs: 0, md: 1 }, 
                        borderBottom: { xs: 1, md: 0 },
                        borderColor: 'divider', 
                        overflowY: 'auto',
                        height: { xs: 'auto', md: '100%' },
                        maxHeight: { xs: '40vh', md: 'none' },
                        minWidth: { md: 320 }
                    }}
                >
                    {loadingConversations ? <LoadingSpinner /> : (
                        <ConversationList
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onSelectConversation={handleSelectConversation}
                        />
                    )}
                </Grid>

                <Grid 
                    item 
                    xs={12} md={8}
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: { xs: 'auto', md: '100%' },
                        minHeight: { xs: '40vh', md: 'none' }
                    }}
                >
                    {loadingMessages ? <LoadingSpinner /> : (
                        activeConversationId ? (
                            <MessageWindow
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                sx={{
                                    flex: 1,
                                    height: { xs: '40vh', md: '100%' },
                                    minHeight: 0
                                }}
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
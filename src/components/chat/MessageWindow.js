import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

/**
 * Вікно для відображення повідомлень та відправки нових.
 * @param {object} props - Властивості компонента.
 * @param {Array} props.messages - Масив об'єктів повідомлень.
 * @param {Function} props.onSendMessage - Функція для відправки нового повідомлення. Приймає текст повідомлення.
 */
export const MessageWindow = ({ messages, onSendMessage }) => {
    const { user } = useAuth(); // Отримуємо дані поточного користувача, щоб знати, хто є відправником
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // Посилання на останній елемент для авто-прокрутки

    // Функція для автоматичної прокрутки вниз
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Прокручуємо вниз щоразу, коли оновлюється список повідомлень
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };
    
    if (!user) {
        return <Typography>Помилка: користувач не автентифікований.</Typography>;
    }

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
            }}
        >
            {/* Список повідомлень */}
            <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {messages.map((msg) => {
                    const isMyMessage = msg.sender_id === user.id;
                    return (
                        <ListItem key={msg.id} sx={{ justifyContent: isMyMessage ? 'flex-end' : 'flex-start', p: 0.5 }}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    maxWidth: '70%',
                                    bgcolor: isMyMessage ? 'primary.main' : 'background.paper',
                                    color: isMyMessage ? 'primary.contrastText' : 'text.primary',
                                }}
                            >
                                <Typography variant="body1">{msg.message_text}</Typography>
                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7, mt: 0.5 }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Paper>
                        </ListItem>
                    );
                })}
                {/* Невидимий елемент, до якого будемо прокручувати */}
                <div ref={messagesEndRef} />
            </List>

            {/* Форма для відправки */}
            <Paper component="form" onSubmit={handleSend} sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Напишіть повідомлення..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    size="small"
                />
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{ ml: 1 }}
                >
                    Надіслати
                </Button>
            </Paper>
        </Box>
    );
};

MessageWindow.propTypes = {
    messages: PropTypes.array.isRequired,
    onSendMessage: PropTypes.func.isRequired,
};
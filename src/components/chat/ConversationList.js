import React from 'react';
import {
    List, ListItem, ListItemButton, ListItemText, ListItemAvatar,
    Avatar, Typography, Box, Divider
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Відображає список розмов (діалогів) користувача.
 * @param {object} props - Властивості компонента.
 * @param {Array} props.conversations - Масив об'єктів розмов.
 * @param {number|null} props.activeConversationId - ID активної розмови.
 * @param {Function} props.onSelectConversation - Функція, що викликається при виборі розмови. Приймає ID розмови.
 */
export const ConversationList = ({ conversations, activeConversationId, onSelectConversation }) => {
    if (!conversations || conversations.length === 0) {
        return (
            <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">У вас ще немає діалогів.</Typography>
            </Box>
        );
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {conversations.map((conv, index) => (
                <React.Fragment key={conv.conversation_id}>
                    <ListItem alignItems="flex-start" disablePadding>
                        <ListItemButton
                            selected={activeConversationId === conv.conversation_id}
                            onClick={() => onSelectConversation(conv.conversation_id)}
                        >
                            <ListItemAvatar>
                                {/* Перша літера імені партнера як аватарка */}
                                <Avatar>{conv.partner_name.charAt(0).toUpperCase()}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {conv.partner_name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        noWrap
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {conv.last_message || 'Повідомлень ще немає...'}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                    {index < conversations.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

ConversationList.propTypes = {
    conversations: PropTypes.array.isRequired,
    activeConversationId: PropTypes.number,
    onSelectConversation: PropTypes.func.isRequired,
};
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Відображає одну статистичну картку на дашборді адміністратора.
 * @param {object} props - Властивості компонента.
 * @param {React.ReactElement} props.icon - Іконка для відображення.
 * @param {string} props.title - Заголовок картки (напр. "Нові анкети").
 * @param {string|number} props.value - Статистичне значення.
 * @param {string} props.color - Основний колір для іконки (напр. "primary", "success").
 */
export const StatCard = ({ icon, title, value, color = 'primary' }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" variant="body2">
                            {title}
                        </Typography>
                        <Typography color="text.primary" variant="h4" sx={{ fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            backgroundColor: `${color}.main`,
                            height: 56,
                            width: 56,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

// Визначаємо типи пропсів для кращої надійності та автодоповнення
StatCard.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string,
};
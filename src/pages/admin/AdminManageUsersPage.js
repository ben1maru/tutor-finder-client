import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Paper, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Switch, Chip
} from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

const AdminManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/admin/users');
            setUsers(data);
        } catch (err) {
            setError('Не вдалося завантажити список користувачів.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleBlock = async (userId, isBlocked) => {
        try {
            await API.patch(`/admin/users/${userId}/block`, { block: !isBlocked });
            // Оновлюємо стан локально для миттєвого відображення
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, is_blocked: !isBlocked } : user
                )
            );
        } catch (err) {
            alert('Помилка зміни статусу блокування.');
            console.error(err);
        }
    };
    
    return (
        <AdminLayout>
            <Typography variant="h4" gutterBottom>
                Керування користувачами
            </Typography>
            <Paper>
                {loading && <LoadingSpinner />}
                {error && <Alert severity="error">{error}</Alert>}
                {!loading && !error && (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Ім'я</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Роль</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Заблокувати</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={user.is_blocked ? 'Заблоковано' : 'Активний'} 
                                                color={user.is_blocked ? 'error' : 'success'} 
                                                size="small" 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={user.is_blocked}
                                                onChange={() => handleToggleBlock(user.id, user.is_blocked)}
                                                color="warning"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </AdminLayout>
    );
};

export default AdminManageUsersPage;
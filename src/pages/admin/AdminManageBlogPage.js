import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { BlogManager } from '../../components/admin/BlogManager';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import API from '../../api';

const AdminManageBlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await API.get('/data/blog');
            if (Array.isArray(data)) {
                setPosts(data);
            } else if (data && Array.isArray(data.posts)) {
                setPosts(data.posts);
            } else {
                console.warn("API for blog posts returned unexpected data format:", data);
                setPosts([]);
            }
        } catch (err) {
            setError('Не вдалося завантажити пости.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSavePost = async (postData) => {
        try {
            const payload = {
                title: postData.title,
                content: postData.content,
                cover_image_url: postData.cover_image_url,
            };

            if (postData.id) {
                await API.put(`/admin/blog/${postData.id}`, payload);
            } else {
                await API.post('/admin/blog', payload);
            }
            fetchPosts();
        } catch (err) {
            alert('Помилка збереження поста: ' + (err.response?.data?.message || err.message));
        }
    };

    const confirmDelete = (postId) => {
        setPostToDelete(postId);
        setConfirmOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await API.delete(`/admin/blog/${postToDelete}`);
            fetchPosts();
        } catch (err) {
            alert('Помилка видалення поста.');
        } finally {
            setConfirmOpen(false);
            setPostToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setPostToDelete(null);
    };

    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        return (
            <BlogManager
                posts={posts}
                onSave={handleSavePost}
                onDelete={confirmDelete}
            />
        );
    };

    return (
        <AdminLayout>
            <Typography variant="h4" gutterBottom>Керування блогом</Typography>
            {renderContent()}

            <Dialog open={confirmOpen} onClose={handleCancelDelete}>
                <DialogTitle>Підтвердження видалення</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ви впевнені, що хочете видалити цей пост? Цю дію неможливо скасувати.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Скасувати</Button>
                    <Button onClick={handleDeleteConfirmed} color="error">Видалити</Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminManageBlogPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, Divider, Alert } from '@mui/material';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import API from '../api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const BlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/data/blog/${slug}`);
                setPost(data);
            } catch (err) {
                setError('Не вдалося завантажити новину або її не існує.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return <Container sx={{ py: 5 }}><LoadingSpinner /></Container>;
    if (error) return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
    if (!post) return null;

    const sanitizedContent = DOMPurify.sanitize(post.content);

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h3" component="h1" gutterBottom>{post.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: 'text.secondary' }}>
                    <Typography variant="body2">Автор: {post.author_name || 'Адміністрація'}</Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Typography variant="body2">Опубліковано: {format(new Date(post.created_at), 'd MMMM yyyy', { locale: uk })}</Typography>
                </Box>
                
                {post.cover_image_url && (
                    <Box
                        component="img"
                        src={post.cover_image_url}
                        alt={post.title}
                        sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2, mb: 3 }}
                    />
                )}

                <Box
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    sx={{ '& p': { lineHeight: 1.7 }, '& a': { color: 'primary.main' } }}
                />
            </Paper>
        </Container>
    );
};

export default BlogPostPage;
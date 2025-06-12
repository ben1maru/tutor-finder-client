import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
    Container, Typography, Grid, Card, CardContent,
    CardActionArea, Pagination, Box, Alert, CardMedia
} from '@mui/material';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import API from '../api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const BlogListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [blogData, setBlogData] = useState({ posts: [], totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await API.get('/data/blog', { params: { page } });

                console.log("Отримано дані з API:", data);

                if (data && Array.isArray(data.posts)) {
                    setBlogData(data);
                } else if (Array.isArray(data)) {
                    setBlogData({ posts: data, totalPages: 1 });
                } else {
                    console.warn("API for blog posts returned unexpected data format:", data);
                    setBlogData({ posts: [], totalPages: 1 });
                }

            } catch (err) {
                setError('Не вдалося завантажити новини.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        setSearchParams({ page: value.toString() });
    };

    const stripHtml = (html) => !html ? '' : new DOMParser().parseFromString(html, 'text/html').body.textContent;

    return (
        <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Блог наукових новин
                </Typography>

                {loading ? <LoadingSpinner /> : error ? (
                    <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
                ) : (
                    <>
                        <Grid container spacing={4} sx={{ mt: 2 }}>
                            {blogData.posts.length > 0 ? (
                                blogData.posts.map((post) => (
                                    <Grid item key={post.id} xs={12} sm={6} md={4}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                border: '2px solid #1976d2',
                                                borderRadius: 2,
                                                boxShadow: 2,
                                                '&:hover': {
                                                    boxShadow: 6,
                                                    borderColor: '#1565c0',
                                                }
                                            }}
                                        >
                                            <CardActionArea component={RouterLink} to={`/blog/${post.slug}`}>
                                                <CardMedia
                                                    component="img"
                                                    height="180"
                                                    image={post.cover_image_url || 'https://via.placeholder.com/300x180.png?text=No+Image'}
                                                    alt={post.title}
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography gutterBottom variant="h5" component="h2">
                                                        {post.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        {format(new Date(post.created_at), 'd MMMM yyyy', { locale: uk })}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {stripHtml(post.excerpt || post.content)?.substring(0, 100)}...
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography sx={{ width: '100%', textAlign: 'center', mt: 5, fontSize: '1.2rem' }}>
                                    Новин ще немає.
                                </Typography>
                            )}
                        </Grid>

                        {blogData.totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Pagination
                                    count={blogData.totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default BlogListPage;

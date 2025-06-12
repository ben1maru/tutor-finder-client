import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { TutorCard } from '../components/common/TutorCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SearchFilters } from '../components/search/SearchFilters';
import API from '../api';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tutors, setTutors] = useState([]);
    const [dictionaries, setDictionaries] = useState({});
    const [loading, setLoading] = useState(true);

    const initialFilters = useMemo(() => {
        const getParam = (key) => searchParams.get(key);
        return {
            subject: getParam('subject') ? { id: getParam('subject'), name: getParam('subjectName') || '' } : null,
            level: getParam('level') ? { id: getParam('level'), name: getParam('levelName') || '' } : null,
            city: getParam('city') || '',
            minPrice: getParam('minPrice') || 0,
            maxPrice: getParam('maxPrice') || 2000,
            format: getParam('format') || 'all',
            sortBy: getParam('sortBy') || 'rating',
        };
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tutorsRes, dictRes] = await Promise.all([
                    API.get('/data/tutors', { params: Object.fromEntries(searchParams) }),
                    API.get('/data/dictionaries'),
                ]);
                setTutors(tutorsRes.data);
                setDictionaries(dictRes.data);
            } catch (error) {
                console.error("Помилка завантаження даних для сторінки пошуку", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParams]);

    const handleFilterChange = (newFilters) => {
        const params = new URLSearchParams();

        if (newFilters.subject) {
            params.set('subject', newFilters.subject.id);
            params.set('subjectName', newFilters.subject.name);
        }
        if (newFilters.level) {
            params.set('level', newFilters.level.id);
            params.set('levelName', newFilters.level.name);
        }
        if (newFilters.city) params.set('city', newFilters.city);
        if (newFilters.format && newFilters.format !== 'all') params.set('format', newFilters.format);
        if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice);
        if (newFilters.maxPrice < 2000) params.set('maxPrice', newFilters.maxPrice);
        if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);

        setSearchParams(params);
    };

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Grid container spacing={4}>
                {/* РОЗШИРЕНА ШИРИНА ФІЛЬТРІВ */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '20px' }}>
                        <Typography variant="h6" gutterBottom>Фільтри</Typography>
                        <SearchFilters
                            dictionaries={dictionaries}
                            initialFilters={initialFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </Paper>
                </Grid>

                {/* ЗМЕНШЕНА ШИРИНА СПИСКУ РЕПЕТИТОРІВ */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" gutterBottom>
                        Знайдено репетиторів: {tutors.length}
                    </Typography>
                    {loading ? (
                        <LoadingSpinner />
                    ) : tutors.length > 0 ? (
                        <Grid container spacing={3}>
                            {tutors.map(tutor => (
                                <Grid item key={tutor.id} xs={12} sm={6} md={4}>
                                    <TutorCard tutor={tutor} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography sx={{ mt: 4 }}>
                            За вашим запитом нічого не знайдено. Спробуйте змінити або скинути фільтри.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SearchPage;

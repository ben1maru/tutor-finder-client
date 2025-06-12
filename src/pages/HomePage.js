import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

// Іконки для секції переваг
import FindInPageIcon from '@mui/icons-material/FindInPage';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

// Правильні шляхи імпорту відносно папки `src/pages/`
import { SearchBar } from '../components/common/SearchBar';
import { TutorCard } from '../components/common/TutorCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import API from '../api';

const HomePage = () => {
    const [tutors, setTutors] = useState([]);
    const [dictionaries, setDictionaries] = useState({ subjects: [], cities: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tutorsRes, dictRes] = await Promise.all([
                    API.get('/data/tutors?sortBy=rating&limit=3'),
                    API.get('/data/dictionaries'),
                ]);
                setTutors(tutorsRes.data);
                setDictionaries(dictRes.data);
            } catch (error) {
                console.error("Помилка завантаження даних для головної сторінки", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const features = [
        { icon: <FindInPageIcon fontSize="large" color="primary" />, title: 'Зручний пошук', description: 'Використовуйте гнучкі фільтри за предметом, містом, ціною та форматом, щоб знайти ідеального викладача.' },
        { icon: <VerifiedUserIcon fontSize="large" color="primary" />, title: 'Перевірені анкети', description: 'Кожен репетитор проходить ручну модерацію, що гарантує якість та достовірність інформації.' },
        { icon: <ChatBubbleOutlineIcon fontSize="large" color="primary" />, title: 'Прямий зв\'язок', description: 'Спілкуйтеся з викладачами напряму через вбудований чат, щоб обговорити всі деталі перед початком занять.' },
        { icon: <LibraryBooksIcon fontSize="large" color="primary" />, title: 'Корисний блог', description: 'Слідкуйте за останніми новинами у світі науки та освіти в нашому регулярно оновлюваному блозі.' }
    ];

    return (
        <Box>
            {/* 1. ГЕРОЙ-СЕКЦІЯ */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Знайди свого ідеального репетитора
                    </Typography>
                    <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
                        Найбільша база перевірених викладачів в Україні. Почни пошук зараз.
                    </Typography>
                    <SearchBar subjects={dictionaries.subjects} cities={dictionaries.cities} />
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ my: 6 }}>
                {/* 2. СЕКЦІЯ "ЯК ЦЕ ПРАЦЮЄ?" */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Почати легко
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center">
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="h1" color="primary.light">1</Typography>
                            <Typography variant="h6">Шукайте</Typography>
                            <Typography color="text.secondary">
                                Використовуйте фільтри, щоб знайти потрібного спеціаліста.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="h1" color="primary.light">2</Typography>
                            <Typography variant="h6">Спілкуйтесь</Typography>
                            <Typography color="text.secondary">
                                Зв'яжіться з репетитором через чат, щоб задати питання.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="h1" color="primary.light">3</Typography>
                            <Typography variant="h6">Навчайтесь</Typography>
                            <Typography color="text.secondary">
                                Домовляйтесь про заняття та досягайте нових висот.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 6 }} />

                {/* 3. СЕКЦІЯ "НАШІ ПЕРЕВАГИ" */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Чому обирають нас?
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%', bgcolor: 'grey.100' }}>
                                    {feature.icon}
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>{feature.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider sx={{ my: 6 }} />

                {/* 4. СЕКЦІЯ З РЕПЕТИТОРАМИ */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Найкращі репетитори
                    </Typography>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <Grid container spacing={3} sx={{ mt: 2 }} justifyContent="center">
                            {tutors.map(tutor => (
                                <Grid item key={tutor.id} xs={12} sm={6} md={4}>
                                    <TutorCard tutor={tutor} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* 5. СЕКЦІЯ "ЗАКЛИК ДО ДІЇ" */}
                <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Ви репетитор?
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Приєднуйтесь до нашої платформи, щоб знаходити нових учнів та розвивати свою практику.
                    </Typography>
                    <Button variant="contained" color="secondary" size="large" component={Link} to="/register-tutor">
                        Зареєструватися як репетитор
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default HomePage;

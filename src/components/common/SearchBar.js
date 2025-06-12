import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Autocomplete,
    Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Панель пошуку для головної сторінки.
 * @param {object} props - Властивості компонента.
 * @param {Array} props.subjects - Масив предметів для випадаючого списку.
 * @param {Array} props.cities - Масив міст для випадаючого списку.
 */
export const SearchBar = ({ subjects = [], cities = [] }) => {
    const [subject, setSubject] = useState(null);
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (subject) {
            queryParams.append('subject', subject.id);
            queryParams.append('subjectName', subject.name);
        }
        if (city) {
            queryParams.append('city', city);
        }
        navigate(`/search?${queryParams.toString()}`);
    };

    return (
        <Paper
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: 'center',
                }}
            >
                <Autocomplete
                    options={subjects}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => setSubject(newValue)}
                    sx={{ flex: 2, minWidth: 200 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Предмет" variant="outlined" fullWidth />
                    )}
                />

                <Autocomplete
                    freeSolo
                    options={cities}
                    onInputChange={(event, newInputValue) => setCity(newInputValue)}
                    sx={{ flex: 3, minWidth: 200 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Місто" variant="outlined" fullWidth />
                    )}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SearchIcon />}
                    sx={{
                        height: '56px',
                        flexShrink: 0,
                        px: 4,
                        mt: { xs: 1, md: 0 },
                        whiteSpace: 'nowrap'
                    }}
                >
                    Пошук
                </Button>
            </Box>
        </Paper>
    );
};

SearchBar.propTypes = {
    subjects: PropTypes.array,
    cities: PropTypes.array,
};

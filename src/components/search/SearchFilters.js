import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Grid, Autocomplete, Typography,
    FormControl, InputLabel, Select, MenuItem, Slider
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Компонент з фільтрами для сторінки пошуку.
 * @param {object} props - Властивості.
 * @param {object} props.dictionaries - Об'єкт з довідниками { subjects, levels, cities }.
 * @param {object} props.initialFilters - Початкові значення фільтрів з URL.
 * @param {Function} props.onFilterChange - Функція для застосування фільтрів.
 */
export const SearchFilters = ({ dictionaries, initialFilters, onFilterChange }) => {
    const [filters, setFilters] = useState(initialFilters);
    const [priceRange, setPriceRange] = useState([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 2000
    ]);

    // Синхронізуємо внутрішній стан, якщо зовнішні пропси (з URL) змінилися
    useEffect(() => {
        setFilters(initialFilters);
        setPriceRange([initialFilters.minPrice || 0, initialFilters.maxPrice || 2000]);
    }, [initialFilters]);

    const handleChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAutocompleteChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleApply = () => {
        onFilterChange({
            ...filters,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        });
    };
    
    const handleReset = () => {
        const clearedFilters = {
            subject: null,
            level: null,
            city: null,
            format: 'all',
            sortBy: 'rating',
        };
        setFilters(clearedFilters);
        setPriceRange([0, 2000]);
        onFilterChange(clearedFilters);
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleApply(); }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        options={dictionaries.subjects || []}
                        getOptionLabel={(option) => option.name}
                        value={filters.subject}
                        onChange={(e, val) => handleAutocompleteChange('subject', val)}
                        renderInput={(params) => <TextField {...params} label="Предмет" />}
                    />
                </Grid>
                <Grid item xs={12}>
                     <Autocomplete
                        options={dictionaries.levels || []}
                        getOptionLabel={(option) => option.name}
                        value={filters.level}
                        onChange={(e, val) => handleAutocompleteChange('level', val)}
                        renderInput={(params) => <TextField {...params} label="Рівень підготовки" />}
                    />
                </Grid>
                 <Grid item xs={12}>
                    <Autocomplete
                        freeSolo
                        options={dictionaries.cities || []}
                        inputValue={filters.city || ''}
                        onInputChange={(e, val) => handleAutocompleteChange('city', val)}
                        renderInput={(params) => <TextField {...params} label="Місто" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography gutterBottom>Ціна за годину: {priceRange[0]} - {priceRange[1]} грн</Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={2000}
                        step={50}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Формат занять</InputLabel>
                        <Select name="format" value={filters.format || 'all'} label="Формат занять" onChange={handleChange}>
                            <MenuItem value="all">Будь-який</MenuItem>
                            <MenuItem value="online">Тільки онлайн</MenuItem>
                            <MenuItem value="offline">Тільки офлайн</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Сортувати за</InputLabel>
                        <Select name="sortBy" value={filters.sortBy || 'rating'} label="Сортувати за" onChange={handleChange}>
                            <MenuItem value="rating">Рейтингом</MenuItem>
                            <MenuItem value="price">Ціною (від дешевих)</MenuItem>
                            <MenuItem value="experience">Досвідом</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" type="submit">Застосувати</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={handleReset}>Скинути фільтри</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

SearchFilters.propTypes = {
    dictionaries: PropTypes.object.isRequired,
    initialFilters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
};
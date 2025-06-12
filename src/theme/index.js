import { createTheme } from '@mui/material/styles';
import { ukUA } from '@mui/material/locale';

// Створюємо об'єкт теми, де ми можемо налаштувати все: від кольорів до стилів компонентів.
const theme = createTheme({
    // 1. ПАЛІТРА КОЛЬОРІВ
   palette: {
        primary: { main: '#005b96' },
        secondary: { main: '#ff6f61' },
        background: { default: '#f4f6f8', paper: '#ffffff' },
        text: { primary: '#1c1c1c', secondary: '#6b6b6b' },
    },

    // 2. ТИПОГРАФІКА (ШРИФТИ)
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        button: {
            textTransform: 'none', // Кнопки будуть з нормальним текстом, а не ВЕЛИКИМИ ЛІТЕРАМИ
            fontWeight: 'bold',
        }
    },

    // 3. ФОРМА ЕЛЕМЕНТІВ
    shape: {
        borderRadius: 8, // Зробимо всі кути трішки заокругленими
    },
    
    // 4. ПЕРЕВИЗНАЧЕННЯ СТИЛІВ ДЛЯ КОНКРЕТНИХ КОМПОНЕНТІВ
    components: {
        // Стилі для AppBar (шапка сайту)
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Прибираємо тінь для більш плаского, сучасного вигляду
                    borderBottom: '1px solid #e0e0e0', // Додаємо тонку лінію-розділювач
                },
            },
        },
        // Стилі для кнопок
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Прибираємо тінь з кнопок
                    '&:hover': {
                        boxShadow: 'none', // І при наведенні також
                    },
                },
                // Стиль для основної (contained) кнопки
                containedPrimary: {
                    fontWeight: 'bold',
                },
            },
        },
        // Стилі для карток
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Додаємо м'яку, приємну тінь
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)', // Легкий ефект підняття при наведенні
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
    },
}, ukUA); // <-- 5. ВАЖЛИВО: Передаємо об'єкт української локалізації

export default theme;
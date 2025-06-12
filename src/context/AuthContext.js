import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

// Створюємо сам контекст
const AuthContext = createContext();

// Створюємо компонент-провайдер, який буде "огортати" наш додаток
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Дані поточного користувача
    const [token, setToken] = useState(localStorage.getItem('token')); // JWT токен
    const [loading, setLoading] = useState(true); // Показує, чи триває початкова перевірка токена
    const navigate = useNavigate();

    // Ця функція викликається один раз при завантаженні додатку для перевірки токена.
    const fetchUser = useCallback(async () => {
        if (token) {
            try {
                const { data } = await API.get('/auth/me');
                setUser(data);
            } catch (error) {
                console.error("Недійсний токен, вихід із системи.");
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    /**
     * Функція для входу (авторизації) користувача.
     * @param {string} email - Електронна пошта користувача.
     * @param {string} password - Пароль користувача.
     */
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };
    
    // --- НОВІ ФУНКЦІЇ ДЛЯ РЕЄСТРАЦІЇ ---

    /**
     * Реєструє нового учня і одразу авторизує його в системі.
     * @param {object} studentData - Об'єкт з даними учня { fullName, email, password }.
     */
    const registerStudent = async (studentData) => {
        // Наш backend при успішній реєстрації студента одразу повертає токен
        const { data } = await API.post('/auth/register-student', studentData);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        
        // Після встановлення токена, useEffect автоматично викличе fetchUser для отримання даних.
        // Це забезпечує єдине джерело правди про дані користувача.
    };

    /**
     * Реєструє нового репетитора. Не авторизує його, а просто відправляє дані.
     * @param {object} tutorData - Об'єкт з даними репетитора.
     * @returns {Promise<object>} Повертає відповідь від сервера (напр. { message: '...' }).
     */
    const registerTutor = async (tutorData) => {
        // Наш backend для репетитора не повертає токен, а тільки повідомлення
        const { data } = await API.post('/auth/register-tutor', tutorData);
        return data; // Повертаємо повідомлення, щоб показати його на сторінці реєстрації
    };

    /**
     * Функція для виходу користувача з системи.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    // Значення, які будуть доступні всім дочірнім компонентам через хук useAuth
    const contextData = {
        user,
        token,
        loading,
        login,
        logout,
        registerStudent, // <-- Додаємо нову функцію
        registerTutor,   // <-- Додаємо нову функцію
    };

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
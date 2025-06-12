import { useContext } from 'react';
import AuthContext from '../context/AuthContext';


const useAuth = () => {
    // useContext - це стандартний хук React для "читання" даних з контексту.
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth повинен використовуватися всередині AuthProvider');
    }

    return context;
};

export default useAuth;
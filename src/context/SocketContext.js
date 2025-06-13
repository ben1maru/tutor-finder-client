import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth(); // Беремо дані користувача з AuthContext

    useEffect(() => {
        // Ми встановлюємо з'єднання тільки якщо користувач залогінений
        if (user) {
            // Підключаємося до нашого backend сервера
           const newSocket = io('https://tutors-finders-server.onrender.com', {
    transports: ['websocket'], // 🚀 уникаємо HTTP polling
    path: '/socket.io', // 🔧 обов’язковий шлях, якщо сервер не змінював його
});


            // Повідомляємо сервер, що цей користувач приєднався,
            // відправляючи його ID. Це потрібно для приватних повідомлень.
            newSocket.on('connect', () => {
                newSocket.emit('join', user.id);
                console.log(`Socket.IO: Connected with id ${newSocket.id} for user ${user.id}`);
            });
            
            setSocket(newSocket);

            // Дуже важливо! Прибираємо за собою:
            // розриваємо з'єднання, коли користувач виходить з системи або компонент розмонтовується.
            return () => {
                console.log(`Socket.IO: Disconnecting for user ${user.id}`);
                newSocket.disconnect();
            };
        } else if (socket) {
            // Якщо користувач вийшов з системи, а сокет ще активний, розриваємо з'єднання.
            socket.disconnect();
            setSocket(null);
        }
    }, [user]); // Цей ефект буде перезапускатися щоразу, коли змінюється об'єкт `user`

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};


export default SocketContext;
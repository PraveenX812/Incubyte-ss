import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import client from '../api/client';
import type { AuthState } from '../types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        token: localStorage.getItem('token'),
        user: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Ensure the payload structure matches backend: { user: { id, role } }
                const user = decoded.user;
                setState({
                    token,
                    user,
                    isAuthenticated: true,
                });
                client.defaults.headers.common['x-auth-token'] = token;
            } catch (err) {
                console.error("Invalid token", err);
                logout();
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setState({
            token,
            user,
            isAuthenticated: true,
        });
        client.defaults.headers.common['x-auth-token'] = token;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setState({
            token: null,
            user: null,
            isAuthenticated: false,
        });
        delete client.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

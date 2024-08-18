import axios from 'axios';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../util/constant';
import { useLocalStorage } from './useLocalStorage';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    console.log('user', user);
    const navigate = useNavigate();
    const login = useCallback(
        async ({ username, password }) => {
            try {
                const response = await axios.post(`${BASE_URL}/login`, { username, password });

                console.log('user-login res:::', response?.data);
                if (response?.data) {
                    const token = response?.data?.data?.access_token;
                    if (token) {
                        setUser(token);
                        navigate('/chat', { replace: true });
                    }
                }
            } catch (error) {
                throw error;
            }
        },
        [setUser, navigate],
    );

    // call this function to sign out logged in user
    const logout = useCallback(() => {
        setUser(null);
        navigate('/login', { replace: true });
    }, [setUser, navigate]);

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user, login, logout],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

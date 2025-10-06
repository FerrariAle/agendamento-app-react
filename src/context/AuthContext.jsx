import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Cria o nome do contexo
const AuthContext = createContext();

// 2. Cria o componente Provedor que gerenciará o estado
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const navigate = useNavigate();

    // 3. Verifica se já existe ume sessão salva no navegador
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Falha ao carregar sessão do localStorage', error);
        } finally {
            setIsInitializing(false);
        }
    }, []);

    // 5. Função de Login
    const login = async (username, password) => {
        setIsAuthenticating(true);
        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Falha no login');

            let userRole = 'client';
            if (data.username === 'emilys') {
                userRole = 'admin';
            }

            const userWithRole = { ...data, role: userRole };

            const { accessToken: receivedToken, ...userData } = userWithRole;

            setUser(userData);
            setToken(receivedToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', receivedToken);

            // 6. Redirecionamento condicional
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (error) {
            logout();
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };

    // 7. Função de Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const value = { user, token, isAuthenticating, isInitializing, login, logout };

    if (isInitializing) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-zinc-100">
                <p className="text-lg text-zinc-500">Carregando...</p>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usando dentro de um AuthProvider');
    }
    return context;
}


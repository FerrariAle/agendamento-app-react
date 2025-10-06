import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-zinc-200">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <NavLink to="/" className="text-xl font-bold text-primary-900">
                    Agendamentos
                </NavLink>
                <div className="flex">
                    {/* Navegação condicional */}
                    {user?.role !== 'admin' && (
                        <NavLink
                            to="/"
                            className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-primary-900' : 'text-zinc-600 hover:text-primary-900'}`}>
                            Agendar
                        </NavLink>
                    )}

                    {/* Se um usuário é admin, mostra o link para o dashboard */}
                    {user?.role === 'admin' && (
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-primary-900' : 'text-zinc-600 hover:text-primary-900'}`}
                        >
                            Dashboard
                        </NavLink>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    {/* Se estiver logado, indiferente do role */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <img src={user.image} alt="Avatar" className='w-8 h-8 rounded-full' />
                            <span className="text-sm text-zinc-600 hidden sm:block">
                                {user.firstName}
                            </span>
                            <button
                                onClick={logout}
                                className='text-sm font-semibold text-zinc-600 hover:text-red-500'
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-primary-900 text-white font-semibold py-2 px-6 rounded-full text-sm hover:bg-primary-800 transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
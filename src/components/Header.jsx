import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b border-zinc-200">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <NavLink to="/" className="text-xl font-bold text-primary-900">
                    Agendamentos
                </NavLink>
                <div className="flex items-center gap-6">
                    {/* Navegação Pública */}
                    <NavLink to="/" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-primary-900' : 'text-zinc-600 hover:text-primary-900'}`}>
                        Agendar
                    </NavLink>

                    {/* Navegação do Admin - será condicional no futuro */}
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-primary-900' : 'text-zinc-600 hover:text-primary-900'}`}>
                        Admin
                    </NavLink>

                    {/* Placeholder para Login/Logout */}
                    <div className="text-sm font-semibold text-zinc-600">
                        Login/Logout
                    </div>
                </div>
            </nav>
        </header>
    );
}
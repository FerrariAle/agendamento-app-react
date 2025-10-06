import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'

//  1. Função de busca
const fetchAppointments = async (token) => {
    const response = await fetch('https://dummyjson.com/carts', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error('Falha ao buscar os agendamentos.')
    }
    return response.json();
};

export default function AdminDashboardPage() {
    const { token } = useAuth();

    const { data, status, error } = useQuery({
        queryKey: ['appointments', token],
        queryFn: () => fetchAppointments(token),
        enabled: !!token,
    })

    if (status === 'pending') {
        return <p className="text-center text-zinc-500">Carregando dashboard...</p>
    }

    if (status === 'error') {
        return <p className="text-center text-red-500">Erro: {error.message}</p>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-zinc-800">Dashboard de Administração</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-zinc-700">Próximos Agendamentos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-zinc-200">
                                <th className="p-4 font-semibold">Cliente ID</th>
                                <th className="p-4 font-semibold">Total de Itens</th>
                                <th className="p-4 font-semibold">Valor Total</th>
                                <th className="p-4 font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.carts?.map(cart => (
                                <tr key={cart.id} className="border-b border-zinc-200 last:border-b-0">
                                    <td className="p-4 text-zinc-600">Usuário #{cart.userId}</td>
                                    <td className="p-4 text-zinc-600">{cart.totalProducts}</td>
                                    <td className="p-4 font-bold text-zinc-800">
                                        R$ {cart.total.toLocaleString('pt-BR')}
                                    </td>
                                    <td className="p-4">
                                        <Link to={`/admin/appointments/${cart.id}`} className='font-semibold text-primary-800 hover:underline text-sm'>
                                            Ver Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
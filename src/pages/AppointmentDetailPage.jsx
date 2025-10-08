import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const fetchAppointmentDetails = async (appointmentId, token) => {
    const response = await fetch(`https://dummyjson.com/carts/${appointmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar detalhes do agendamento.');
    return response.json();
};

const deleteAppointment = async ({ token, appointmentId }) => {
    const response = await fetch(`https://dummyjson.com/carts/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Falha ao deletar o agendamento.');
    return response.json();
};

export default function AppointmentDetailPage() {
    const { appointmentId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: appointment, status, error } = useQuery({
        queryKey: ['appointment', appointmentId],
        queryFn: () => fetchAppointmentDetails(appointmentId, token),
        enabled: !!token && !!appointmentId,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            // Invalida a lista de agendamentos e o detalhe deste agendamento.
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.removeQueries({ queryKey: ['appointment', appointmentId] });
            alert('Agendamento deletado com sucesso!');
            navigate('/admin/dashboard');
        },
        onError: (error) => alert(error.message),
    });

    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja deletar este agendamento?')) {
            deleteMutation.mutate({ token, appointmentId });
        }
    };

    if (status === "pending") {
        return <p>Carregando detalhes do agendamento...</p>
    }

    if (status === "error") {
        return <p className="text-red-500">Erro: {error.message}</p>
    }

    return (
        <div className="space-y-8">
            <Link to="/admin/dashboard" className="text-sm font-semibold text-primary-800 hover:underline">
                &larr; Voltar ao Dashboard
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
                <header className="border-b border-zinc-200 pb-6 mb-6 flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-800">Agendamento #{appointment.id}</h1>
                        <p className="text-zinc-500">ID do Cliente: {appointment.userId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to={`/admin/appointments/${appointmentId}/edit`} className="bg-primary-900 text-white font-semibold py-2 px-6 rounded-full text-sm hover:bg-primary-800 transition-colors">
                            Editar
                        </Link>
                        <button onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-primary-900 text-white font-semibold py-2 px-6 rounded-full text-sm hover:bg-primary-800 transition-colors">
                            {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
                        </button>
                    </div>
                </header>

                <div>
                    <h2 className="text-xl font-semibold text-zinc-700 mb-4">Serviços/Produtos Agendados</h2>
                    <div className="space-y-4">
                        {appointment.products.map(product => (
                            <div key={product.id} className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl">
                                <div>
                                    <p className="font-semibold">{product.title}</p>
                                    <p className="text-sm text-zinc-600">
                                        Quantidade: {product.quantity}
                                    </p>
                                </div>
                                <div className="font-bold text-zinc-800">
                                    R$ {product.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <footer className="border-t border-zinc-200 pt-4 mt-6 text-right">
                    <p className="text-zinc-600">Total de Itens: <span className="font-bold">{appointment.totalProducts}</span></p>
                    <p className="text-2xl font-bold text-zinc-800">
                        Valor Total: <span className="text-primary-900">R$ {appointment.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </p>
                </footer>
            </div>
        </div>
    )
}
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// --- Função de Mutação (criar agendamento) ---
const createAppointment = async ({ token, data }) => {
    const response = await fetch('https://dummyjson.com/carts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            userId: data.userId,
            products: data.products,
        }),
    });
    if (!response.ok) throw new Error('Falha ao criar o agendamento.');
    return response.json();
}

const updateAppointment = async ({ token, appointmentId, data }) => {
    const response = await fetch(`https://dummyjson.com/carts/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ merge: true, products: data.products })
    });
    if (!response.ok) throw new Error('Falha ao atualizar o agendamento.');
    return response.json();
}

const fetchAppointmentForEdit = async (appointmentId, token) => {
    const response = await fetch(`https://dummyjson.com/carts/${appointmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar detalhes do agendamento.');
    return response.json();
};

export default function AppointmentFormPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { appointmentId } = useParams();
    const isEditing = Boolean(appointmentId);

    // Busca inicial APENAS se tiver em modo edição
    useQuery({
        queryKey: ['appointment', appointmentId],
        queryFn: () => fetchAppointmentForEdit(appointmentId, token),
        enabled: isEditing && !!token,
        onSuccess: (data) => {
            reset({ userId: data.userId, products: data.products })
        }
    });

    // useForm para controle geral
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            userId: '',
            products: [{ id: '', quantity: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const mutation = useMutation({
        mutationFn: isEditing ? updateAppointment : createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            if (isEditing) {
                queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
            }
            alert(`Agendamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate(isEditing ? `/admin/appointments/${appointmentId}` : '/admin/dashboard');
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            userId: Number(data.userId),
            products: data.products.map(p => ({
                id: Number(p.id),
                quantity: Number(p.quantity),
            })),
        };
        const mutationVariables = ({ token, data: formattedData });
        if (isEditing) {
            mutationVariables.appointmentId = appointmentId;
        }
        mutation.mutate(mutationVariables);
    };

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-sm font-semibold text-primary-800 hover:underline">
                &larr; Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-semibold text-zinc-800">{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-sm space-y-6 max-w-2xl">
                {/* Campo do User ID */}
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium">ID do Cliente</label>
                    <input
                        id="userId" type="number"
                        {...register('userId', { required: 'ID do cliente é obrigatório.' })}
                        className="mt-1 block w-full px-3 py-2 bg-zinc-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Serviços/Produtos</h3>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg">
                                <input
                                    type="number" placeholder="ID do Produto"
                                    {...register(`products.${index}.id`, { required: true })}
                                    className="w-1/3 p-2 bg-white rounded-md border border-zinc-300"
                                />
                                <input
                                    type="number" placeholder="Quantidade"
                                    {...register(`products.${index}.quantity`, { required: true, min: 1 })}
                                    className="w-1/3 p-2 bg-white rounded-md border border-zinc-300"
                                />
                                <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ id: '', quantity: '' })}
                        className="mt-4 text-sm font-semibold text-primary-900 hover:underline"
                    >
                        + Adicionar Produto
                    </button>
                </div>

                {/* Botão de Simulação */}
                <button
                    type="submit" disabled={mutation.isPending}
                    className="w-full py-3 px-4 mt-4 rounded-full font-bold text-white bg-primary-900 hover:bg-primary-800 disabled:bg-zinc-400"
                >
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Agendamento')}
                </button>
            </form>
        </div>
    )
}
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appendErrors, useForm } from "react-hook-form";
import Modal from '../components/Modal'
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css'
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- FUNÇÃO AUXILIAR ---
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return slots;
}

const timeSlots = generateTimeSlots();

const createAppointment = async (appointmentData) => {
    // Em caso real, seria um POST para a API
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: appointmentData }), 1000));
}

export default function PublicBookingPage() {

    const [selectedDate, setSelectedDate] = useState();
    const [selectedTime, setSelectedTime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            alert('Seu agendamento foi confirmado com sucesso!');
            setIsModalOpen(false);
            setSelectedDate(undefined);
            setSelectedTime(null);
        },
        onError: (error) => {
            alert(`Erro ao agendar: ${error.message}`)
        }
    })

    const onFinalSubmit = (formData) => {
        const appointmentData = {
            ...formData,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
        };
        mutation.mutate(appointmentData)
    }

    useEffect(() => {
        setSelectedTime(null);
    }, [selectedDate]);

    // --- LÓGICA DE APRESENTAÇÃO ---
    let footer = <p>Por favor, selecione um dia.</p>
    if (selectedDate) {
        footer = <p>Você selecionou {format(selectedDate, 'PPP', { locale: ptBR })}.</p>
    }

    return (
        <div className="flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-zinc-800 mb-6 text-center">Agende seu Horário</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                    {/* Coluna do Calendário (sem mudanças) */}
                    <div>
                        <h2 className="font-semibold text-center mb-4">1. Escolha a data</h2>
                        <div className="flex justify-center p-4 bg-zinc-50 rounded-2xl">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                navLayout="around"
                                footer={footer}
                                locale={ptBR}
                                disabled={{ before: new Date() }} // Desabilita dias passados
                                className="mx-auto"
                            />
                        </div>
                    </div>

                    {/* Coluna dos Horários (Evoluída) */}
                    <div>
                        <h2 className="font-semibold text-center mb-4">2. Escolha o horário</h2>
                        {/* 4. Raciocínio (Renderização Condicional): Mostramos os horários APENAS se uma data foi selecionada. */}
                        {selectedDate ? (
                            <div className="grid grid-cols-3 gap-2">
                                {/* 5. Mapeamos nossa lista de horários para criar os botões */}
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        // 6. Raciocínio (Ação do Usuário): onClick atualiza o estado 'selectedTime'.
                                        onClick={() => setSelectedTime(time)}
                                        // Raciocínio de Estilo: Aplicamos o estilo 'primary' se este for o horário selecionado.
                                        className={`p-3 rounded-xl text-center font-semibold transition-colors ${selectedTime === time
                                            ? 'bg-primary-900 text-white'
                                            : 'bg-zinc-100 hover:bg-zinc-200'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-zinc-50 rounded-lg">
                                <p className="text-zinc-500 text-center">Selecione uma data para ver os horários.</p>
                            </div>
                        )}

                        {/* 7. Raciocínio (Ação Final): O botão de confirmação só fica ativo se
                uma data E um horário foram selecionados. */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={!selectedDate || !selectedTime}
                            className="w-full mt-6 py-3 px-6 bg-primary-900 text-white font-bold rounded-full hover:bg-primary-800 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Confirmar Agendamento
                        </button>

                    </div>

                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-bold text-zinc-800 mb-2">Confirmar Agendamento</h2>
                <p className="text-zinc-600 mb-6 mt-6">
                    Você está agendando para: <br />
                    <strong className="text-primary-900">{selectedDate && format(selectedDate, 'PPP', { locale: ptBR })}</strong> às <strong>{selectedTime}</strong>
                </p>
                <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Seu Nome</label>
                        <input type="text" id="name" {...register('name', { required: 'O nome é obrigatório.' })} className="mt-1 block w-full px-3 py-2 bg-zinc-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Seu Email</label>
                        <input type="email" id="email" {...register('email', { required: 'O email é obrigatório.' })} className="mt-1 block w-full px-3 py-2 bg-zinc-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 px-4 rounded-full font-semibold text-zinc-700 bg-zinc-200 hover:bg-zinc-300 transition-colors">Cancelar</button>
                        <button type="submit" disabled={mutation.isPending} className="w-full py-2 px-4 rounded-full font-semibold text-white bg-primary-900 hover:bg-primary-800 disabled:bg-zinc-400 transition-colors">
                            {mutation.isPending ? 'Confirmando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
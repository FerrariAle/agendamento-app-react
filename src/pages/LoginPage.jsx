import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    // 1. Estado local para erros vindos da API
    const [apiError, setApiError] = useState(null);

    const { login, isAuthenticating } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm();

    // 2. Função callback para o formulário
    const onSubmit = async (data) => {
        setApiError(null);
        try {
            await login(data.username, data.password);
        } catch (err) {
            setApiError(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm">
                <h1 className="text-3xl font-semibold text-zinc-800 text-center mb-1">Acesso Admin</h1>
                <p className="text-zinc-500 text-center mb-6">Entre com suas credenciais.</p>

                {apiError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
                        <p className="font-bold">Falha no Login</p>
                        <p>{apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            defaultValue="emilys"
                            {...register('username', { required: 'O nome de usuário é obrigatório.' })}
                            className="mt-1 block w-full px-3 py-2 bg-zinc-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Senha</label>
                        <input
                            id="password"
                            type="password"
                            defaultValue="emilyspass"
                            {...register('password', { required: 'A senha é obrigatória.' })}
                            className="mt-1 block w-full px-3 py-2 bg-zinc-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 disabled:bg-zinc-400"
                        >
                            {isAuthenticating ? "Entrando..." : "Entrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
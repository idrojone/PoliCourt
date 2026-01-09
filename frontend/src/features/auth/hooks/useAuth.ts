import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginUserRequest, LoginUserResponse, RegisterRequest, RegisterResponse } from "../types";
import { useAuthContext } from "../context/AuthContext";
import { loginRequest, registerRequest } from "../api/authApi";
import Swal from "sweetalert2";

export const useAuth = () => {
    const navigate = useNavigate();
    const { setUser, isAuthenticated, user, isLoading, logout } = useAuthContext();

    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => registerRequest(data),
        onSuccess: (response: RegisterResponse) => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: response.data?.message || response.message,
            }).then(() => {
                navigate('/login');
            });
        },
        onError: (error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: error.response?.data?.message || 'Ocurrió un error inesperado.',
            });
        },
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginUserRequest) => loginRequest(data),
        onSuccess: (response: LoginUserResponse) => {
            if (response.success && response.data) {
                localStorage.setItem('token', response.data.accessToken);

                setUser(response.data.user);

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola de nuevo, ${response.data.user.fullName}`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/');
                });
            }
        },
        onError: (error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: error.response?.data?.message || 'Credenciales inválidas.',
            });
        }
    });

    return ({
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        user,
        isAuthenticated,
        isLoading,
        logout
    })
};
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import type { RegisterRequest } from "../types";

const registerSchema = z.object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Introduce un correo electrónico válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const RegisterForm = () => {
    const { register: registerUser, isRegistering } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterRequest) => {
        registerUser(data);
    };

    return (
        <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
            <div className="grid gap-2">
                <label
                className="text-sm font-medium leading-none"
                htmlFor="fullName">
                Nombre Completo
                </label>
                <input
                {...register("fullName")}
                id="fullName"
                placeholder="Juan Pérez"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                disabled={isRegistering}
                />
                {errors.fullName && (
                <p className="text-xs text-destructive">
                    {errors.fullName.message}
                </p>
                )}
            </div>
            <div className="grid gap-2">
                <label
                className="text-sm font-medium leading-none"
                htmlFor="username">
                Nombre de Usuario
                </label>
                <input
                {...register("username")}
                id="username"
                placeholder="jperez"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                disabled={isRegistering}
                />
                {errors.username && (
                <p className="text-xs text-destructive">
                    {errors.username.message}
                </p>
                )}
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
                </label>
                <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                disabled={isRegistering}
                />
                {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
            </div>
            <div className="grid gap-2">
                <label
                className="text-sm font-medium leading-none"
                htmlFor="password">
                Contraseña
                </label>
                <input
                {...register("password")}
                id="password"
                type="password"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                disabled={isRegistering}
                />
                {errors.password && (
                <p className="text-xs text-destructive">
                    {errors.password.message}
                </p>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? "Creando cuenta..." : "Registrarse"}
            </Button>
            </div>
        </form>
        <div className="text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary">
            Inicia sesión
            </Link>
        </div>
        </div>
    );
};

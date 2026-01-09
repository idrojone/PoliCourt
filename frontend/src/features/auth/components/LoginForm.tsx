import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth"; // Importamos el hook

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login?.(data);
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="tu@email.com"
              disabled={isLoggingIn}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="password">
                Contraseña
              </label>
            </div>
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoggingIn}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Iniciando sesión..." : "Entrar"}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="underline underline-offset-4 hover:text-primary">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};

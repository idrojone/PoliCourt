import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/features/auth/mutations/useLoginMutation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo electrónico no válida" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      await loginMutation.mutateAsync(data);
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
          setAuthError("Correo o contraseña incorrectos");
      } else {
          setAuthError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <Card className="relative overflow-hidden border border-cyan-200/60 bg-white/80 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-cyan-300/30 dark:bg-slate-950/75 dark:text-white dark:shadow-[0_0_45px_rgba(34,211,238,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18)_0%,transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25)_0%,transparent_55%)]" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-400/20" />
      <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-lime-200/20 blur-3xl dark:bg-lime-300/10" />

      <CardHeader className="relative space-y-2 border-b border-slate-200/80 dark:border-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-700/80 dark:text-cyan-200/80">
          Acceso
        </p>
        <CardTitle className="text-2xl font-black">Bienvenido de nuevo</CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-200/80">
          Ingresa tu correo y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {authError && (
          <Alert variant="destructive" className="mb-4 border-rose-300/60 bg-rose-100/70 text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-100">
            <AlertDescription className="text-rose-700 dark:text-rose-100">{authError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-200/70">
                    Correo electronico
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="correo@ejemplo.com"
                      className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-300/40 dark:border-cyan-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-200/70">
                    Contrasena
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-300/40 dark:border-cyan-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-300 via-lime-300 to-emerald-300 text-slate-900 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:brightness-110"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="relative flex flex-col space-y-2 text-center text-sm">
        <div className="text-slate-600 dark:text-slate-200/70">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-200 dark:hover:text-cyan-100">
            Regístrate
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

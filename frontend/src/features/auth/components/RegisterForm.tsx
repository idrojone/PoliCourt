import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "@/features/auth/mutations/useRegisterMutation";
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

const registerSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es obligatorio" }),
  lastName: z.string().min(1, { message: "El apellido es obligatorio" }),
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Dirección de correo electrónico no válida" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    try {
      await registerMutation.mutateAsync(data);
      toast.success("Cuenta creada con éxito", {
          description: "Ahora puedes iniciar sesión con tus credenciales",
      });
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data?.message) {
         setAuthError(error.response.data.message);
      } else {
         setAuthError("Error al registrarse. Nombre de usuario o correo ya en uso.");
      }
    }
  };

  return (
    <Card className="relative overflow-hidden border border-lime-200/60 bg-white/80 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-lime-300/30 dark:bg-slate-950/75 dark:text-white dark:shadow-[0_0_45px_rgba(132,204,22,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.18)_0%,transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.2)_0%,transparent_55%)]" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-lime-300/25 blur-3xl dark:bg-lime-300/20" />
      <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-300/10" />

      <CardHeader className="relative space-y-2 border-b border-slate-200/80 dark:border-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-lime-700/80 dark:text-lime-200/80">
          Registro
        </p>
        <CardTitle className="text-2xl font-black">Crear una cuenta</CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-200/80">
          Ingresa tus datos a continuacion para registrarte
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-200/70">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan"
                          className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-lime-300/40 dark:border-lime-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-200/70">
                        Apellidos
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Perez"
                          className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-lime-300/40 dark:border-lime-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
                          {...field}
                        />
                      </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-200/70">
                    Nombre de usuario
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="juanperez123"
                      className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-lime-300/40 dark:border-lime-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-lime-300/40 dark:border-lime-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
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
                      className="border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus-visible:ring-lime-300/40 dark:border-lime-200/20 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-300 via-cyan-300 to-emerald-300 text-slate-900 shadow-[0_0_25px_rgba(132,204,22,0.35)] hover:brightness-110"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="relative flex flex-col space-y-2 text-center text-sm">
        <div className="text-slate-600 dark:text-slate-200/70">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="font-semibold text-lime-700 hover:text-lime-600 dark:text-lime-200 dark:hover:text-lime-100">
            Inicia sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

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
    <Card className="w-[400px] shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Bienvenido de nuevo</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@ejemplo.com" {...field} />
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
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-center">
        <div className="text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Regístrate
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

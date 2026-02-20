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
    <Card className="w-[500px] shadow-2xl mt-auto mb-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Crear una cuenta</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus datos a continuación para registrarte
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
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
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
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
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
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="juanperez123" {...field} />
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
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-center">
        <div className="text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

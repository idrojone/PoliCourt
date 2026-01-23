import { RegisterForm } from "@/features/auth/components/register-form";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button asChild size="icon" variant="ghost">
          <Link to="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
        <ModeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Crear cuenta</h1>
          <p className="text-muted-foreground">
            Ingresa tus datos para registrarte
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

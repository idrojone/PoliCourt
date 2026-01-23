import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                PC
              </span>
            </div>
            <span className="font-bold text-lg text-foreground">PoliCourt</span>
          </Link>

          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            <Link
              to="/pistas"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pistas
            </Link>
            <Link
              to="/clubes"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Clubes
            </Link>
            <Link
              to="/clases"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Clases
            </Link>
            <Link
              to="/horarios"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Horarios
            </Link>
            <Link
              to="/contacto"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/register" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Crear una cuenta
              </Link>
            </Button>
            <ModeToggle />
          </div>

          {/*<div className="hidden md:flex items-center gap-4">
            {isAuthenticated && !isLoading ? (
              <>
                <UserMenu />
                <ModeToggle />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/register" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Crear una cuenta
                  </Link>
                </Button>
                <ModeToggle />
              </>
            )}
          </div>*/}

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                to="/pistas"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pistas
              </Link>
              <Link
                to="/clubes"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Clubes
              </Link>
              <Link
                to="/reservas"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reservas
              </Link>
              <Link
                to="/horarios"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Horarios
              </Link>
              <Link
                to="/contacto"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/register" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Crear una cuenta
                  </Link>
                </Button>
                <ModeToggle />
              </div>
              {/*<div className="hidden md:flex items-center gap-4">
                {isAuthenticated && !isLoading ? (
                  <>
                    <UserMenu />
                    <ModeToggle />
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link to="/register" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Crear una cuenta
                      </Link>
                    </Button>
                    <ModeToggle />
                  </>
                )}
              </div>*/}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

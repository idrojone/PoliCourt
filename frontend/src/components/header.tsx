import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserMenu } from "@/features/user/components/user-menu";
import { useAuth } from "@/features/auth/context/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 -z-10 border-b border-white/10 bg-background/70 backdrop-blur-xl" />
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 shadow-[0_0_18px_rgba(125,211,252,0.25)]">
              <span className="text-sm font-semibold text-primary">PC</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-wide text-foreground">
                PoliCourt
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Sports Hub
              </span>
            </div>
          </Link>

          <nav className="glass-pill hidden items-center gap-6 px-6 py-2 text-sm text-muted-foreground lg:flex">
            <Link
              to="/pistas"
              className="transition-colors hover:text-foreground"
            >
              Pistas
            </Link>
            <Link
              to="/clubes"
              className="transition-colors hover:text-foreground"
            >
              Clubes
            </Link>
            <Link
              to="/clases"
              className="transition-colors hover:text-foreground"
            >
              Clases
            </Link>
            <Link
              to="/contacto"
              className="transition-colors hover:text-foreground"
            >
              Contacto
            </Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <UserMenu />
                <ModeToggle />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground hover:bg-white/5">
                  <Link to="/login">Iniciar Sesion</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] text-[#001f2e] shadow-[0_0_22px_rgba(125,211,252,0.35)] transition hover:translate-y-[-1px]"
                >
                  <Link to="/register" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Crear una cuenta
                  </Link>
                </Button>
                <ModeToggle />
              </>
            )}
          </div>

          <button
            className="glass-panel flex items-center justify-center px-3 py-2 text-foreground lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="glass-panel mb-4 rounded-2xl p-4 lg:hidden">
            <nav className="flex flex-col gap-4 text-sm">
              <Link
                to="/pistas"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Pistas
              </Link>
              <Link
                to="/clubes"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Clubes
              </Link>
              <Link
                to="/clases"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Clases
              </Link>
              <Link
                to="/contacto"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Contacto
              </Link>

              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                {isAuthenticated ? (
                  <>
                    <UserMenu />
                    <ModeToggle />
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground hover:bg-white/5">
                      <Link to="/login">Iniciar Sesion</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] text-[#001f2e] shadow-[0_0_18px_rgba(125,211,252,0.3)]"
                    >
                      <Link to="/register" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Crear una cuenta
                      </Link>
                    </Button>
                    <ModeToggle />
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

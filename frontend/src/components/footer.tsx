import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background/80">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(125,211,252,0.12),transparent_65%)]" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 shadow-[0_0_18px_rgba(125,211,252,0.25)]">
                <span className="text-sm font-semibold text-primary">PC</span>
              </div>
              <span className="font-bold text-lg text-foreground">
                PoliCourt
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Tu polideportivo de confianza. Las mejores instalaciones para
              disfrutar del deporte.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Instalaciones
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Pistas de Pádel
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Pistas de Tenis
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Campos de Fútbol Sala
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Canchas de Baloncesto
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Piscina
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Reservas Online
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Clubes Deportivos
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Clases y Entrenadores
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Av. Deportiva 123, Ontinyent
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +34 912 345 678
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                info@policourt.es
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 PoliCourt. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="#"
              className="text-muted-foreground transition-colors hover:text-foreground">
              Privacidad
            </Link>
            <Link
              to="#"
              className="text-muted-foreground transition-colors hover:text-foreground">
              Términos
            </Link>
            <Link
              to="#"
              className="text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection({ courts, clubs, users }: { courts: number; clubs: number; users: number }) {
  const stats = [
    { value: `${courts}+`, label: "Pistas disponibles" },
    { value: `${clubs}+`, label: "Clubes activos" },
    { value: `${users}+`, label: "Socios" },
    { value: "24/7", label: "Reservas online" },
  ];

  return (
    <section className="relative -mt-16 min-h-screen overflow-hidden lg:-mt-20">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 opacity-45">
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="meshStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(125, 211, 252, 0.4)" />
              <stop offset="100%" stopColor="rgba(200, 160, 240, 0.25)" />
            </linearGradient>
          </defs>
          <g stroke="url(#meshStroke)" strokeWidth="1" fill="none" opacity="0.9">
            <path d="M-20 120 L160 40 L320 160 L480 80 L660 170 L860 60 L1220 140" />
            <path d="M-40 260 L140 180 L340 300 L520 220 L720 310 L900 200 L1240 280" />
            <path d="M-30 420 L160 320 L360 430 L520 340 L720 460 L920 360 L1220 440" />
            <path d="M0 600 L180 520 L360 620 L520 540 L720 650 L920 560 L1200 640" />
            <path d="M200 -40 L280 120 L200 300 L320 460 L260 680" />
            <path d="M420 -40 L520 140 L440 320 L560 520 L520 760" />
            <path d="M660 -40 L760 140 L680 320 L820 520 L780 760" />
            <path d="M900 -40 L1020 140 L940 320 L1060 520 L1020 760" />
          </g>
          <g fill="rgba(125, 211, 252, 0.15)">
            <circle cx="160" cy="40" r="6" />
            <circle cx="520" cy="220" r="5" />
            <circle cx="860" cy="60" r="6" />
            <circle cx="720" cy="460" r="5" />
            <circle cx="320" cy="620" r="6" />
          </g>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-20 pt-28 lg:pb-28 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8 animate-fade-up">
            <span className="glass-pill inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary/80">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(125,211,252,0.8)]" />
              PoliCourt
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-foreground text-balance sm:text-5xl lg:text-7xl">
                Reserva. Juega. <span className="text-primary">Triunfa.</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Accede a instalaciones premium, entrena con la mejor comunidad y reserva
                pistas en segundos. Vive el deporte al maximo nivel.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/pistas">
                <Button
                  size="lg"
                  className="bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] px-8 text-base text-[#001f2e] shadow-[0_0_24px_rgba(125,211,252,0.4)] transition hover:translate-y-[-1px]"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar pista
                </Button>
              </Link>
              <Link to="/clubes">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-panel border-white/20 bg-white/5 px-8 text-base text-foreground hover:bg-white/10"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Ver clubes
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-2xl px-4 py-3">
                  <div className="text-2xl font-semibold text-primary sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-10 rounded-[48px] bg-[radial-gradient(circle,rgba(125,211,252,0.35),transparent_70%)] blur-3xl" />
            <div className="glass-card relative overflow-hidden rounded-[32px] animate-float-slow">
              <img
                src="/src/assets/basketball-player-dunking-action-shot-professional.jpg"
                alt="Atleta en accion"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,26,0.1),rgba(10,14,26,0.85))]" />
              <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground/80">
                Elite
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-panel rounded-2xl px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Sesiones activas</p>
                  <p className="text-lg font-semibold text-foreground">+120 reservas en tiempo real</p>
                  <p className="text-sm text-muted-foreground">Disponible en todas las sedes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

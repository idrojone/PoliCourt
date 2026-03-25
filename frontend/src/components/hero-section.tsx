import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection( { courts, clubs, users }: { courts: number; clubs: number; users: number } ) {
  return (
    <section className="relative -mt-16 min-h-screen pt-16 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            // "url('/src/assets/modern-sports-facility-interior-with-tennis-courts.jpg')",
            "url('/src/assets/swimmer-freestyle-stroke-action-professional-pool.jpg')",
        }}>
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
          Tu polideportivo de confianza
        </span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Reserva. Juega.
          <span className="text-primary"> Disfruta.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
          Accede a las mejores instalaciones deportivas de la ciudad. Reserva
          pistas, únete a clubes y vive la experiencia deportiva que mereces.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/pistas">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
              <Calendar className="w-5 h-5 mr-2" />
              Reservar Pista
            </Button>
          </Link>
          <Link to="/clubes">
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary text-lg px-8 bg-transparent">
              <Users className="w-5 h-5 mr-2" />
              Ver Clubes
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: `${courts}+`, label: "Pistas disponibles" },
            { value: `${clubs}+`, label: "Clubes activos" },
            { value: `${users}+`, label: "Socios" },
            { value: "24/7", label: "Reservas online" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

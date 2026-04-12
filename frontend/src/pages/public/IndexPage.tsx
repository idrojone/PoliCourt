import { HeroSection } from "@/components/hero-section"
import { useClubsPageQuery } from "@/features/club/queries/useClubsPageQuery.fa"
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery.fa"
import { useSportsPageQuery } from "@/features/sport/queries/useSportsPageQuery.fa"
import { useUserCountQuery } from "@/features/user/queries/useUserCountQuery"
import { MainLayout } from "@/layout/main"
import { CourtsCarousel } from "@/features/court/components/courts-carousel"
import { ClubsCarousel } from "@/features/club/components/clubs-carousel"
import { SportsGrid } from "@/features/sport/components/sports-grid"
import { RequestMonitor } from "@/components/request-monitor"

export const IndexPage = () => {
  // Users count
  const { data: userCount } = useUserCountQuery()

  // Pistas
  const { data: sports } = useSportsPageQuery({})

  // Courts
  const { data: courts, isLoading: isLoadingCourts, isError: isErrorCourts } = useCourtsPageQuery({ limit: 100 })

  // Clubs
  const { data: clubs } = useClubsPageQuery({ limit: 100 })

  return (
    <MainLayout>
      <HeroSection
        courts={courts?.content?.length || 0}
        clubs={clubs?.content?.length || 0}
        users={userCount || 0}
      />

      <section className="relative py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(125,211,252,0.12),transparent_60%)]" />
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4">
            <span className="glass-pill inline-flex w-fit px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary/70">
              Pistas destacadas
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              Nuestras pistas disponibles
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Explora la seleccion de pistas premium para cada disciplina. Reserva tu
              espacio y juega con toda la energia.
            </p>
          </div>

          {isLoadingCourts ? (
            <div className="flex min-h-75 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : isErrorCourts ? (
            <div className="py-10 text-center text-red-400">
              Error al cargar las pistas. Por favor, intentalo de nuevo mas tarde.
            </div>
          ) : (
            <CourtsCarousel courts={courts?.content || []} />
          )}
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(15,21,36,0.7),rgba(10,14,26,1))]" />
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4">
            <span className="glass-pill inline-flex w-fit px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary/70">
              Deportes
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              Encuentra tu proxima pasion
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Instalaciones de alto nivel para una variedad completa de deportes.
              Entrena, compite y mejora cada dia.
            </p>
          </div>

          <SportsGrid sports={sports || []} />
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(125,211,252,0.08),transparent_60%)]" />
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4">
            <span className="glass-pill inline-flex w-fit px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary/70">
              Clubes
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              Nuestros clubes
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Conecta con atletas y equipos locales. Participa en torneos y crece
              con la comunidad.
            </p>
          </div>

          <ClubsCarousel clubs={clubs?.content || []} />
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(15,21,36,0.85),rgba(10,14,26,1))]" />
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <span className="glass-pill inline-flex w-fit px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary/70">
                Monitor
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
                Quieres ser monitor?
              </h2>
              <p className="text-lg text-muted-foreground">
                Comparte tu experiencia deportiva, define tus disponibilidades y
                acompana a la comunidad. Buscamos perfiles comprometidos y con
                energia.
              </p>
              <div className="grid gap-3 text-sm text-muted-foreground">
                <div className="glass-panel rounded-2xl px-4 py-3">
                  Gestiona tus clases y reservas desde un panel dedicado.
                </div>
                <div className="glass-panel rounded-2xl px-4 py-3">
                  Sube credenciales y diplomas para validar tu trayectoria.
                </div>
                <div className="glass-panel rounded-2xl px-4 py-3">
                  Conecta con deportistas que buscan tu especialidad.
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <RequestMonitor />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
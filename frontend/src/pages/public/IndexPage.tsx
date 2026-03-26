import { HeroSection } from "@/components/hero-section"
import { useClubsPageQuery } from "@/features/club/queries/useClubsPageQuery.fa"
import { useCourtsPageQuery } from "@/features/court/queries/useCourtsPageQuery.fa"
import { useSportsPageQuery } from "@/features/sport/queries/useSportsPageQuery.fa"
import { useUserCountQuery } from "@/features/user/queries/useUserCountQuery"
import { MainLayout } from "@/layout/main"
import { CourtsCarousel } from "@/features/court/components/courts-carousel"
import { ClubsCarousel } from "@/features/club/components/clubs-carousel"
import { SportsGrid } from "@/features/sport/components/sports-grid"
import { useAuth } from "@/features/auth/context/AuthContext"

export const IndexPage = () => {
  const { isAuthenticated, isInitializing } = useAuth()
  const canLoadPublicData = !isInitializing && isAuthenticated

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
          users={userCount || 0}></HeroSection>

        <section className="py-16 container mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Nuestras Pistas Disponibles
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explora nuestra selección de pistas de alta calidad para todos los
              deportes. Encuentra el espacio perfecto para tu próximo partido o
              entrenamiento.
            </p>
          </div>

          {isLoadingCourts ? (
            <div className="flex items-center justify-center min-h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isErrorCourts ? (
            <div className="text-center py-10 text-red-500">
              Error al cargar las pistas. Por favor, inténtalo de nuevo más
              tarde.
            </div>
          ) : (
            <CourtsCarousel courts={courts?.content || []} />
          )}
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Deportes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Encuentra tu pasión. Tenemos instalaciones para una amplia
              variedad de deportes.
            </p>
          </div>

          <SportsGrid sports={sports || []} />
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Nuestros Clubes
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Únete a una comunidad apasionada. Descubre clubes deportivos,
                participa en torneos y mejora tu juego con los mejores.
              </p>
            </div>

            <ClubsCarousel clubs={clubs?.content || []} />
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              ¿Quieres ser monitor?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Si te interesa convertirte en monitor, aquí podrás enviar tu
              solicitud, compartir tu experiencia deportiva y elegir tus
              disponibilidades. Estamos buscando gente comprometida para acompañar
              y mejorar las actividades de la comunidad.
            </p>
          </div>

         
        </section>
      </MainLayout>
    );
}
import { HeaderPage } from "@/components/header-page";
import { MainLayout } from "@/layout/main";
import { CourtPageFilters } from "@/features/court/components/court-page-filters";
import { CourtListSection } from "@/features/court/components/court-list-section";

export const CourtPage = () => {
  return (
      <MainLayout>
          <HeaderPage title="Nuestras Pistas" description="Descubre nuestras pistas deportivas, sus características, disponibilidad y cómo reservar tu espacio para jugar." />

          <section className="py-8">
            <div className="container mx-auto px-4">
              <CourtPageFilters />
            </div>
          </section>

          <section>
            <div className="container mx-auto px-4">
              <CourtListSection />
            </div>
          </section>

      </MainLayout>
  );
}
import { HeaderPage } from "@/components/header-page";
import { MainLayout } from "@/layout/main";
import { ClasesPageFilters } from "@/features/booking/components/class/clases-page-filters";
import { ClasesListSection } from "@/features/booking/components/class/clases-list-section";

export const ClasesPage = () => {
    return (
        <MainLayout>
            <HeaderPage title="Nuestras clases" description="Descubre todas nuestras clases disponibles y reserva la que mejor se adapte a tus necesidades deportivas." />

            <section className="py-8">
              <div className="container mx-auto px-4">
                <ClasesPageFilters />
              </div>
            </section>

            <section>
              <div className="container mx-auto px-4">
                <ClasesListSection />
              </div>
            </section>

        </MainLayout>
    );
}
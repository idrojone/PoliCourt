import { HeaderPage } from "@/components/header-page";
import { TrainingList } from "@/features/trainings/components/training-list";
import { MainLayout } from "@/layout/main";

export const ClasesPage = () => {

    return (
        <MainLayout>
            <HeaderPage title="Nuestras clases" description="Descubre todas nuestras clases disponibles y reserva la que mejor se adapte a tus necesidades deportivas." />
            <TrainingList />
        </MainLayout>
    );
}
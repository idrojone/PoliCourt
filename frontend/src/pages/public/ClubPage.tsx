import { HeaderPage } from "@/components/header-page";
import { MainLayout } from "@/layout/main";

export const ClubPage = () => {
    return (
         <MainLayout>
            <HeaderPage title="Nuestro Club" description="Conoce más sobre nuestro club, su historia, valores y las instalaciones que ofrecemos para nuestros miembros." />
        </MainLayout>
    );
}
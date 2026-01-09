import { CarruselHome } from "@/components/carrusel-home";
import { MainLayout } from "@/layout/MainLayout";
import { Dribbble } from "lucide-react";
export const IndexPage = () => {
    return (
      <MainLayout>
        <div className="flex justify-center items-center mt-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl inline-flex items-center gap-2">
            Bienvenido a PoliCourt
            <Dribbble
              className="w-16 h-16 motion-reduce:animate-bounce transition-all duration-100"
              aria-hidden="true"
            />
          </h1>
        </div>
        <CarruselHome />
      </MainLayout>
    );
};
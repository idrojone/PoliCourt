import { CarruselHome } from "@/components/carrusel-home";
import { MainLayout } from "@/layout/MainLayout";
import { Dribbble } from "lucide-react";
import { Titile } from "@/components/titile";
import deportes from "@/db/deportes.json";
import { SportsGrid } from "@/features/sport/components/SportsGrid";
import { useSport } from "@/features/sport/hooks/useSport";
import { use } from "react";

export const IndexPage = () => {

  // const { deportes, isLoading, isError } = useSport();
  const { deportes } = useSport();

  console.log("Deportes cargados:", deportes);

  return (
    <MainLayout>
      <Titile
        title="Bienvenido a PoliCourt"
        icon={
          <Dribbble
            className="w-16 h-16 motion-reduce:animate-bounce transition-all duration-100"
            aria-hidden="true"
          />
        }
      />
      <CarruselHome />

      {/* Deportes */}

      {/* {isLoading ? (
        <p className="text-center mt-8">Cargando deportes...</p>
      ) : isError ? (
        <p className="text-center mt-8">Error al cargar deportes.</p>
      ) : (
        <SportsGrid deportes={deportes} />
      )} */}
      <SportsGrid deportes={deportes} />
    </MainLayout>
  );
};
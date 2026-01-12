import { CarruselHome } from "@/components/carrusel-home";
import { MainLayout } from "@/layout/MainLayout";
import { Dribbble } from "lucide-react";
import { Titile } from "@/components/titile";
import deportes from "@/db/deportes.json";
import { SportsGrid } from "@/components/SportsGrid";

export const IndexPage = () => {
    return (
      <MainLayout>
        <Titile 
          title="Bienvenido a PoliCourt" 
          icon={
            <Dribbble  
              className="w-16 h-16 motion-reduce:animate-bounce transition-all duration-100"
              aria-hidden="true" /> 
          } 
        />
        <CarruselHome />

        {/* Deportes */}
        <SportsGrid deportes={deportes} />
          
      </MainLayout>
    );
};
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function CarruselHome() {
  return (
    <div className="flex w-full items-center justify-center mt-8">
      <div className="w-4/5 max-w-6xl h-105 md:h-130 lg:h-120 overflow-hidden rounded-lg">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <img
                src="/src/assets/carrusel.jpg"
                alt="Carrusel"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <img
                src="/src/assets/carrusel1.jpg"
                alt="Carrusel"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </CarouselItem>
            <CarouselItem className="h-full">
              <img
                src="/src/assets/carrusel2.jpg"
                alt="Carrusel"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
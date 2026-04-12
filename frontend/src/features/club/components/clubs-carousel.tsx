import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import type { Club } from "@/features/types/club/Club"
import { ClubCardPublic } from "./club-card-public"

interface ClubsCarouselProps {
    clubs: Club[]
}

export function ClubsCarousel({ clubs }: ClubsCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    if (!clubs || clubs.length === 0) {
        return null;
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full md:px-12 lg:px-16"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent className="-ml-4">
                {clubs.map((club) => (
                    <CarouselItem key={club.slug} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div className="p-1 h-full">
                            <ClubCardPublic club={club} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="glass-panel hidden md:flex left-2 lg:left-3 border-black/10 dark:border-white/20 bg-white/70 dark:bg-card/60 text-foreground/70 hover:text-foreground" />
            <CarouselNext className="glass-panel hidden md:flex right-2 lg:right-3 border-black/10 dark:border-white/20 bg-white/70 dark:bg-card/60 text-foreground/70 hover:text-foreground" />
        </Carousel>
    )
}

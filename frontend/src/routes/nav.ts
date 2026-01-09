export type NavItem = {
    title: string
    href: string
    description?: string
}

export const deportes: NavItem[] = [
    { title: "Futbol", href: "/docs/primitives/futbol", description: "Pistas de futbol disponibles para reserva." },
    { title: "Tenis", href: "/docs/primitives/tenis", description: "Pistas de tenis de tierra batida y dura." },
    { title: "Pádel", href: "/docs/primitives/padel", description: "Pistas de pádel con iluminación nocturna." },
    { title: "Gimnasio", href: "/docs/primitives/gimnasio", description: "Equipamiento moderno y clases dirigidas." }
]

export const eventos: NavItem[] = [
    { title: "Torneos", href: "/docs/primitives/torneos", description: "Próximos torneos locales y regionales." },
    { title: "Clases", href: "/docs/primitives/clases", description: "Clases particulares y escuelas deportivas." },
]

export const clubs: NavItem[] = [
    { title: "Club A", href: "/docs/primitives/club-a", description: "Sede central con piscina y gimnasio." },
    { title: "Club B", href: "/docs/primitives/club-b", description: "Sede secundaria enfocada en pádel." },
    { title: "Club C", href: "/docs/primitives/club-c", description: "Club con instalaciones para niños y familias." },
    { title: "Club D", href: "/docs/primitives/club-d", description: "Club con enfoque en deportes de equipo." },
]

export type NavItem = {
    title: string
    href: string
    description?: string
}

export const deportes: NavItem[] = [
    { title: "Futbol", href: "/deportes/futbol", description: "Pistas de futbol disponibles para reserva." },
    { title: "Tenis", href: "/deportes/tenis", description: "Pistas de tenis de tierra batida y dura." },
    { title: "Baloncesto", href: "/deportes/baloncesto", description: "Pistas de baloncesto con iluminación nocturna." },
    { title: "Ciclismo", href: "/deportes/ciclismo", description: "Rutas y pistas para ciclismo de montaña y carretera." }
]

export const eventos: NavItem[] = [
    { title: "Torneos", href: "/deportes/torneos", description: "Próximos torneos locales y regionales." },
    { title: "Clases", href: "/deportes/clases", description: "Clases particulares y escuelas deportivas." },
]

export const clubs: NavItem[] = [
    { title: "Club A", href: "/deportes/club-a", description: "Sede central con piscina y gimnasio." },
    { title: "Club B", href: "/deportes/club-b", description: "Sede secundaria enfocada en pádel." },
    { title: "Club C", href: "/deportes/club-c", description: "Club con instalaciones para niños y familias." },
    { title: "Club D", href: "/deportes/club-d", description: "Club con enfoque en deportes de equipo." },
]

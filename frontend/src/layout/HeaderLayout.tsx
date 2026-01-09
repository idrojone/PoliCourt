import { ModeToggle } from "@/components/mode-toggle"
import { HousePlus, UsersIcon, SquareUserRoundIcon, LogIn, Dribbble } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { BrandLogo } from "@/components/header/BrandLogo"
import { MenuGroup } from "@/components/header/MenuGroup"
import { MobileNav } from "@/components/header/MobileNav"
import { UserMenu } from "@/components/header/UserMenu"
import { deportes, eventos, clubs } from "@/routes/nav"

import { useAuthContext } from "@/features/auth"

export const HeaderLayout = () => {
	
	const { isAuthenticated, isLoading } = useAuthContext();

	const menuGroups = [
		{
			label: "Instalaciones",
			items: deportes,
			cta: {
				to: "/docs/primitives/instalaciones",
				icon: <HousePlus className="h-8 w-8" />,
				label: "Todas las instalaciones",
			},
		},
		{
			label: "Eventos",
			items: eventos,
		},
		{
			label: "Clubes",
			items: clubs,
			cta: {
				to: "/docs/primitives/instalaciones",
				icon: <UsersIcon className="h-8 w-8" />,
				label: "Todos los clubes",
			},
		},
		{
			label: "Monitores",
			items: clubs,
			cta: {
				to: "/docs/primitives/instalaciones",
				icon: <SquareUserRoundIcon className="h-8 w-8" />,
				label: "Todos los monitores",
			},
		},
	]

	return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-black border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 text-black dark:text-white">
        <div className="felx algin-center">
          <BrandLogo />
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}>
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {menuGroups.map((group) => (
              <MenuGroup
                key={group.label}
                label={group.label}
                items={group.items}
                cta={group.cta}
              />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="md:hidden ml-auto flex items-center gap-2">
          {isAuthenticated && !isLoading ? (
            <>
              <UserMenu />
            </>
          ) : (
            <>
              <Button asChild size="icon" variant="ghost">
                <Link to="/login">
                  <LogIn className="h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
          <MobileNav menuGroups={menuGroups} />
        </div>
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && !isLoading ? (
            <>
              <UserMenu />
              <ModeToggle />
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar sesión
                </Link>
              </Button>
              <ModeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

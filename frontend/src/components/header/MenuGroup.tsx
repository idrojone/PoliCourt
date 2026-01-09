import type { ReactNode } from "react"
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { ListItem } from "@/components/header/ListItem"
import type { NavItem } from "@/routes/nav"

export type MenuGroupProps = {
  label: string
  items: NavItem[]
  cta?: {
    to: string
    icon?: ReactNode
    label: string
  }
}

export const MenuGroup = ({ label, items, cta }: MenuGroupProps) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        {cta && (
          <div className="w-full p-2">
            <NavigationMenuLink asChild>
              <Link
                to={cta.to}
                className="flex select-none items-center gap-2 rounded-md p-3 text-sm font-semibold leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                {cta.icon}
                {cta.label}
              </Link>
            </NavigationMenuLink>
            <div className="my-2 h-px bg-muted" />
          </div>
        )}

        <ul className="grid w-75 gap-3 p-4 md:w-100 lg:w-125 lg:grid-cols-[1fr_1fr]">
          {items.map((item) => (
            <ListItem key={item.title} title={item.title} href={item.href}>
              {item.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

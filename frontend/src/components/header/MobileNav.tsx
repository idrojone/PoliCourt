import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import type { NavItem } from "@/routes/nav";
import type { MenuGroupProps } from "./MenuGroup";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { UserMenu } from "./UserMenu";

type MobileNavProps = {
  menuGroups: Array<{
    label: string;
    items: NavItem[];
    cta?: MenuGroupProps["cta"];
  }>;
};

export const MobileNav = ({ menuGroups }: MobileNavProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  useEffect(() => {
    const windowWidth = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setOpen(false);
      }
    };
    if (windowWidth.matches) setOpen(false);
    windowWidth.addEventListener("change", handleChange);
    return () => windowWidth.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menú"
            className="hover:bg-secondary/50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-75 sm:w-87.5 p-0 border-l border-border/40 md:hidden">
          <SheetHeader className="space-y-0">
            <div className="flex items-center justify-between pr-10 gap-3">
              <div className="flex items-center gap-2">
                <SheetTitle>Menú</SheetTitle>
              </div>
              {/* <UserMenu /> */}
              <ModeToggle />
            </div>
          </SheetHeader>
          {/* Contenedor scrollable para el contenido */}
          <div className="px-6 py-6 h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="flex flex-col space-y-8">
              {/* Enlace Home destacado */}
              <div>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center py-2 text-lg font-semibold tracking-tight transition-colors hover:text-primary">
                  Home
                </Link>
                <Separator className="mt-4" />
              </div>

              {menuGroups.map((group) => (
                <div key={group.label} className="flex flex-col space-y-3">
                  {/* Encabezado del grupo */}
                  <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    {group.label}
                  </h4>

                  <div className="flex flex-col space-y-1">
                    {/* CTA Especial (ej: Todas las instalaciones) */}
                    {group.cta && (
                      <Link
                        to={group.cta.to}
                        onClick={() => setOpen(false)}
                        className="mb-2 group flex items-center gap-3 rounded-md bg-secondary/20 px-3 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/40">
                        {group.cta.icon && (
                          <span className="opacity-70 transition-opacity group-hover:opacity-100">
                            {group.cta.icon}
                          </span>
                        )}
                        {group.cta.label}
                      </Link>
                    )}

                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-all hover:bg-muted/50 hover:text-foreground">
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          {/* {item.description && (
                            <span className="text-xs font-normal text-muted-foreground line-clamp-1">
                              {item.description}
                            </span>
                          )} */}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

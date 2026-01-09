import type { ReactNode } from "react";
import { HeaderLayout } from "@/layout/HeaderLayout";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex max-h-screen flex-col bg-background">
      <HeaderLayout />
      <main>
        {children}
      </main>
    </div>
  );
};
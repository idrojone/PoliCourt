import type { ReactNode } from "react";
import { HeaderLayout } from "@/layout/HeaderLayout";
import { FooterLayout } from "@/layout/FooterLayout";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex max-h-screen flex-col bg-background">
      <HeaderLayout />
      <main className="mb-10">
        {children}
      </main>
      <FooterLayout />
    </div>
  );
};
import type { ReactNode } from "react";

interface TitileProps {
  title: string;
  icon: ReactNode;
}

export function Titile({ title, icon }: TitileProps) {

    return (
      <div className="flex justify-center items-center mt-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl inline-flex items-center gap-2">
            {title}
            {icon}
        </h1>
      </div>
    );
}
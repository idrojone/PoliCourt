// frontend/src/pages/SportDetailPage.tsx
import { useParams } from "react-router-dom";
import { useSport } from "@/features/sport/hooks/useSport";

export const SportDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { deportes } = useSport();

  // Buscamos el deporte específico basado en el slug de la URL
  const sportInfo = deportes.find((s) => s.slug === slug);

  if (!sportInfo) {
    return <div>Deporte no encontrado</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{sportInfo.name}</h1>
      <p className="mt-4">{sportInfo.description}</p>
      <img
        src={sportInfo.image}
        alt={sportInfo.name}
        className="mt-4 w-full max-w-2xl"
      />
    </div>
  );
};

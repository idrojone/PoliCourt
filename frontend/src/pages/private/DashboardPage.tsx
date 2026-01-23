import { LeftMenu } from "@/components/dashboard/left-menu";
import { useParams } from "react-router-dom";

// import { ClasesDashboard } from "@/features/clases/components/clases-dashboard";

export const DashboardPage = () => {
  // const { user, logout } = useAuthContext();
  const { page } = useParams();

  const pages = [
    "deportes",
    "pistas",
    "clubes",
    "clases",
    "reservas",
    "usuarios",
  ];

  const currentPage = pages.includes(page || "") ? page : undefined;

  const renderContent = () => {
    switch (currentPage) {
      case "deportes":
        return <div>hola</div>;
      case "pistas":
        return <div>hola</div>;
      case "clubes":
        return <div>hola</div>;
      case "clases":
        return <div>hola</div>;
      case "reservas":
        return <div>hola</div>;
      case "usuarios":
        return <div>hola</div>;
      default:
        return <div>Página no encontrada</div>;
    }
  };

  return (
    <div className="flex gap-4 items-start">
      <LeftMenu user={user} logout={logout} />
      <div className="ml-4 flex-1">{renderContent()}</div>
    </div>
  );
};

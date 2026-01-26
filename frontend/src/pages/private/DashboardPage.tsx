// import { LeftMenu } from "@/components/dashboard/left-menu";
import { useParams } from "react-router-dom";
import { DashboardSport } from "./DashboardSport";
import { LeftMenu } from "@/components/dashboard/left-menu";
import { DashboardCourt } from "./DashboardCourt";
import { DashboardUsers } from "./DashboardUsers";

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
  console.log(currentPage);

  const renderContent = () => {
    switch (currentPage) {
      case "deportes":
        console.log("deportes");
        return <DashboardSport />;
      case "pistas":
        return <DashboardCourt />;
      case "clubes":
        return <div>hola</div>;
      case "clases":
        return <div>hola</div>;
      case "reservas":
        return <div>hola</div>;
      case "usuarios":
        return <DashboardUsers />;
      default:
        console.log("default");
        return <div>Página no encontrada</div>;
    }
  };

  return (
    <div className="flex gap-4 items-start">
      <LeftMenu /*user={user} logout={logout}*/ />
      <div className="ml-4 flex-1">{renderContent()}</div>
    </div>
  );
};

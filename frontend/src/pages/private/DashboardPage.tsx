// import { LeftMenu } from "@/components/dashboard/left-menu";
import { useParams } from "react-router-dom";
import { DashboardSport } from "./DashboardSport";
import { LeftMenu } from "@/components/dashboard/left-menu";
import { DashboardCourt } from "./DashboardCourt";
import { DashboardUsers } from "./DashboardUsers";
import { DashboardRentals } from "./DashboardRentals";
import { DashboardClasses } from "./DashboardClasses";
import { DashboardTrainings } from "./DashboardTrainings";
import { DashboardMaintenances } from "./DashboardMaintenances";
import { DashboardCalendar } from "./DashboardCalendar";

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
    "alquileres",
    "entrenamientos",
    "mantenimientos",
    "usuarios",
    "calendario",
  ];

  const currentPage = pages.includes(page || "") ? page : undefined;
  console.log(currentPage);

  const renderContent = () => {
    switch (currentPage) {
      case "deportes":
        // console.log("deportes");
        return <DashboardSport />;
      case "pistas":
        return <DashboardCourt />;
      case "clubes":
        return <div>hola</div>;
      case "clases":
        return <DashboardClasses />;
      case "reservas":
        return <DashboardRentals />;
      case "alquileres":
        return <DashboardRentals />;
      case "entrenamientos":
        return <DashboardTrainings />;
      case "mantenimientos":
        return <DashboardMaintenances />;
      case "usuarios":
        return <DashboardUsers />;
      case "calendario":
        return <DashboardCalendar />;
      default:
        console.log("default");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="shrink-0">
        <LeftMenu /*user={user} logout={logout}*/ />
      </div>
      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto ml-10 mr-10">{renderContent()}</div>
    </div>
  );
};

import { useParams } from "react-router-dom";
import { DashboardSport } from "./DashboardSport";
import { LeftMenu } from "@/components/dashboard/left-menu";
import { DashboardCourt } from "./DashboardCourt";
import { DashboardClub } from "./DashboardClub";
import { DashboardUser } from "./DashboardUser";

export const DashboardPage = () => {
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
                return <DashboardSport />;
            case "pistas":
                return <DashboardCourt />;
            case "clubes":
                return <DashboardClub />;
            case "clases":
            // return <DashboardClasses />;
            case "reservas":
            // return <DashboardRentals />;
            case "alquileres":
            // return <DashboardRentals />;
            case "entrenamientos":
            // return <DashboardTrainings />;
            case "mantenimientos":
            // return <DashboardMaintenances />;
            case "usuarios":
                return <DashboardUser />;
            case "calendario":
            // return <DashboardCalendar />;
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

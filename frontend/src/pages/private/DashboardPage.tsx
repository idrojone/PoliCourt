import { useParams } from "react-router-dom";
import { DashboardSport } from "./DashboardSport";
import { LeftMenu } from "@/components/dashboard/left-menu";
import { DashboardCourt } from "./DashboardCourt";
import { DashboardClub } from "./DashboardClub";
import { DashboardUser } from "./DashboardUser";
import { DashboardCalendar } from "./DashboardCalendar";
import { RequestMonitorDashboard } from "./RequestMonitor";
import { DashboardPayments } from "./DashboardPayments";

export const DashboardPage = () => {
    const { page } = useParams();

    const pages = [
        "deportes",
        "monitores",
        "pistas",
        "clubes",
        "clases",
        "reservas",
        "alquileres",
        "entrenamientos",
        "mantenimientos",
        "usuarios",
        "calendario",
        "pagos",
    ];

    const currentPage = pages.includes(page || "") ? page : undefined;
    console.log(currentPage);

    const renderContent = () => {
        switch (currentPage) {
            case "deportes":
                return <DashboardSport />;
            case "monitores":
                return <RequestMonitorDashboard />;
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
                return <DashboardCalendar />;
            case "pagos":
                return <DashboardPayments />;
            default:
                console.log("default");
        }
    };

    return (
        <div className="flex h-screen overflow-y-auto no-scrollbar">
            <div className="shrink-0">
                <LeftMenu /*user={user} logout={logout}*/ />
            </div>
            <div className="flex-1 overflow-visible ml-10 mr-10">{renderContent()}</div>
        </div>
    );
};

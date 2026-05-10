import { DashboardLayout } from "@/layout/dashboard";
import { PaymentKpiCards } from "@/features/payments/components/payment-kpi-cards";
import { RevenueChart } from "@/features/payments/components/revenue-chart";
import { StatusChart } from "@/features/payments/components/status-chart";
import { SportRevenueChart } from "@/features/payments/components/sport-revenue-chart";

export const DashboardPayments = () => {
    return (
        <DashboardLayout title="Pagos">
            <div className="space-y-6">
                {/* KPI Cards */}
                <PaymentKpiCards />

                {/* Revenue Chart - full width */}
                <RevenueChart />

                {/* Status + Sport charts - side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StatusChart />
                    <SportRevenueChart />
                </div>
            </div>
        </DashboardLayout>
    );
};

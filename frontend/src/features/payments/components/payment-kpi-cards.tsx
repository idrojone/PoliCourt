import { usePaymentSummaryQuery } from "../queries/usePaymentAnalytics";
import {
    DollarSign,
    CreditCard,
    TrendingUp,
    RotateCcw,
} from "lucide-react";
import { Loader2 } from "lucide-react";

export function PaymentKpiCards() {
    const { data, isLoading, isError } = usePaymentSummaryQuery();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card p-6 shadow-sm animate-pulse"
                    >
                        <div className="h-4 w-24 bg-muted rounded mb-3" />
                        <div className="h-8 w-32 bg-muted rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="text-center text-muted-foreground py-4">
                Error al cargar los KPIs
            </div>
        );
    }

    const kpis = [
        {
            title: "Ingresos Totales",
            value: `${data.totalRevenue.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€`,
            description: `${data.succeededPayments} pagos exitosos`,
            icon: DollarSign,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            title: "Total de Pagos",
            value: data.totalPayments.toLocaleString("es-ES"),
            description: `Tasa de éxito: ${data.successRate}%`,
            icon: CreditCard,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Ticket Medio",
            value: `${data.averageTicket.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€`,
            description: "Por pago exitoso",
            icon: TrendingUp,
            color: "text-violet-500",
            bgColor: "bg-violet-500/10",
        },
        {
            title: "Reembolsos",
            value: data.refundedCount.toLocaleString("es-ES"),
            description: `${data.refundedTotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€ devueltos`,
            icon: RotateCcw,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={kpi.title}
                        className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">
                                {kpi.title}
                            </span>
                            <div className={`rounded-lg p-2 ${kpi.bgColor}`}>
                                <Icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold tracking-tight">
                            {kpi.value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {kpi.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

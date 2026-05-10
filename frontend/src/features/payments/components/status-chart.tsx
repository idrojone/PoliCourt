import { Cell, Pie, PieChart, Legend } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { usePaymentsByStatusQuery } from "../queries/usePaymentAnalytics";
import { Loader2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    SUCCEEDED: "hsl(142, 76%, 36%)",
    FAILED: "hsl(0, 84%, 60%)",
    REFUNDED: "hsl(45, 93%, 47%)",
};

const STATUS_LABELS: Record<string, string> = {
    SUCCEEDED: "Exitosos",
    FAILED: "Fallidos",
    REFUNDED: "Reembolsados",
};

const chartConfig: ChartConfig = {
    SUCCEEDED: {
        label: "Exitosos",
        color: STATUS_COLORS.SUCCEEDED,
    },
    FAILED: {
        label: "Fallidos",
        color: STATUS_COLORS.FAILED,
    },
    REFUNDED: {
        label: "Reembolsados",
        color: STATUS_COLORS.REFUNDED,
    },
};

export function StatusChart() {
    const { data, isLoading, isError } = usePaymentsByStatusQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Error al cargar los datos
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: STATUS_LABELS[item.status] || item.status,
        value: item.count,
        fill: STATUS_COLORS[item.status] || "hsl(210, 40%, 50%)",
        status: item.status,
    }));

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Pagos por Estado</h3>
                <p className="text-sm text-muted-foreground">
                    Distribución de pagos según su resultado
                </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart accessibilityLayer>
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) =>
                                    `${value} pagos`
                                }
                            />
                        }
                    />
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        strokeWidth={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.fill}
                                stroke={entry.fill}
                            />
                        ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
            </ChartContainer>
        </div>
    );
}

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { useRevenueBySportQuery } from "../queries/usePaymentAnalytics";
import { Loader2 } from "lucide-react";

const chartConfig = {
    total: {
        label: "Ingresos (€)",
        color: "hsl(221, 83%, 53%)",
    },
} satisfies ChartConfig;

export function SportRevenueChart() {
    const { data, isLoading, isError } = useRevenueBySportQuery();

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
        sport: item.sport,
        total: item.total,
        count: item.count,
    }));

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Ingresos por Deporte</h3>
                <p className="text-sm text-muted-foreground">
                    Distribución de ingresos según el deporte de la reserva
                </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    accessibilityLayer
                    margin={{ left: 20 }}
                >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="sport"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={100}
                    />
                    <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}€`}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                formatter={(value) => `${Number(value).toFixed(2)}€`}
                            />
                        }
                    />
                    <Bar
                        dataKey="total"
                        fill="var(--color-total)"
                        radius={[0, 6, 6, 0]}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}

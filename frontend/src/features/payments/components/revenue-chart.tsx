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
import { useMonthlyRevenueQuery } from "../queries/usePaymentAnalytics";
import { Loader2 } from "lucide-react";

const MONTH_NAMES = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const chartConfig = {
    total: {
        label: "Ingresos (€)",
        color: "hsl(142, 76%, 36%)",
    },
} satisfies ChartConfig;

export function RevenueChart() {
    const { data, isLoading, isError } = useMonthlyRevenueQuery();

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
        month: `${MONTH_NAMES[item.month - 1]} ${item.year}`,
        total: item.total,
        count: item.count,
    }));

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Ingresos Mensuales</h3>
                <p className="text-sm text-muted-foreground">
                    Evolución de ingresos por pagos exitosos
                </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis
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
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}

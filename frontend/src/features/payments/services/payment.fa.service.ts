import { api } from "@/lib/axios.fa";

export interface MonthlyRevenueItem {
    year: number;
    month: number;
    total: number;
    count: number;
}

export interface PaymentByStatus {
    status: string;
    count: number;
    total: number;
}

export interface RevenueBySport {
    sport: string;
    total: number;
    count: number;
}

export interface PaymentSummary {
    totalRevenue: number;
    totalPayments: number;
    succeededPayments: number;
    averageTicket: number;
    successRate: number;
    refundedCount: number;
    refundedTotal: number;
}

export const getMonthlyRevenue = async (months = 12): Promise<MonthlyRevenueItem[]> => {
    return await api
        .get("/payments/analytics/monthly-revenue", { params: { months } })
        .then((res) => res.data.data);
};

export const getPaymentsByStatus = async (): Promise<PaymentByStatus[]> => {
    return await api
        .get("/payments/analytics/by-status")
        .then((res) => res.data.data);
};

export const getRevenueBySport = async (): Promise<RevenueBySport[]> => {
    return await api
        .get("/payments/analytics/by-sport")
        .then((res) => res.data.data);
};

export const getPaymentSummary = async (): Promise<PaymentSummary> => {
    return await api
        .get("/payments/analytics/summary")
        .then((res) => res.data.data);
};

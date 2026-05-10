import { useQuery } from "@tanstack/react-query";
import {
    getMonthlyRevenue,
    getPaymentsByStatus,
    getRevenueBySport,
    getPaymentSummary,
} from "../services/payment.fa.service";

export const useMonthlyRevenueQuery = (months = 12) => {
    return useQuery({
        queryKey: ["payments", "monthly-revenue", months],
        queryFn: () => getMonthlyRevenue(months),
        staleTime: 5 * 60 * 1000,
    });
};

export const usePaymentsByStatusQuery = () => {
    return useQuery({
        queryKey: ["payments", "by-status"],
        queryFn: getPaymentsByStatus,
        staleTime: 5 * 60 * 1000,
    });
};

export const useRevenueBySportQuery = () => {
    return useQuery({
        queryKey: ["payments", "by-sport"],
        queryFn: getRevenueBySport,
        staleTime: 5 * 60 * 1000,
    });
};

export const usePaymentSummaryQuery = () => {
    return useQuery({
        queryKey: ["payments", "summary"],
        queryFn: getPaymentSummary,
        staleTime: 5 * 60 * 1000,
    });
};

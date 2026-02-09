import type { Court } from "@/features/types/court/Court"
import { api } from "@/lib/axios.fa"
import { mapCourtFromApi } from "./courtMapper"



export const getCourts = async (): Promise<Court[]> => {
    const res = await api.get("/courts");
    const data = res.data.data;
    const list = Array.isArray(data) ? data : data?.content || [];
    return list.map(mapCourtFromApi);
}

export const getCourtsActivePublished = async (): Promise<Court[]> => {
    return await api
        .get("courts/active-published")
        .then((res) => res.data.data.map(mapCourtFromApi))
}

import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import { api as sbApi } from "@/lib/axios.sb";

export const getMaxMinPriceCapacityCourt = async (params: Partial<GetCourtsParams> = {}): Promise<{min_price:number, max_price:number, min_capacity:number, max_capacity:number}> => {
    // Use Springboot API to compute accurate filters when query params like sports are present
    const sp = new URLSearchParams();
    if (params.q) sp.append("q", params.q);
    if (params.name) sp.append("name", params.name);
    if (params.locationDetails) sp.append("locationDetails", params.locationDetails);
    if (params.priceMin != null) sp.append("priceMin", String(params.priceMin));
    if (params.priceMax != null) sp.append("priceMax", String(params.priceMax));
    if (params.capacityMin != null) sp.append("capacityMin", String(params.capacityMin));
    if (params.capacityMax != null) sp.append("capacityMax", String(params.capacityMax));
    if (params.isIndoor != null) sp.append("isIndoor", String(params.isIndoor));
    params.surface?.forEach((s) => sp.append("surface", s));
    params.status?.forEach((s) => sp.append("status", s));
    params.sports?.forEach((s) => sp.append("sports", s));
    if (params.isActive != null) sp.append("isActive", String(params.isActive));

    // request a large page to approximate global min/max for the filtered set
    sp.append("page", "1");
    sp.append("limit", "1000");

    const res = await sbApi.get(`/courts?${sp.toString()}`);
    const data = res?.data?.data;
    const list = Array.isArray(data) ? data : data?.content || [];

    if (!Array.isArray(list)) throw new Error("Invalid response from courts list");

    const prices = list.map((c: any) => Number(c.priceH ?? c.price_h ?? 0)).filter((v: number) => !Number.isNaN(v));
    const capacities = list.map((c: any) => Number(c.capacity ?? 0)).filter((v: number) => !Number.isNaN(v));

    const min_price = prices.length ? Math.min(...prices) : 0;
    const max_price = prices.length ? Math.max(...prices) : 5000;
    const min_capacity = capacities.length ? Math.min(...capacities) : 0;
    const max_capacity = capacities.length ? Math.max(...capacities) : 500;

    return {
        min_price,
        max_price,
        min_capacity,
        max_capacity,
    }
}
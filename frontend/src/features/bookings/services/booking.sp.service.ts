import type { BookingPayload } from "@/features/types/bookings/BookingPayload";
import type { BookingPage, BookingSearchParams } from "@/features/types/bookings/BookingRecord";
import type { BookedSlot } from "@/features/types/bookings/BookedSlot";
import type { PaymentIntentCreateResponse } from "@/features/types/bookings/PaymentIntentCreateResponse";
import { api } from "@/lib/axios.sb";

export const getBookedSlots = async (slug: string): Promise<BookedSlot[]> => {
    return await api.get(`/bookings/courts/${slug}`).then((res) => res.data.data);
};

export const createBookingIntent = async (payload: BookingPayload): Promise<PaymentIntentCreateResponse> => {
    return await api.post("/payments/intent", payload).then((res) => {
        console.log("createBookingIntent response", res.data);
        return res.data.data;
    });
};

export const searchBookings = async (params: BookingSearchParams): Promise<BookingPage> => {
    return await api.get("/bookings", { params }).then((res) => res.data.data);
};
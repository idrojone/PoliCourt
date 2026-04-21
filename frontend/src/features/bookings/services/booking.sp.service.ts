import type { BookingPayload } from "@/features/types/bookings/BookingPayload";
import type { BookingPage, BookingSearchParams } from "@/features/types/bookings/BookingRecord";
import type { BookedSlot } from "@/features/types/bookings/BookedSlot";
import type { BookingCancellationResponse } from "@/features/types/bookings/BookingCancellationResponse";
import type { PaymentIntentCreateResponse } from "@/features/types/bookings/PaymentIntentCreateResponse";
import type { ClassEnrollmentRequest } from "@/features/types/bookings/ClassEnrollmentRequest";
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

export const createClassEnrollmentIntent = async (
    payload: ClassEnrollmentRequest,
): Promise<PaymentIntentCreateResponse> => {
    return await api.post("/payments/intent/class", payload).then((res) => {
        console.log("createClassEnrollmentIntent response", res.data);
        return res.data.data;
    });
};

export const searchBookings = async (params: BookingSearchParams): Promise<BookingPage> => {
    return await api.get("/bookings", { params }).then((res) => res.data.data);
};

export const cancelBookingByUser = async (
    bookingUuid: string,
    username: string,
): Promise<BookingCancellationResponse> => {
    return await api
        .delete(`/bookings/${bookingUuid}/cancel`, { params: { username } })
        .then((res) => res.data.data);
};
import type { BookingPage, BookingResponse } from "@/features/types/bookings/BookingRecord";
import type { BookingClassCreateRequest } from "@/features/types/bookings/BookingPayload";
import { api } from "@/lib/axios.sb";

export const getClassMonitor = async (username: string): Promise<BookingPage> => {
    return await api
        .get("/bookings/classes", { params: { organizerUsername: username, status: "CONFIRMED", isActive: true } })
        .then((res) => res.data.data);
};

export const createClass = async (payload: BookingClassCreateRequest): Promise<BookingResponse> => {
    return await api.post("/bookings/classes", payload).then((res) => res.data.data);
};

export const updateClass = async (
    uuid: string,
    payload: Partial<BookingClassCreateRequest>
): Promise<BookingResponse> => {
    return await api.put(`/bookings/classes/${uuid}`, payload).then((res) => res.data.data);
};

export const deleteClassByMonitor = async (uuid: string, username: string): Promise<void> => {
    // Endpoint expects DELETE /bookings/classes/{uuid}?username={username}
    await api.delete(`/bookings/classes/${uuid}`, { params: { username } }).then(() => {});
};
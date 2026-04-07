export interface BookingPayload {
    courtSlug: string;
    organizerUsername: string;
    sportSlug: string;
    startTime: string;
    endTime: string;
}

export interface BookingClassCreateRequest extends BookingPayload {
    title: string;
    description?: string;
    totalPrice?: number;
    attendeePrice?: number;
}
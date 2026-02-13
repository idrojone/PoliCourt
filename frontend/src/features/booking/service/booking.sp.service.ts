import { api } from "@/lib/axios.sb";
import type {
  Booking,
  BookingStatus,
  CreateBookingDTO,
  CreateRentalDTO,
  UpdateBookingDTO,
  UpdateRentalDTO,
  GetBookingsParams,
  PageBookingResponse,
} from "@/features/types/booking";

// ========================
// Helpers
// ========================

const buildBookingSearchParams = (params: Partial<GetBookingsParams>): URLSearchParams => {
  const sp = new URLSearchParams();
  if (params.q) sp.append("q", params.q);
  if (params.courtSlug) sp.append("courtSlug", params.courtSlug);
  if (params.organizerUsername) sp.append("organizerUsername", params.organizerUsername);
  if (params.status) sp.append("status", params.status);
  if (params.isActive != null) sp.append("isActive", String(params.isActive));
  if (params.startTime) sp.append("startTime", params.startTime);
  if (params.endTime) sp.append("endTime", params.endTime);
  if (params.minPrice != null) sp.append("minPrice", String(params.minPrice));
  if (params.maxPrice != null) sp.append("maxPrice", String(params.maxPrice));
  if (params.page != null) sp.append("page", String(params.page));
  if (params.limit != null) sp.append("limit", String(params.limit));
  if (params.sort) sp.append("sort", params.sort);
  return sp;
};

// ========================
// GET endpoints por tipo (paginados)
// ========================

export const getRentals = async (): Promise<Booking[]> => {
  return await api.get("/bookings/rentals").then((res) => {
    const data = res.data.data;
    if (data?.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  });
};

export const getClasses = async (): Promise<Booking[]> => {
  return await api.get("/bookings/classes").then((res) => {
    const data = res.data.data;
    if (data?.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  });
};

export const getTrainings = async (): Promise<Booking[]> => {
  return await api.get("/bookings/trainings").then((res) => {
    const data = res.data.data;
    if (data?.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  });
};

export const getRentalsPage = async (
  params: Partial<GetBookingsParams> = {},
): Promise<PageBookingResponse> => {
  const sp = buildBookingSearchParams(params);
  return await api.get(`/bookings/rentals?${sp.toString()}`).then((res) => res.data.data as PageBookingResponse);
};

export const getClassesPage = async (
  params: Partial<GetBookingsParams> = {},
): Promise<PageBookingResponse> => {
  const sp = buildBookingSearchParams(params);
  return await api.get(`/bookings/classes?${sp.toString()}`).then((res) => res.data.data as PageBookingResponse);
};

export const getTrainingsPage = async (
  params: Partial<GetBookingsParams> = {},
): Promise<PageBookingResponse> => {
  const sp = buildBookingSearchParams(params);
  return await api.get(`/bookings/trainings?${sp.toString()}`).then((res) => res.data.data as PageBookingResponse);
};

export const getBookingBySlug = async (slug: string): Promise<Booking> => {
  return await api.get(`/bookings/${slug}`).then((res) => res.data.data);
};


// ========================
// POST endpoints por tipo
// ========================

/**
 * Crea un RENTAL - solo necesita courtSlug, organizerUsername, startTime, endTime.
 * El backend genera el título automáticamente y calcula el precio.
 */
export const createRental = async (
  payload: CreateRentalDTO
): Promise<Booking> => {
  return await api.post("/bookings/rentals", payload).then((res) => res.data.data);
};

/**
 * Crea una CLASS - necesita todos los campos del CreateBookingDTO.
 * El organizador debe ser un MONITOR.
 */
export const createClass = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/classes", payload).then((res) => res.data.data);
};

/**
 * Crea un TRAINING - necesita todos los campos del CreateBookingDTO.
 * El organizador debe ser un COACH.
 */
export const createTraining = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/trainings", payload).then((res) => res.data.data);
};

// ========================
// PUT endpoints (actualización)
// ========================

/**
 * Actualiza un RENTAL - solo se pueden modificar startTime y endTime.
 * El precio se recalcula automáticamente.
 * NO se puede cambiar la pista ni el usuario.
 */
export const updateRental = async (
  slug: string,
  payload: UpdateRentalDTO
): Promise<Booking> => {
  return await api
    .put(`/bookings/rentals/${slug}`, payload)
    .then((res) => res.data.data);
};

/**
 * Actualiza una CLASS - se puede modificar título, descripción y horas.
 * Si cambia el título, se regenera el slug.
 * NO se puede cambiar la pista ni el usuario.
 */
export const updateClass = async (
  slug: string,
  payload: UpdateBookingDTO
): Promise<Booking> => {
  return await api
    .put(`/bookings/classes/${slug}`, payload)
    .then((res) => res.data.data);
};

/**
 * Actualiza un TRAINING - se puede modificar título, descripción y horas.
 * Si cambia el título, se regenera el slug.
 * NO se puede cambiar la pista ni el usuario.
 */
export const updateTraining = async (
  slug: string,
  payload: UpdateBookingDTO
): Promise<Booking> => {
  return await api
    .put(`/bookings/trainings/${slug}`, payload)
    .then((res) => res.data.data);
};

// ========================
// PATCH endpoints
// ========================

export const updateBookingStatus = async (
  slug: string,
  status: BookingStatus
): Promise<Booking> => {
  return await api
    .patch(`/bookings/${slug}/status`, { status })
    .then((res) => res.data.data);
};

export const updateBookingActive = async (
  slug: string,
  isActive: boolean
): Promise<Booking> => {
  return await api
    .patch(`/bookings/${slug}/active`, { isActive })
    .then((res) => res.data.data);
};

export const toggleBookingActive = async (slug: string): Promise<Booking> => {
  return await api
    .patch(`/bookings/${slug}/toggle-active`)
    .then((res) => res.data.data);
};
